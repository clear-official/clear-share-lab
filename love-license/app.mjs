import {TYPES, QUESTIONS, judge, postText} from "./diagnosis.mjs";

const KEY = "clear-love-license-5x7-v1";
const MAX_NAME = 12;
const FONT = '"Hiragino Maru Gothic ProN","Yu Gothic","Meiryo",sans-serif';
const CONFIG = window.LOVE_LICENSE_CONFIG || {};
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const chars = value => typeof Intl.Segmenter === "function"
  ? Array.from(new Intl.Segmenter("ja",{granularity:"grapheme"}).segment(value),item=>item.segment)
  : Array.from(value);
const typeById = id => TYPES.find(type=>type.id===id);
const localDate = () => {
  const d=new Date();
  return d.getFullYear()+"."+String(d.getMonth()+1).padStart(2,"0")+"."+String(d.getDate()).padStart(2,"0");
};
const blankState = () => ({answers:Array(7).fill(null),questionIndex:0,resultId:null,date:null,name:""});
function readState() {
  try {
    const raw=JSON.parse(sessionStorage.getItem(KEY));
    if (!raw || !Array.isArray(raw.answers) || raw.answers.length!==7 ||
        !raw.answers.every(answer=>answer===null || (Number.isInteger(answer)&&answer>=0&&answer<4))) return blankState();
    const outcome=judge(raw.answers);
    const date=typeof raw.date==="string" && /^\d{4}\.\d{2}\.\d{2}$/.test(raw.date) ? raw.date : null;
    return {
      answers:raw.answers,questionIndex:Number.isInteger(raw.questionIndex)?Math.max(0,Math.min(6,raw.questionIndex)):0,
      resultId:outcome?.typeId||null,date:outcome?date:null,
      name:chars(String(raw.name||"")).slice(0,MAX_NAME).join("")
    };
  } catch { return blankState(); }
}
let state=readState();
const persist=()=>sessionStorage.setItem(KEY,JSON.stringify(state));
let assetsPromise;
let generation;
let imageBlob;
let imageURL;
let renderedKey="";
let answerTimer;
let answerLocked=false;
let operationLocked=false;

function navigate(screen) {
  if (location.hash==="#"+screen) showScreen();
  else location.hash=screen;
  scrollTo(0,0);
}
function showScreen() {
  let screen=location.hash.slice(1);
  if (!["home","quiz","result","share"].includes(screen)) screen="home";
  if ((screen==="result"||screen==="share") && !state.resultId) screen="home";
  $$(".screen").forEach(node=>node.hidden=node.id!==screen+"-screen");
  document.title="恋愛運転免許証｜"+({home:"診断",quiz:"質問",result:"診断結果",share:"シェアで100pt"}[screen]);
  if (screen==="quiz") renderQuiz();
  if (screen==="result") { renderResult();ensureImage().catch(()=>{}); }
  if (screen==="share") { updateShareControls();ensureImage().catch(()=>{}); }
}

function renderQuiz() {
  const q=QUESTIONS[state.questionIndex];
  $("#quiz-intro").hidden=state.questionIndex!==0;
  $("#quiz-progress").textContent=(state.questionIndex+1)+" / 7";
  $("#quiz-title").textContent=q.title;
  $("#quiz-prompt").textContent=q.prompt;
  $("#answer-status").textContent="";
  $("#back-question").hidden=state.questionIndex===0;
  const group=$("#quiz-options");
  group.replaceChildren();
  q.options.forEach((option,index)=>{
    const button=document.createElement("button");
    button.type="button";button.className="answer";
    button.setAttribute("aria-pressed",String(state.answers[state.questionIndex]===index));
    const number=document.createElement("span");number.className="answer-number";number.textContent=String(index+1);
    const label=document.createElement("span");label.textContent=option;
    button.append(number,label);
    button.addEventListener("click",()=>answer(index));
    group.append(button);
  });
}
function answer(choice) {
  if (answerLocked) return;
  answerLocked=true;
  const questionIndex=state.questionIndex;
  state.answers[questionIndex]=choice;
  persist();
  $$(".answer").forEach((button,index)=>{
    button.setAttribute("aria-pressed",String(index===choice));
    button.disabled=true;
  });
  $("#answer-status").textContent="選択しました";
  answerTimer=setTimeout(()=>{
    answerTimer=null;
    answerLocked=false;
    if (location.hash!=="#quiz" || state.questionIndex!==questionIndex) return;
    if (questionIndex<6) {state.questionIndex++;persist();renderQuiz();scrollTo(0,0);return;}
    const outcome=judge(state.answers);
    if (!outcome) { $("#answer-status").textContent="すべての質問に回答してください。";renderQuiz();return; }
    state.resultId=outcome.typeId;
    if (!state.date) state.date=localDate();
    persist();
    renderedKey="";
    navigate("result");
  },240);
}
function cancelAnswerTimer() {
  if (answerTimer) clearTimeout(answerTimer);
  answerTimer=null;
  answerLocked=false;
}

