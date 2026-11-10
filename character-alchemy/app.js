import { traits, questions, scoreAnswers, shareText } from './data.js';
import { PUBLIC_SITE_URL, IOS_STORE_URL, ANDROID_STORE_URL, CONTACT_URL } from './config.js';
import { createResultCard } from './card.js';

const app = document.getElementById('app');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = { screen:'start', index:0, answers:Array(questions.length).fill(null), locked:false, seenFirst:false, result:null, kind:'sns', cardBlob:null, cardUrl:null, cardPromise:null, timer:null, workingTimers:[] };
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = (file, alt, className) => `<div class="asset-crop ${className}"><img src="./assets/${file}" alt="${alt}"></div>`;
const frame = (content, className='') => `<div class="pixel-frame ${className}"><div class="pixel-rim"><div class="pixel-face">${content}</div></div></div>`;
const button = (label, action, className='', disabled=false) => `<button type="button" class="pixel-button ${className}" data-action="${action}" ${disabled?'disabled':''}>${label}</button>`;
const scene = (kind, shards='') => `<div class="scene scene-${kind}" aria-label="夜の錬成工房でリアちゃんがクリスタルを錬成している"><span class="scene-edge left"></span><span class="scene-edge right"></span><img class="scene-ria" src="./assets/ria-alchemy.png" alt="">${shards}</div>`;
const progress = (count, complete=false) => `<div class="progress-wrap"><p class="progress-label">${complete?'カケラの収集完了':'カケラの収集'}</p><div class="progress" role="progressbar" aria-label="カケラの収集" aria-valuemin="0" aria-valuemax="7" aria-valuenow="${count}">${questions.map((_,i)=>`<span class="progress-cell ${i<count?'done':''}" aria-hidden="true"></span>`).join('')}</div></div>`;
function clearTimers(){clearTimeout(state.timer);state.workingTimers.forEach(clearTimeout);state.workingTimers=[]}
function focusTop(){scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>app.querySelector('h1')?.focus({preventScroll:true}))}
function render(){clearTimers();if(state.screen==='start')renderStart();else if(state.screen==='question')renderQuestion();else if(state.screen==='working')renderWorking();else if(state.screen==='result')renderResult();else if(state.screen==='share')renderShare();focusTop()}

