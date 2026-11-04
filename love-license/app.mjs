import {TYPES, QUESTIONS, judge, postText} from "./diagnosis.mjs?v=20261104b";

const KEY = "clear-love-license-5x7-v1";
const MAX_NAME = 12;
const CARD_LAYOUT_VERSION = "one-line-v2";
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
  document.body.dataset.screen=screen;
  $("#back-question").hidden=screen!=="quiz" || state.questionIndex===0;
  if (screen!=="quiz") $(".quiz-scene").dataset.active="false";
  document.title="恋愛運転免許証｜"+({home:"診断",quiz:"質問",result:"診断結果",share:"シェアで100pt"}[screen]);
  if (screen==="quiz") renderQuiz();
  if (screen==="result") { renderResult();ensureImage().catch(()=>{}); }
  if (screen==="share") { updateShareControls();ensureImage().catch(()=>{}); }
  if (screen==="home") {
    const fromHeader=!!document.activeElement?.closest(".home-link");
    cancelAnswerTimer();updateHomeControls();
    if (fromHeader) $("#start-button").focus({preventScroll:true});
  }
}

function updateHomeControls() {
  const answered=state.answers.some(answer=>answer!==null);
  $("#start-button").textContent=state.resultId?"診断結果を見る":answered?"診断を続ける":"運転スタート";
  $("#restart-button").hidden=!answered&&!state.resultId;
}