function loadImage(src) {
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=async()=>{try{if(img.decode)await img.decode();resolve(img);}catch(error){reject(error);}};
    img.onerror=()=>reject(new Error("画像素材を読み込めませんでした"));
    img.src=src;
  });
}
function assets() {
  if (!assetsPromise) assetsPromise=Promise.all([
    loadImage("assets/license-base.png"),
    loadImage("assets/ria-reference.png"),
    document.fonts.ready
  ]);
  return assetsPromise;
}
function fitOneLine(ctx,text,x,y,maxWidth,initial,min) {
  let size=initial;
  while (size>=min) {
    ctx.font="900 "+size+"px "+FONT;
    if (ctx.measureText(text).width<=maxWidth) break;
    size--;
  }
  if (size<min) throw new Error("文字が枠に収まりませんでした");
  ctx.fillText(text,x,y);
}
function wrapAtWidth(ctx,text,maxWidth) {
  const glyphs=chars(text);
  const greedy=[];
  let current="";
  for (const glyph of glyphs) {
    if (current && ctx.measureText(current+glyph).width>maxWidth) {greedy.push(current);current=glyph;}
    else current+=glyph;
  }
  if (current) greedy.push(current);
  if (greedy.length!==2) return greedy;
  let best=greedy,score=Infinity;
  for (let i=2;i<=glyphs.length-2;i++) {
    const a=glyphs.slice(0,i).join(""),b=glyphs.slice(i).join("");
    const aw=ctx.measureText(a).width,bw=ctx.measureText(b).width;
    if (aw>maxWidth||bw>maxWidth||/^[、。！？）」]/.test(b)) continue;
    const candidate=Math.abs(aw-bw)-(a.endsWith("、")||a.endsWith("。")?16:0);
    if (candidate<score) {score=candidate;best=[a,b];}
  }
  return best;
}
function drawField(ctx,text,centerY) {
  for (let size=43;size>=32;size--) {
    ctx.font="800 "+size+"px "+FONT;
    const lines=wrapAtWidth(ctx,text,638);
    if (lines.length<=2) {
      const gap=size*1.38;
      const first=centerY-(lines.length-1)*gap/2;
      lines.forEach((line,index)=>ctx.fillText(line,325,first+index*gap));
      return;
    }
  }
  throw new Error("カードの文章が枠に収まりませんでした");
}
function drawType(ctx,name) {
  const comma=name.indexOf("、");
  const lines=comma>=0?[name.slice(0,comma+1),name.slice(comma+1)]:[name];
  ctx.fillStyle="#192c56";ctx.textAlign="left";ctx.textBaseline="middle";
  if (lines.length===1) fitOneLine(ctx,lines[0],495,288,940,66,55);
  else lines.forEach((line,index)=>fitOneLine(ctx,line,495,245+index*55,940,57,50));
}
function makeBlob(canvas) {
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("PNGを作れませんでした")),"image/png"));
}
function imageKey() {return state.resultId+"|"+state.date+"|"+state.name;}
async function generate(snapshot) {
  const [base,ria]=await assets();
  const type=typeById(snapshot.resultId);
  if (!type) throw new Error("診断結果がありません");
  const canvas=document.createElement("canvas");
  canvas.width=base.naturalWidth;canvas.height=base.naturalHeight;
  const ctx=canvas.getContext("2d");
  if (!ctx) throw new Error("画像生成を利用できません");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(base,0,0);
  // 正式見本の写真欄にある共通リアちゃんのみを使う。
  ctx.drawImage(ria,641,187,240,288,1095,350,380,456);
  ctx.fillStyle="#192c56";ctx.textAlign="left";ctx.textBaseline="middle";
  if (snapshot.name.trim()) fitOneLine(ctx,snapshot.name,331,124,622,50,32);
  fitOneLine(ctx,snapshot.date,1217,124,252,36,29);
  drawType(ctx,type.name);
  ctx.fillStyle="#192c56";
  drawField(ctx,type.lead,426);
  drawField(ctx,type.skill,619);
  drawField(ctx,type.caution,825);
  return makeBlob(canvas);
}
function imageBusy(busy) {
  $$("[data-save]").forEach(button=>button.disabled=busy);
  $("#to-share").disabled=busy;
  $("#native-share").disabled=busy||!postText(state.resultId,CONFIG.formalUrl,"public");
}
function imageError(error) {
  $("#image-error").hidden=false;
  $("#image-error span").textContent="免許証画像を生成できませんでした。"+(error?.message||"素材を確認してください。");
  if (!$("#share-screen").hidden) status("共有画像を生成できませんでした。結果画面に戻り、画像生成を再試行してください。");
}
async function ensureImage() {
  if (!state.resultId || !state.date) throw new Error("診断結果がありません");
  while (renderedKey!==imageKey() || !imageBlob) {
    if (!generation) {
      imageBusy(true);
      const snapshot={resultId:state.resultId,date:state.date,name:state.name};
      const wanted=imageKey();
      generation=generate(snapshot).then(blob=>{
        if (wanted!==imageKey()) return;
        const previous=imageURL;
        imageBlob=blob;
        imageURL=URL.createObjectURL(blob);
        renderedKey=wanted;
        $$("[data-license-image]").forEach(img=>{
          img.src=imageURL;
          img.alt=typeById(snapshot.resultId).name+"の恋愛運転免許証"+(snapshot.name.trim()?"、氏名"+snapshot.name:"");
        });
        if (previous) setTimeout(()=>URL.revokeObjectURL(previous),1200);
        $("#image-error").hidden=true;
      }).finally(()=>{generation=null;imageBusy(false);});
    }
    try { await generation; }
    catch(error) {imageError(error);throw error;}
  }
  return imageBlob;
}
function renderResult() {
  const type=typeById(state.resultId);
  if (!type) return;
  $("#result-type-name").textContent=type.name;
  $("#license-name").value=state.name;
  $("#name-count").textContent=chars(state.name).length;
  $("#summary").textContent=type.summary;
  $("#tip").textContent=type.tip;
}
function status(message) {$("#operation-status").textContent=message;}
function updateShareControls() {
  const text=postText(state.resultId,CONFIG.formalUrl,"public");
  $("#native-share").disabled=!text;
  $("#copy-post").disabled=!text;
  $("#share-unavailable").hidden=!!text;
  const sns=$("#eligible-sns");
  if (Array.isArray(CONFIG.eligibleSns)&&CONFIG.eligibleSns.length) {
    sns.hidden=false;sns.textContent="対象SNS："+CONFIG.eligibleSns.join("・");
  } else sns.hidden=true;
  const contact=$("#contact-link");
  try {
    const url=new URL(CONFIG.contactUrl);
    if (url.protocol!=="https:") throw new Error("HTTPS");
    contact.href=url.href;contact.removeAttribute("aria-disabled");
  } catch {contact.removeAttribute("href");contact.setAttribute("aria-disabled","true");}
}