function renderStart(){
  app.className='shell start-screen';
  app.innerHTML=`<div class="screen-top">${asset('event-logo.png','SNSシェアイベント','event-logo')}<h1 class="title-art" tabindex="-1">${asset('title-pixel.png','わたしのキャラ錬成','title-art-inner')}</h1></div>${scene('start')}${frame('<p>あなたの中に眠るカケラを集めて、<br>自分だけのキャラを錬成しよう！</p>','message-window')}${button('錬成スタート','start','start-action')}${asset('badge-100pt.png','シェアで100ptゲット！','badge-art')}`;
}
function renderQuestion(){
  app.className='shell question-screen';const q=questions[state.index],current=state.answers[state.index];
  app.innerHTML=`<div class="screen-top"><h1 class="mini-title" tabindex="-1">わたしのキャラ錬成</h1></div>${progress(state.answers.slice(0,state.index).filter(a=>a!==null).length)}${scene('question')}${frame(`<span class="question-num pixel-label">第${state.index+1}問</span><h2 class="question-text">${escapeHTML(q.text)}</h2>${state.index===0&&!state.seenFirst?'<p class="hint">普段の自分にいちばん近いものを選んでね。</p>':''}`,'question-window')}<div class="choice-list">${q.options.map((o,i)=>button(escapeHTML(o.text),'choose',`choice ${current===i?'selected':''}` ).replace('data-action="choose"',`data-action="choose" data-option="${i}" aria-pressed="${current===i}"`)).join('')}</div><p class="feedback" role="status" aria-live="polite"></p><div class="back-wrap">${state.index>0?'<button type="button" class="back-link" data-action="back">ひとつ前の質問に戻る</button>':''}</div>`;
  state.seenFirst=true;
  if(current!==null){const selected=app.querySelector(`.choice[data-option="${current}"]`);selected?.style.setProperty('--selected-color',traits[q.options[current].primary].color)}
}
function flyShard(target,color){
  const from=target.getBoundingClientRect(),to=app.querySelector('.scene-ria').getBoundingClientRect();
  const x=from.left+from.width/2,y=from.top+from.height/2;
  const shard=document.createElement('span');shard.className='shard-fly';
  shard.style.cssText=`left:${x}px;top:${y}px;--shard-color:${color};--fly-x:${to.left+to.width*.5-x}px;--fly-y:${to.top+to.height*.65-y}px`;
  document.body.append(shard);setTimeout(()=>shard.remove(),650);
}
function choose(option,target){
  if(state.locked||!Number.isInteger(option)||option<0||option>3)return;
  state.locked=true;state.answers[state.index]=option;
  const choice=questions[state.index].options[option],trait=traits[choice.primary];
  app.querySelectorAll('.choice').forEach((el,i)=>{el.disabled=true;el.classList.toggle('selected',i===option);el.setAttribute('aria-pressed',String(i===option))});
  target.style.setProperty('--selected-color',trait.color);
  const back=app.querySelector('[data-action="back"]');if(back)back.disabled=true;
  app.querySelector('.feedback').textContent=`${trait.name}のカケラを獲得！`;
  if(!reducedMotion)flyShard(target,trait.color);
  state.timer=setTimeout(()=>{state.locked=false;goNext()},reducedMotion?250:710);
}
function goNext(){
  if(state.locked||state.answers[state.index]===null)return;
  if(state.index===questions.length-1){state.result=scoreAnswers(state.answers);if(!state.result)return;state.screen='working'}
  else state.index++;render();
}
function goBack(){if(state.locked||state.index===0)return;state.index--;render()}
function renderWorking(){
  app.className='shell working-screen';
  const keys=[...new Set(state.answers.map((a,i)=>questions[i].options[a].primary))];
  const shards=`<div class="scene-shards" aria-hidden="true">${keys.map((k,i)=>`<i style="--c:${traits[k].color};--x:${[-150,100,-92,105,-130,115][i]}px;--y:${[-95,-85,75,65,-10,20][i]}px"></i>`).join('')}</div>`;
  app.innerHTML=`<div class="screen-top"><h1 class="mini-title" tabindex="-1">わたしのキャラ錬成</h1></div>${progress(7,true)}${scene('working',shards)}<p class="working-message" role="status" aria-live="polite">カケラが集まってきた…</p>`;
  const total=reducedMotion?750:2400,copy=app.querySelector('.working-message');
  state.workingTimers.push(setTimeout(()=>{if(state.screen==='working')copy.textContent='あなたのキャラを錬成中…'},total*.3));
  state.workingTimers.push(setTimeout(()=>{if(state.screen==='working')copy.textContent='錬成完了！'},total*.77));
  state.timer=setTimeout(()=>{if(state.screen==='working'){state.screen='result';render()}},total);
}
function cardMarkup(className=''){
  const main=traits[state.result.main],sub=traits[state.result.sub];
  return `<div class="card-frame ${className}"><img class="card-img" src="${state.cardUrl||''}" alt="${escapeHTML(main.type)}の結果カード。メイン属性は${main.name}、サブ属性は${sub.name}。" width="1200" height="900"></div>`;
}
async function ensureCard(){
  if(!state.result)return;
  const result=state.result;
  try{
    if(!state.cardBlob){
      state.cardPromise ||= createResultCard(result);
      const blob=await state.cardPromise;
      if(state.result!==result)return;
      if(!state.cardBlob){state.cardBlob=blob;state.cardUrl=URL.createObjectURL(blob)}
      state.cardPromise=null;
    }
    app.querySelectorAll('.card-img').forEach(img=>img.src=state.cardUrl);
    const enlarge=app.querySelector('.enlarge-link');if(enlarge)enlarge.href=state.cardUrl;
  }catch(error){state.cardPromise=null;console.error(error);app.querySelectorAll('.card-img').forEach(img=>img.alt='カード画像を生成できませんでした。');status('カード画像を生成できませんでした。')}
}
function detail(title,body,color){return frame(`<h3>${title}</h3>${body}`,'detail-window').replace('class="pixel-frame detail-window"',`class="pixel-frame detail-window" style="--detail-color:${color}"`)}
function renderResult(){
  app.className='shell result-screen';const main=traits[state.result.main];
  app.innerHTML=`<div class="screen-top"><h1 class="screen-title result-heading" tabindex="-1">あなたのキャラが完成！</h1></div>${cardMarkup()}<div class="result-actions">${button('画像を保存・シェアする','show-share')}</div><section aria-labelledby="detail-title"><h2 id="detail-title" class="section-heading">あなたのキャラをもっと知る</h2><div class="details">${detail('キャラの持ち味',`<p><strong>${escapeHTML(main.catch)}</strong></p><p>${escapeHTML(main.description)}</p>`,main.color)}${detail('スキルが輝くとき',`<p>${escapeHTML(main.shine)}</p>`,main.color)}${detail('気をつけたいこと',`<p>${escapeHTML(main.care)}</p>`,main.color)}${detail('レベルアップのヒント',`<p>${escapeHTML(main.tip)}</p>`,main.color)}</div></section>${button('もう一度錬成する','reset','quiet')}`;
  ensureCard();
}
function shareContent(){
  const sns=state.kind==='sns',text=shareText(state.kind,state.result,PUBLIC_SITE_URL||'［診断サイトURL］');
  return `<div class="tab-row" role="tablist" aria-label="共有先"><button class="tab-btn ${sns?'active':''}" type="button" role="tab" aria-selected="${sns}" data-action="sns">公開SNS</button><button class="tab-btn ${!sns?'active':''}" type="button" role="tab" aria-selected="${!sns}" data-action="line">LINEで友だちに送る</button></div>${!PUBLIC_SITE_URL?'<p class="draft-warning">本番診断サイトURLが未設定のため、共有操作は準備中です。</p>':''}<div class="button-stack">${button('画像付きで共有する','share','secondary',!PUBLIC_SITE_URL)}${button('結果カードを保存する','save','quiet')}${button('シェア文をコピーする','copy','quiet',!PUBLIC_SITE_URL)}</div><p id="status" class="status" role="status" aria-live="polite"></p><div class="share-copy" aria-label="シェア文">${escapeHTML(text)}</div>${frame(`<h3>${sns?'公開SNS':'LINE'}の参加条件</h3><ul>${sns?'<li>結果カード画像と #PR、#CLEARシェアラボ を添えた公開投稿。</li><li>確認完了まで、アカウントと投稿は公開状態を維持する。</li>':'<li>友人・家族など個人宛にカード画像を送信。</li><li>公式アカウント全般への送信は対象外。</li><li>ハッシュタグは不要。</li>'}</ul><h3>共通の付与条件</h3><ul><li>運営が投稿・送信内容を確認後、手動で100ptを加算します。</li><li>今回のイベントにつき、お一人様1回まで。</li><li>確認状況によっては、加算が翌日になる場合があります。</li></ul>`,'share-conditions')}`;
}
function renderShare(){
  app.className='shell share-screen';
  app.innerHTML=`<div class="screen-top"><h1 class="screen-title" tabindex="-1">画像を保存・シェアする</h1></div>${cardMarkup('share-card')}<a class="enlarge-link" href="${state.cardUrl||'#'}" target="_blank" rel="noopener">カード画像を拡大表示</a>${frame('<p class="share-lead">シェアして100ptを受け取ろう！</p><ol><li>結果カードをSNSやLINEでシェア</li><li>投稿・送信後のスクリーンショットを撮影</li><li>CLEARアプリ内のお問い合わせ窓口へ送付</li></ol><p>運営で内容を確認した後、100ptを加算します。</p>','share-intro')}<div id="share-dynamic">${shareContent()}</div>${frame(`<h3>投稿・送信した画面を送ってね</h3><p>スクリーンショットは、投稿・送信が完了した画面全体を、切り取らずに撮影してください。</p><ul><li>公開SNS：アカウント名と投稿内容が分かる画面</li><li>LINE：送信先と送信内容が分かる画面</li></ul><p>結果カードだけの画像や、投稿前の編集画面・共有メニューの画面では、シェアの確認ができません。</p>${PUBLIC_SITE_URL?`<a class="pixel-button" href="${CONTACT_URL}" target="_blank" rel="noopener">スクリーンショットを送る</a>`:'<button class="pixel-button" disabled>スクリーンショットを送る</button>'}`,'share-proof')}${frame(`<h2>診断のあとは、CLEARでも楽しもう！</h2><p>CLEARでは、ほかにも楽しいイベントを開催しています。<br>ぜひアプリもチェックしてみてくださいね！</p><p>恋愛・仕事・人間関係など、気になることをチャットや電話で占い師に相談できます！！</p>${button('CLEARアプリを見てみる','store','quiet')}<div id="store-options" class="store-options" hidden><a href="${IOS_STORE_URL}" target="_blank" rel="noopener">iPhone版</a> ／ <a href="${ANDROID_STORE_URL}" target="_blank" rel="noopener">Android版</a></div>`,'app-promo')}<div class="result-back">${button('結果に戻る','show-result','quiet')}</div>`;
  ensureCard();
}
function status(message){const el=document.getElementById('status');if(el)el.textContent=message}
function saveCard(){
  if(!state.cardBlob){status('カード画像を準備中です。');return}
  const a=document.createElement('a');a.href=state.cardUrl;a.download='CLEAR_わたしのキャラ錬成.png';document.body.append(a);a.click();a.remove();status('ダウンロードを開始しました。保存先をご確認ください。');
}
async function shareCard(){
  if(!PUBLIC_SITE_URL||!state.cardBlob)return;
  const text=shareText(state.kind,state.result,PUBLIC_SITE_URL),file=new File([state.cardBlob],'CLEAR_わたしのキャラ錬成.png',{type:'image/png'});
  if(!navigator.share||!navigator.canShare?.({files:[file]})){status('この端末では画像付き共有が使えません。カードを保存し、文章をコピーして投稿・送信してください。');return}
  try{await navigator.share({title:'わたしのキャラ錬成',text,files:[file]});status('投稿・送信した画面を確認し、スクリーンショットを撮影してください。')}
  catch(error){if(error.name!=='AbortError')status('共有を開けませんでした。カードの保存と文章のコピーをお使いください。')}
}
async function copyText(){
  if(!PUBLIC_SITE_URL)return;const value=shareText(state.kind,state.result,PUBLIC_SITE_URL);let copied=false;
  try{await navigator.clipboard.writeText(value);copied=true}catch{const t=document.createElement('textarea');t.value=value;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();copied=document.execCommand('copy');t.remove()}
  status(copied?'シェア文をコピーしました。':'コピーできませんでした。文章を選択してコピーしてください。');
}
function reset(){if(state.cardUrl)URL.revokeObjectURL(state.cardUrl);Object.assign(state,{screen:'start',index:0,answers:Array(questions.length).fill(null),locked:false,seenFirst:false,result:null,kind:'sns',cardBlob:null,cardUrl:null,cardPromise:null});render()}
app.addEventListener('click',event=>{
  const target=event.target.closest('[data-action]');if(!target||target.disabled)return;const action=target.dataset.action;
  if(action==='start'){state.screen='question';render()}
  else if(action==='choose')choose(Number(target.dataset.option),target);
  else if(action==='back')goBack();
  else if(action==='show-share'){state.screen='share';render()}
  else if(action==='show-result'){state.screen='result';render()}
  else if(action==='reset')reset();
  else if(action==='sns'||action==='line'){state.kind=action;document.getElementById('share-dynamic').innerHTML=shareContent()}
  else if(action==='save')saveCard();
  else if(action==='share')shareCard();
  else if(action==='copy')copyText();
  else if(action==='store')document.getElementById('store-options').hidden=false;
});
render();