function renderQuiz() {
  const q=QUESTIONS[state.questionIndex];
  $("#quiz-intro").hidden=state.questionIndex!==0;
  $("#quiz-prompt").textContent=q.prompt;
  updateProgress();
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
function updateProgress() {
  const completed=state.answers.filter(answer=>answer!==null).length;
  const bar=$("#quiz-progress");
  bar.setAttribute("aria-valuenow",String(completed));
  bar.setAttribute("aria-valuetext","7問中"+completed+"問に回答済み");
  $("#quiz-progress-fill").style.width=(completed/7*100)+"%";
}
function answer(choice) {
  if (answerLocked) return;
  answerLocked=true;
  const questionIndex=state.questionIndex;
  state.answers[questionIndex]=choice;
  persist();
  updateProgress();
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
function fitOneLine(ctx,text,x,y,maxWidth,initial,min,weight=900) {
  let size=initial;
  while (size>=min) {
    ctx.font=weight+" "+size+"px "+FONT;
    if (ctx.measureText(text).width<=maxWidth) break;
    size--;
  }
  if (size<min) throw new Error("文字が枠に収まりませんでした");
  ctx.fillText(text,x,y);
}
const FIELD_LINES={
  "会いたい気持ちを、お誘いに変える":["会いたい気持ちを、","お誘いに変える"],
  "次の予定、まだ前のデート中です":["次の予定、まだ","前のデート中です"],
  "相手の好意を確かめて、一歩進む":["相手の好意を","確かめて、一歩進む"],
  "気軽な会話で、親しさを育てる":["気軽な会話で、","親しさを育てる"],
  "いい雰囲気も、つい冗談で通過":["いい雰囲気も、","つい冗談で通過"],
  "お互いの希望を言葉にして進む":["お互いの希望を","言葉にして進む"],
  "行き先相談で、出発が延びがち":["行き先相談で、","出発が延びがち"],
  "気持ちが追いつくペースで進む":["気持ちが追いつく","ペースで進む"],
  "待っていたお誘いで、一時停止":["待っていたお誘いで、","一時停止"]
};
function drawField(ctx,text,centerY) {
  const lines=FIELD_LINES[text]||[text];
  if (lines.join("")!==text) throw new Error("カードの文章が一致しません");
  const gap=53;
  const first=centerY-(lines.length-1)*gap/2;
  ctx.textAlign="center";
  lines.forEach((line,index)=>fitOneLine(ctx,line,652,first+index*gap,625,43,38,800));
}
function drawType(ctx,type) {
  const size=72;
  ctx.fillStyle="#192c56";ctx.textAlign="center";ctx.textBaseline="alphabetic";
  ctx.font="900 "+size+"px "+FONT;
  const metrics=ctx.measureText(type.name);
  if (metrics.width>920) throw new Error("タイプ名が1行で枠に収まりませんでした");
  const ascent=Number.isFinite(metrics.actualBoundingBoxAscent)?metrics.actualBoundingBoxAscent:size*.8;
  const descent=Number.isFinite(metrics.actualBoundingBoxDescent)?metrics.actualBoundingBoxDescent:size*.1;
  ctx.fillText(type.name,975,267+(ascent-descent)/2);
  ctx.textBaseline="middle";
}
function makeBlob(canvas) {
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("PNGを作れませんでした")),"image/png"));
}
function imageKey() {return CARD_LAYOUT_VERSION+"|"+state.resultId+"|"+state.date+"|"+state.name;}
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
  // 印字済みの見出しを元画像のまま各欄の縦中央へ移す。
  ctx.drawImage(base,500,215,347,76,98,215,347,76);
  ctx.drawImage(base,98,218,347,62,98,238,347,62);
  ctx.drawImage(base,1010,345,12,455,1010,345,78,455);
  ctx.drawImage(base,1022,445,62,345,1022,400,62,345);
  // 正式見本の写真欄にある共通リアちゃんのみを使う。
  ctx.drawImage(ria,641,187,240,288,1095,350,380,456);
  ctx.fillStyle="#192c56";ctx.textAlign="center";ctx.textBaseline="middle";
  if (snapshot.name.trim()) fitOneLine(ctx,snapshot.name,653,124,625,50,32);
  fitOneLine(ctx,snapshot.date,1334,124,263,36,29);
  drawType(ctx,type);
  ctx.fillStyle="#192c56";
  drawField(ctx,type.lead,426);
  drawField(ctx,type.skill,619);
  drawField(ctx,type.caution,830);
  return makeBlob(canvas);
}
function imageBusy(busy) {
  $$("[data-save]").forEach(button=>button.disabled=busy);
  $("#to-share").disabled=busy;
  $("#native-share").disabled=busy||!postText(state.resultId,CONFIG.formalUrl,"public");
  if (!busy) updateShareControls();
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
        $("#preview-image").src=imageURL;
        const download=$("#download-image");
        download.href=imageURL;
        download.download="恋愛運転免許証_"+snapshot.date.replaceAll(".","")+".png";
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
  const typeParts={
    A:["好きなら直進、","アクセル型"],
    B:["脈あり待ちの","信号待ち型"],
    C:["友達レーンで","周回型"],
    D:["本音を聞いて","ルート相談型"],
    E:["ときめくほど","急ブレーキ型"]
  }[type.id];
  const title=$("#result-type-name");
  title.replaceChildren();
  if (typeParts?.join("")===type.name) {
    typeParts.forEach(part=>{const span=document.createElement("span");span.textContent=part;title.append(span);});
  } else title.textContent=type.name;
  title.setAttribute("aria-label",type.name);
  $("#license-name").value=state.name;
  $("#name-count").textContent=chars(state.name).length;
  const sentences=type.summary.match(/[^。]+。|[^。]+$/g)||[type.summary];
  const summary=$("#summary");
  summary.replaceChildren();
  for (let index=0;index<sentences.length;index+=2) {
    const paragraph=document.createElement("p");
    paragraph.textContent=sentences.slice(index,index+2).join("");
    summary.append(paragraph);
  }
  $("#tip").textContent=type.tip;
}
function status(message) {$("#operation-status").textContent=message;}
function saveStatus(message) {
  if ($("#share-screen").hidden) $("#result-status").textContent=message;
  else status(message);
}
function destination() {return document.querySelector('input[name="destination"]:checked')?.value||"public";}
function updatePostPreview() {
  const text=postText(state.resultId,CONFIG.formalUrl,destination());
  $("#post-preview").value=text||"";
  $("#native-share").disabled=!text||!imageBlob;
  $("#copy-post").disabled=!text;
  $$('[data-condition]').forEach(section=>section.hidden=section.dataset.condition!==destination());
  $("#line-inline-note").hidden=destination()!=="line";
}
function openImagePreview() {
  if (!imageBlob || renderedKey!==imageKey()) {saveStatus("免許証画像を準備中です。少し待ってからお試しください。");return;}
  $("#image-preview").hidden=false;
  document.body.classList.add("preview-open");
  $("#close-preview").focus();
}
function closeImagePreview() {
  $("#image-preview").hidden=true;
  document.body.classList.remove("preview-open");
}
function preparedFile() {
  if (!imageBlob || renderedKey!==imageKey() || typeof File!=="function") return null;
  return new File([imageBlob],"恋愛運転免許証_"+state.date.replaceAll(".","")+".png",{type:"image/png"});
}
function canShareFile(file) {
  try {return !!file && typeof navigator.share==="function" && typeof navigator.canShare==="function" && navigator.canShare({files:[file]});}
  catch {return false;}
}
function updateShareControls() {
  updatePostPreview();
  const supported=canShareFile(preparedFile());
  $("#share-unavailable").hidden=supported;
  $("#result-save-note").textContent=supported?"共有メニューから『画像を保存』を選んでください。":"ボタンを押すと画像を大きく表示します。長押しで保存できます。";
  $("#share-save-note").textContent=supported?"共有メニューから『画像を保存』を選んでください。":"ボタンを押すと画像を大きく表示します。長押し保存や、補足欄のPNGダウンロードも利用できます。";
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

$("#start-button").addEventListener("click",()=>navigate(state.resultId?"result":"quiz"));
$(".home-link").addEventListener("click",event=>{event.preventDefault();cancelAnswerTimer();navigate("home");});
$("#restart-button").addEventListener("click",()=>{
  const dialog=$("#restart-dialog");
  if (typeof dialog.showModal==="function") {dialog.returnValue="";dialog.showModal();}
  else if (confirm("保存済みの回答と診断結果を消して、最初から診断しますか？")) resetDiagnosis();
});
$("#restart-dialog").addEventListener("close",event=>{
  if (event.currentTarget.returnValue==="confirm") resetDiagnosis();
});
function resetDiagnosis() {
  cancelAnswerTimer();
  state=blankState();persist();
  renderedKey="";imageBlob=null;
  if (imageURL) {URL.revokeObjectURL(imageURL);imageURL=null;}
  $$('[data-license-image]').forEach(img=>img.removeAttribute('src'));
  $("#preview-image").removeAttribute('src');
  $("#download-image").removeAttribute('href');
  updateProgress();
  navigate("quiz");
}
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
    const file=preparedFile();
    if (!file) {saveStatus("免許証画像を準備中です。少し待ってからお試しください。");return;}
    if (!canShareFile(file)) {openImagePreview();saveStatus("この端末では画像ファイルの共有を開けません。表示した画像を長押しして保存できます。");return;}
    await navigator.share({files:[file]});
    saveStatus("共有メニューを閉じました。保存先は端末でご確認ください。");
  } catch(error) {
    if (error?.name==="AbortError") saveStatus("共有メニューを閉じました。");
    else {openImagePreview();saveStatus("共有メニューを開けませんでした。表示した画像を長押しして保存できます。");}
  } finally {operationLocked=false;}
}));
$("#native-share").addEventListener("click",async()=>{
  if (operationLocked) return;
  operationLocked=true;
  try {
    const text=postText(state.resultId,CONFIG.formalUrl,destination());
    if (!text) {status("共有操作は現在ご利用いただけません。");return;}
    const file=preparedFile();
    if (!canShareFile(file)) {
      $(".fallback-details").open=true;
      status("この端末では画像付き共有を開けません。画像を表示し、投稿文をコピーして添付してください。");
      return;
    }
    await navigator.share({files:[file],text});
    status("共有画面を閉じました。投稿先で画像と本文を確認してください。");
  } catch(error) {
    if (error?.name==="AbortError") status("共有画面を閉じました。");
    else {$(".fallback-details").open=true;status("共有画面を開けませんでした。画像を表示し、投稿文をコピーして添付してください。");}
  } finally {operationLocked=false;}
});
$$('input[name="destination"]').forEach(input=>input.addEventListener("change",updatePostPreview));
$$('[data-preview]').forEach(button=>button.addEventListener("click",openImagePreview));
$("#close-preview").addEventListener("click",closeImagePreview);
$("#image-preview").addEventListener("click",event=>{if(event.target.id==="image-preview")closeImagePreview();});
addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("#image-preview").hidden)closeImagePreview();});
$("#copy-post").addEventListener("click",async()=>{
  const text=postText(state.resultId,CONFIG.formalUrl,destination());
  if (!text) {status("投稿文のコピーは現在ご利用いただけません。");return;}
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else {
      const field=document.createElement("textarea");field.value=text;field.style.position="fixed";field.style.opacity="0";
      document.body.append(field);field.select();
      const copied=document.execCommand("copy");field.remove();
      if (!copied) throw new Error("copy");
    }
    status((destination()==="line"?"LINE用":"公開SNS用")+"の投稿文をコピーしました。");
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
const sceneObserver=new IntersectionObserver(entries=>{
  for (const entry of entries) $(".quiz-scene").dataset.active=String(entry.isIntersecting&&!$("#quiz-screen").hidden);
},{threshold:.05});
sceneObserver.observe($(".quiz-scene"));
showScreen();