$("#start-button").addEventListener("click",()=>{
  cancelAnswerTimer();
  state=blankState();persist();
  renderedKey="";imageBlob=null;
  navigate("quiz");
});
$("#show-participation").addEventListener("click",()=>{
  const panel=$("#participation-panel");
  panel.hidden=!panel.hidden;
  $("#show-participation").setAttribute("aria-expanded",String(!panel.hidden));
  if (!panel.hidden) panel.scrollIntoView({block:"nearest"});
});
$("#back-question").addEventListener("click",()=>{
  cancelAnswerTimer();
  if (state.questionIndex>0) {state.questionIndex--;persist();renderQuiz();scrollTo(0,0);}
});
$("#license-name").addEventListener("input",event=>{
  const name=chars(event.target.value).slice(0,MAX_NAME).join("");
  if (name!==event.target.value) event.target.value=name;
  state.name=name;persist();
  $("#name-count").textContent=chars(name).length;
  ensureImage().catch(()=>{});
});
$("#retry-image").addEventListener("click",()=>{assetsPromise=null;ensureImage().catch(()=>{});});
$("#to-share").addEventListener("click",async()=>{
  try {await ensureImage();navigate("share");}
  catch {$("#image-error").scrollIntoView({block:"center"});}
});
$("#back-result").addEventListener("click",()=>navigate("result"));
$$("[data-save]").forEach(button=>button.addEventListener("click",async()=>{
  if (operationLocked) return;
  operationLocked=true;
  try {
    await ensureImage();
    const link=document.createElement("a");
    link.href=imageURL;link.download="恋愛運転免許証_"+state.date.replaceAll(".","")+".png";
    document.body.append(link);link.click();link.remove();
    const message="画像の保存操作を開始しました。保存先をご確認ください。";
    if ($("#share-screen").hidden) $("#result-status").textContent=message;else status(message);
  } catch {
    const message="画像を保存できませんでした。画像生成を再試行してください。";
    if ($("#share-screen").hidden) $("#result-status").textContent=message;else status(message);
  } finally {operationLocked=false;}
}));
$("#native-share").addEventListener("click",async()=>{
  if (operationLocked) return;
  operationLocked=true;
  try {
    const text=postText(state.resultId,CONFIG.formalUrl,"public");
    if (!text) {status("共有操作は現在ご利用いただけません。");return;}
    let blob;
    try {blob=await ensureImage();}
    catch {status("共有画像を生成できませんでした。画像生成を再試行してください。");return;}
    const file=new File([blob],"恋愛運転免許証.png",{type:"image/png"});
    if (!navigator.share || !navigator.canShare?.({files:[file]})) {
      status("この環境では画像付き共有を開けません。画像を保存し、投稿文をコピーして添付してください。");
      return;
    }
    await navigator.share({files:[file],text});
    status("共有画面を閉じました。投稿先で画像と本文を確認してください。");
  } catch(error) {
    if (error?.name==="AbortError") status("共有を中止しました。必要ならもう一度お試しください。");
    else status("共有画面を開けませんでした。画像を保存して手動で添付してください。");
  } finally {operationLocked=false;}
});
$("#copy-post").addEventListener("click",async()=>{
  const text=postText(state.resultId,CONFIG.formalUrl,$("#copy-kind").value);
  if (!text) {status("投稿文のコピーは現在ご利用いただけません。");return;}
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
      const field=document.createElement("textarea");field.value=text;field.style.position="fixed";field.style.opacity="0";
      document.body.append(field);field.select();
      const copied=document.execCommand("copy");field.remove();
      if (!copied) throw new Error("copy");
    }
    status(($("#copy-kind").value==="line"?"LINE用":"公開SNS用")+"の投稿文をコピーしました。");
  } catch {
    let field=$("#manual-post");
    if (!field) {
      field=document.createElement("textarea");field.id="manual-post";field.readOnly=true;
      field.setAttribute("aria-label","手動コピー用の投稿文");
      $(".share-actions").append(field);
    }
    field.value=text;field.focus();field.select();
    status("投稿文をコピーできませんでした。表示した文章を選択して手動でコピーしてください。");
  }
});
$("#contact-link").addEventListener("click",event=>{
  if (event.currentTarget.getAttribute("aria-disabled")==="true") event.preventDefault();
});
addEventListener("hashchange",showScreen);
showScreen();
