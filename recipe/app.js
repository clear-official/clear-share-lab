"use strict";

const CONTENT = window.RECIPE_CONTENT;
const STORAGE_KEY = "clearShareLab_recipe_v1";
const SUPPORT_URL = "https://app-clear.com/open?act=page_contact";
const SHARE_URL = "https://clear-official.github.io/clear-share-lab/recipe/";
const HASHTAG = "#CLEARシェアラボ";
const CHEF_IMAGE = "../assets/recipe/chef-latest.png";
const QUIZ_CHEF_IMAGE = "../assets/recipe/chef-cooking.png";
const TITLE_IMAGE = "../assets/recipe/title-latest.png";
const BACKGROUND_IMAGE = "../assets/recipe/background-latest.png";
const app = document.querySelector("#app");
const images = new Map();
let navigationLocked = false;
let answerAdvanceTimer = null;
let cardReady = false;
let cardOpenUrl = null;
let toastTimer;

function validContent() {
  const ids = new Set(CONTENT.results.map((result) => result.id));
  const types = new Set(CONTENT.results.map((result) => result.type));
  return CONTENT.questions.length === 7
    && typeof CONTENT.resolveResult === "function"
    && typeof CONTENT.resolveHiddenFlavor === "function"
    && CONTENT.results.length === 6
    && ids.size === 6
    && types.size === 6
    && CONTENT.questions.every((question) => typeof question.text === "string" && question.text.trim()
      && Array.isArray(question.answers) && question.answers.length === 4
      && question.answers.every((answer) => typeof answer.text === "string" && answer.text.trim() && types.has(answer.type)))
    && CONTENT.results.every((result) => result.image && result.name?.trim() && result.ingredients?.trim()
      && result.description?.trim() && result.tip?.trim() && result.hiddenFlavorText?.trim()
      && result.sealTop?.trim() && result.sealBottom?.trim());
}

const READY = validContent();
const emptyState = () => ({ answers: Array(7).fill(null), resultId: null });
function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.answers)) return emptyState();
    return {
      answers: Array.from({ length: 7 }, (_, index) => Number.isInteger(saved.answers[index]) ? saved.answers[index] : null),
      resultId: CONTENT.results.some((result) => result.id === saved.resultId) ? saved.resultId : null,
    };
  } catch (_) { return emptyState(); }
}
let state = readState();

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* Private browsing can deny storage. */ }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function route() {
  if (location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname)) {
    const preview = new URLSearchParams(location.search).get("preview");
    if (/^q-[1-7]$/.test(preview)) return { screen: "quiz", index: Number(preview.slice(2)) - 1, preview: true };
    const match = /^(result|share)-([A-F])$/.exec(preview || "");
    if (match) return { screen: match[1], preview: true, previewType: match[2] };
  }
  const hash = location.hash.slice(1);
  if (/^q-[1-7]$/.test(hash)) return { screen: "quiz", index: Number(hash.slice(2)) - 1 };
  if (hash === "result" || hash === "share") return { screen: hash };
  return { screen: "home" };
}
function navigate(hash, replace = false) {
  let target = `#${hash}`;
  if (new URLSearchParams(location.search).has("preview")) {
    const url = new URL(location.href);
    url.searchParams.delete("preview");
    url.searchParams.delete("flavor");
    url.hash = hash;
    target = url;
  }
  if (replace) history.replaceState(null, "", target);
  else history.pushState(null, "", target);
  render();
  window.scrollTo(0, 0);
}
function allAnswered() {
  return CONTENT.questions.every((question, index) => Number.isInteger(state.answers[index])
    && state.answers[index] >= 0 && state.answers[index] < question.answers.length);
}
function currentResult() {
  const result = CONTENT.results.find((entry) => entry.id === state.resultId);
  if (!result || !allAnswered()) return null;
  if (CONTENT.resolveResult([...state.answers]) !== result.id) return null;
  const flavorId = CONTENT.resolveHiddenFlavor([...state.answers]);
  const flavor = CONTENT.results.find((entry) => entry.id === flavorId);
  if (!flavor || flavor.id === result.id) return null;
  return { ...result, hiddenFlavor: flavor.hiddenFlavorText, flavorId };
}
function previewResult(type) {
  const result = CONTENT.results.find((entry) => entry.type === type);
  const requested = new URLSearchParams(location.search).get("flavor");
  const flavor = CONTENT.results.find((entry) => entry.type === requested && entry.type !== type)
    || CONTENT.results.find((entry) => entry.type !== type);
  return { ...result, hiddenFlavor: flavor.hiddenFlavorText, flavorId: flavor.id };
}
function displayedResult(page = route()) {
  return page.preview ? previewResult(page.previewType) : currentResult();
}
function titleMarkup(quiz = false) {
  return `<div class="section-title${quiz ? " quiz-logo" : ""}"><img src="${TITLE_IMAGE}" alt="私の隠しレシピ診断" width="800" height="202"></div><div class="dotted" aria-hidden="true"></div>`;
}
function resultNameParts(result) {
  const breaks = { A: 6, B: 6, C: 6, D: 3, E: 6, F: 7 };
  const chars = Array.from(result.name);
  const index = breaks[result.type];
  return [chars.slice(0, index).join(""), chars.slice(index).join("")];
}
function resultNameMarkup(result) {
  return resultNameParts(result).map((part) => `<span>${escapeHtml(part)}</span>`).join("");
}
function shell(body, back = "", variant = "") {
  return `<section class="paper${variant ? ` ${variant}` : ""}"><div class="topline"><span class="brand">Clear シェアラボ</span>${back ? `<button class="back" data-action="back" data-target="${back}">← 戻る</button>` : ""}</div>${body}</section>`;
}
function kitchenPropsMarkup() {
  return `      <svg class="kitchen-props" viewBox="0 0 800 240" role="img" aria-label="木製の調理台、トマト、ペッパーミル、赤チェックの布、ボウルと白い容器">
        <defs>
          <pattern id="cloth-gingham" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#fff8f4"/><path d="M0 0H12V24H0Z M0 0H24V12H0Z" fill="#ee6070" opacity=".78"/><path d="M0 0H12V12H0Z" fill="#e81b3f" opacity=".72"/></pattern>
          <linearGradient id="wood" x2="0" y2="1"><stop stop-color="#efbc79"/><stop offset="1" stop-color="#cb8648"/></linearGradient>
        </defs>
        <g stroke="#082856" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
          <path d="M12 175H788Q797 175 797 184V212H3V184Q3 175 12 175Z" fill="url(#wood)"/>
          <path d="M8 211H792V232Q792 237 786 237H14Q8 237 8 232Z" fill="#bd7540"/>
          <path d="M27 187H774" fill="none" stroke="#f8d39c" stroke-width="5"/>
          <path d="M209 179L255 121L316 151L353 181Z" fill="url(#cloth-gingham)" stroke="#ed7790" stroke-width="3"/>
          <path d="M235 181L270 143L321 176" fill="none" stroke="#fff9f5" stroke-width="5"/>
          <path d="M96 166C73 166 66 146 75 127C82 112 104 109 117 121C132 111 153 118 155 140C155 156 143 168 121 171Z" fill="#f21f42"/>
          <path d="M135 178C120 169 121 149 136 137C151 126 177 135 181 152C186 174 168 187 149 184Z" fill="#ed1239"/>
          <path d="M97 119L91 106L103 113L109 99L115 113L128 106L121 120" fill="#16834b" stroke="#082856" stroke-width="3"/>
          <path d="M146 134L143 123L151 128L158 119L161 132L173 130L167 140" fill="#16834b" stroke="#082856" stroke-width="3"/>
          <path d="M185 178V91Q185 81 195 80H215Q225 81 225 91V178Z" fill="#c27e43"/>
          <path d="M189 101H221M189 157H221" fill="none" stroke="#f6c68c" stroke-width="5"/>
          <path d="M187 81Q176 75 184 66Q188 61 195 63H215Q222 62 226 67Q232 76 222 81Z" fill="#dfab66"/>
          <ellipse cx="205" cy="62" rx="8" ry="6" fill="#c4834a"/>
          <path d="M592 151Q600 180 613 189H713Q727 179 736 151Z" fill="#e9153e"/>
          <ellipse cx="664" cy="151" rx="72" ry="17" fill="#fff6ec"/>
          <path d="M605 146Q661 165 723 146" fill="none" stroke="#e9153e" stroke-width="7"/>
          <path d="M668 151L700 87Q703 81 709 83Q715 86 712 93L690 157" fill="#b87a3d"/>
          <path d="M739 179V129Q739 121 748 119H783Q792 121 792 129V179Q792 188 781 189H750Q739 187 739 179Z" fill="#fffefa"/>
          <path d="M740 131Q765 138 791 131" fill="none" stroke="#8ab9d4" stroke-width="5"/>
          <path d="M740 173Q766 179 792 173" fill="none" stroke="#d1e3e7" stroke-width="3"/>
        </g>
      </svg>`;
}
function seasoningMarkup() {
  const grains = [
    [455, 870, 128, 82, -.08], [463, 873, 141, 82, -.3], [451, 868, 116, 87, -.52],
    [468, 875, 155, 79, -.74], [458, 871, 135, 84, -.96], [462, 874, 148, 81, -1.18],
  ];
  return `<svg class="seasoning-stream" viewBox="0 0 1230 1278" aria-hidden="true"><defs><clipPath id="seasoning-window"><rect x="430" y="864" width="240" height="96"/></clipPath></defs><g clip-path="url(#seasoning-window)" fill="#fff" stroke="#213b66" stroke-width="3">${grains.map(([x, y, dx, dy, delay]) => `<ellipse class="seasoning-grain" cx="${x}" cy="${y}" rx="11" ry="7" style="--dx:${dx}px;--dy:${dy}px;--delay:${delay}s"/>`).join("")}</g></svg>`;
}
function homeView() {
  return shell(`<svg class="book-frame" viewBox="0 0 1000 1600" preserveAspectRatio="none" aria-hidden="true">
      <path class="book-paper-shape" d="M80 8H920C931 8 934 29 944 42C955 56 971 60 991 65V1535C970 1540 954 1547 943 1567C935 1582 931 1592 920 1592H80C69 1592 65 1582 57 1567C46 1547 30 1540 9 1535V65C29 60 45 56 56 42C66 29 69 8 80 8Z"/>
      <path class="book-rule book-rule-outer" d="M81 25H919C926 25 929 42 938 53C949 67 963 72 974 76V1524C963 1528 949 1533 938 1550C929 1564 926 1575 919 1575H81C74 1575 71 1564 62 1550C51 1533 37 1528 26 1524V76C37 72 51 67 62 53C71 42 74 25 81 25Z"/>
      <path class="book-rule book-rule-inner" d="M84 39H916C921 39 925 52 933 63C943 76 955 82 961 85V1515C955 1518 943 1524 933 1537C925 1548 921 1561 916 1561H84C79 1561 75 1548 67 1537C57 1524 45 1518 39 1515V85C45 82 57 76 67 63C75 52 79 39 84 39Z"/>
    </svg>
    <div class="home-event"><div class="fork-title">
      <svg class="utensil fork" viewBox="0 0 28 45" aria-hidden="true"><path fill="currentColor" d="M2 1h4v14h3V1h4v14h3V1h4v16c0 6-3 9-7 10v17H9V27C5 26 2 23 2 17z"/></svg>
      <span>SNSシェアイベント</span>
      <svg class="utensil spoon" viewBox="0 0 28 45" aria-hidden="true"><path fill="currentColor" d="M14 1c7 0 11 6 11 14 0 7-4 12-9 13v16h-4V28C7 27 3 22 3 15 3 7 7 1 14 1z"/></svg>
    </div><div class="dotted" aria-hidden="true"></div></div>
    <h1 class="home-logo"><img src="${TITLE_IMAGE}" alt="私の隠しレシピ診断" width="800" height="202" fetchpriority="high"></h1>
    <p class="home-count">－全7問－</p>
    <div class="kitchen-scene">
      <img class="hero-chef" src="${CHEF_IMAGE}" alt="フライパンを持ったシェフのリアちゃん" width="1572" height="2043">
      ${kitchenPropsMarkup()}
    </div>
    <button class="primary home-start" data-action="start" ${READY ? "" : "disabled"}>レシピを開発する <span aria-hidden="true">›</span></button>
    ${READY ? "" : `<p class="waiting" role="status">確定版の設問と結果原稿を準備中です。</p>`}
    <div class="ribbon-wrap"><span class="ribbon-tail ribbon-tail-left" aria-hidden="true"></span><p class="ribbon">シェアで100ptゲット</p><span class="ribbon-tail ribbon-tail-right" aria-hidden="true"></span></div>`, "", "home-paper");
}
function quizView(index) {
  const question = CONTENT.questions[index];
  const progress = Array.from({ length: 7 }, (_, i) => `<li class="${i === index ? "current" : i < index ? "done" : ""}" aria-label="${i + 1}問目"></li>`).join("");
  const answers = question.answers.map((answer, choice) => `<button class="answer" data-action="answer" data-choice="${choice}" aria-pressed="${state.answers[index] === choice}"><span class="answer-number">${["①", "②", "③", "④"][choice]}</span><span>${escapeHtml(answer.text)}</span></button>`).join("");
  const questionLines = question.text.match(/[^。]+。|[^。]+$/gu) || [question.text];
  return shell(`<header class="quiz-head">${titleMarkup(true)}<p class="quiz-progress-text">${index + 1}/7</p><ol class="progress-dots" aria-label="全7問の進捗">${progress}</ol></header>
    <div class="question-box"><p class="question-number">第${index + 1}問</p><h1 class="question-text">${questionLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</h1></div>
    <div class="answers" role="group" aria-label="回答を選択">${answers}</div>
    <div class="cooking-footer"><p class="cooking-label"><svg class="cooking-utensil" viewBox="0 0 28 45" aria-hidden="true"><path d="M2 1h4v14h3V1h4v14h3V1h4v16c0 6-3 9-7 10v17H9V27C5 26 2 23 2 17z"/></svg><span>レシピ作成中</span><svg class="cooking-utensil" viewBox="0 0 28 45" aria-hidden="true"><path d="M14 1c7 0 11 6 11 14 0 7-4 12-9 13v16h-4V28C7 27 3 22 3 15 3 7 7 1 14 1z"/></svg></p><div class="cooking-scene"><div class="chef-cooking"><img src="${QUIZ_CHEF_IMAGE}" alt="調味料をフライパンに振るリアちゃん" width="1230" height="1278">${seasoningMarkup()}</div>${kitchenPropsMarkup()}</div></div>`, index ? `q-${index}` : "home", "quiz-paper");
}
function resultView(result) {
  return shell(`<div class="result-band" aria-hidden="true"></div>${titleMarkup(true)}<div class="result-intro"><img src="${CHEF_IMAGE}" alt="" aria-hidden="true" width="1572" height="2043"><p class="eyebrow">あなたの隠しレシピは…</p></div><h1 class="result-title" aria-label="${escapeHtml(result.name)}">${resultNameMarkup(result)}</h1>
    <div class="dish-frame"><div class="dish-photo"><img src="${escapeHtml(result.image)}" alt="${escapeHtml(result.dish)}" width="1402" height="1122"></div></div>
    <section class="result-section result-ingredients"><h2>主成分</h2><p>${escapeHtml(result.ingredients)}</p></section>
    <section class="result-section result-summary"><h2>総評</h2><p>${escapeHtml(result.description)}</p></section>
    <section class="result-section result-tip"><h2>おいしくなるコツ</h2><p>${escapeHtml(result.tip)}</p></section>
    <section class="result-section result-flavor"><h2>隠し味</h2><p>${escapeHtml(result.hiddenFlavor)}</p></section>
    <div class="result-actions"><button class="primary" data-action="share-page">シェア方法と100pt特典を見る ›</button><button class="secondary" data-action="restart">もう一度診断する</button></div><div class="result-band result-band-bottom" aria-hidden="true"></div>`, "q-7", "result-paper");
}
function shareText(result) {
  return `私の隠しレシピ診断をやってみた！\n結果は「${result.name}」でした。\n\n${HASHTAG}\n\n${SHARE_URL}`;
}
function shareView(result) {
  const text = shareText(result);
  const x = `https://twitter.com/intent/tweet?${new URLSearchParams({ text })}`;
  const line = `https://line.me/R/share?text=${encodeURIComponent(text)}`;
  return shell(`<h1 class="share-heading">レシピカードをシェアしよう</h1>
    <canvas id="recipe-card" class="card-preview" width="1200" height="1500" role="img" aria-label="${escapeHtml(result.name)}のシェア用レシピカード" aria-busy="true"></canvas>
    <div class="share-actions"><button class="primary" data-action="save" disabled>カード画像を保存</button><a class="secondary" id="open-card" href="#" target="_blank" rel="noopener" hidden>画像を開いて保存する</a><button class="secondary" data-action="share-file" disabled>画像付きで共有する</button><button class="secondary" data-action="copy">投稿文をコピー</button></div>
    <p class="share-note">保存ボタンが使えない端末では、画像を開いて長押しで保存してください。共有先に画像が付かない場合は、SNSの投稿画面で保存した画像を添付してください。</p>
    <div class="share-destinations"><a class="share-link" href="${escapeHtml(x)}" target="_blank" rel="noopener noreferrer">Xでシェア</a><a class="share-link" href="${escapeHtml(line)}" target="_blank" rel="noopener noreferrer">LINEでシェア</a></div>
    <p class="share-note">X・LINEでは投稿画面でカード画像が添付されているか確認してください。</p>
    <section class="reward"><h2 class="reward-banner"><img src="../assets/recipe/banner-cover.png" alt="私の隠しレシピ診断・シェアで100ptゲット" width="330" height="140"></h2><ol>
      <li><span class="step-number">1</span><span>診断結果のカード画像と「${HASHTAG}」を付けてSNSに投稿</span></li>
      <li><span class="step-number">2</span><span>投稿先と投稿内容が分かる、画面全体のスクリーンショットを撮影</span></li>
      <li><span class="step-number">3</span><span>スクリーンショットを問い合わせ窓口へ送信</span></li>
      <li><span class="step-number">4</span><span>運営側が確認後、100ptを加算</span></li>
    </ol><a class="primary" href="${SUPPORT_URL}">問い合わせ窓口はこちら</a><p class="reward-small">※ポイントの受け取りはお一人様1回までです。</p></section>`, "result");
}

function render() {
  clearTimeout(answerAdvanceTimer);
  answerAdvanceTimer = null;
  navigationLocked = false;
  const page = route();
  document.body.classList.toggle("home-mode", page.screen === "home");
  if (!READY && page.screen !== "home") { navigate("home", true); return; }
  if (!page.preview && page.screen === "quiz" && page.index > 0 && state.answers.slice(0, page.index).some((answer) => answer === null)) {
    const first = state.answers.findIndex((answer) => answer === null);
    navigate(`q-${first + 1}`, true); return;
  }
  if (!page.preview && (page.screen === "result" || page.screen === "share") && (!allAnswered() || !currentResult())) { navigate("home", true); return; }
  if (cardOpenUrl) { URL.revokeObjectURL(cardOpenUrl); cardOpenUrl = null; }
  const result = page.screen === "result" || page.screen === "share" ? displayedResult(page) : null;
  app.innerHTML = page.screen === "home" ? homeView()
    : page.screen === "quiz" ? quizView(page.index)
    : page.screen === "result" ? resultView(result)
    : shareView(result);
  document.title = `${page.screen === "home" ? "私の隠しレシピ診断" : page.screen === "quiz" ? `第${page.index + 1}問` : page.screen === "result" ? "診断結果" : "シェアと100pt特典"}｜Clear シェアラボ`;
  if (page.screen === "share") drawCard(result);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2500);
}
app.addEventListener("click", async (event) => {
  const control = event.target.closest("[data-action]");
  if (!control || navigationLocked) return;
  const action = control.dataset.action;
  const page = route();
  if (action === "back") { navigate(control.dataset.target); return; }
  if (action === "start" && READY) { state = emptyState(); saveState(); navigate("q-1"); return; }
  if (action === "answer" && page.screen === "quiz") {
    navigationLocked = true;
    const choice = Number(control.dataset.choice);
    if (!Number.isInteger(choice) || choice < 0 || choice >= CONTENT.questions[page.index].answers.length) { navigationLocked = false; return; }
    state.answers[page.index] = choice;
    state.resultId = null;
    saveState();
    app.querySelectorAll(".answer").forEach((answer) => {
      answer.setAttribute("aria-pressed", String(answer === control));
      answer.disabled = true;
    });
    answerAdvanceTimer = setTimeout(() => {
      answerAdvanceTimer = null;
      navigationLocked = false;
      const now = route();
      if (now.screen !== "quiz" || now.index !== page.index) return;
      try {
        if (page.index < 6) navigate(`q-${page.index + 2}`);
        else {
          if (!allAnswered()) throw new Error("回答がそろっていません");
          const id = CONTENT.resolveResult([...state.answers]);
          if (!CONTENT.results.some((result) => result.id === id)) throw new Error("確定版の判定結果が登録済みタイプと一致しません");
          state.resultId = id;
          saveState();
          navigate("result");
        }
      } catch (error) { console.error(error); showToast("診断結果を表示できませんでした"); }
    }, 420);
    return;
  }
  if (action === "share-page") {
    if (page.preview) {
      const url = new URL(location.href);
      url.searchParams.set("preview", `share-${page.previewType}`);
      history.pushState(null, "", url);
      render();
      window.scrollTo(0, 0);
    } else navigate("share");
    return;
  }
  if (action === "restart") { state = emptyState(); saveState(); navigate("home"); return; }
  if (action === "save") { await saveCard(); return; }
  if (action === "share-file") { await shareCard(); return; }
  if (action === "copy") { await copyText(shareText(displayedResult(page))); }
});
window.addEventListener("popstate", render);
window.addEventListener("hashchange", render);

function loadImage(src) {
  if (!images.has(src)) images.set(src, new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`画像を読み込めません: ${src}`));
    image.src = src;
  }));
  return images.get(src);
}
function roundedRect(ctx, x, y, width, height, radius, fill, stroke, lineWidth = 2) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}
function drawGingham(ctx, background, y, height) {
  for (let x = 0; x < 1200; x += 700) {
    const width = Math.min(700, 1200 - x);
    ctx.drawImage(background, 0, 0, width, height, x, y, width, height);
  }
}
function drawContained(ctx, image, x, y, width, height) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}
function wrapLines(ctx, text, maxWidth) {
  const paragraphs = String(text).split("\n");
  const lines = [];
  for (const paragraph of paragraphs) {
    let line = "";
    for (const char of Array.from(paragraph)) {
      if (line && ctx.measureText(line + char).width > maxWidth) { lines.push(line); line = char; }
      else line += char;
    }
    lines.push(line);
  }
  return lines;
}
function fitLines(ctx, text, maxWidth, maxHeight, startSize, minSize, weight, lineFactor = 1.52) {
  for (let size = startSize; size >= minSize; size -= 2) {
    ctx.font = `${weight} ${size}px "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif`;
    const lines = wrapLines(ctx, text, maxWidth);
    if (lines.length * size * lineFactor <= maxHeight) return { lines, size, lineHeight: size * lineFactor };
  }
  throw new Error("カードの原稿が所定の領域に収まりません。配置を調整してください。");
}
function drawCenteredLines(ctx, layout, x, top) {
  ctx.textAlign = "center";
  layout.lines.forEach((line, index) => ctx.fillText(line, x, top + index * layout.lineHeight));
}
async function drawCard(result) {
  const canvas = document.querySelector("#recipe-card");
  if (!canvas) return;
  cardReady = false;
  try {
    const [image, chef, title, background] = await Promise.all([
      loadImage(result.image), loadImage(CHEF_IMAGE), loadImage(TITLE_IMAGE), loadImage(BACKGROUND_IMAGE),
    ]);
    if (!canvas.isConnected) return;
    await document.fonts?.ready;
    if (!canvas.isConnected) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fffefa";
    ctx.fillRect(0, 0, 1200, 1500);
    drawGingham(ctx, background, 0, 56);
    drawGingham(ctx, background, 1444, 56);
    drawContained(ctx, title, 380, 64, 440, 110);
    ctx.textAlign = "center";
    const nameParts = resultNameParts(result);
    ctx.font = '900 76px "Meiryo", sans-serif';
    nameParts.forEach((line, index) => {
      const y = 254 + index * 80;
      const markerWidth = Math.min(940, ctx.measureText(line).width + 28);
      ctx.strokeStyle = "#ffe16b";
      ctx.lineWidth = 29;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(600 - markerWidth / 2, y - 10);
      ctx.lineTo(600 + markerWidth / 2, y - 10);
      ctx.stroke();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 5;
      ctx.strokeText(line, 600, y);
      ctx.fillStyle = "#082856";
      ctx.fillText(line, 600, y);
    });
    ctx.lineCap = "butt";

    roundedRect(ctx, 42, 363, 1116, 535, 14, "#082856", "#183d70", 4);
    // Keep the transparent food artwork on a white Polaroid with a wider lower edge.
    roundedRect(ctx, 76, 377, 1048, 506, 3, "#fff", "#d5dfe9", 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(95, 390, 1010, 475);
    drawContained(ctx, image, 113, 390, 974, 475);

    // The result-specific seal sits on the upper-right edge of the photo.
    ctx.beginPath(); ctx.arc(1015, 467, 99, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.strokeStyle = "#183d70"; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(1015, 467, 90, 0, Math.PI * 2);
    ctx.setLineDash([3, 6]); ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]);
    const sealTop = fitLines(ctx, result.sealTop, 160, 53, 22, 18, 800, 1.15);
    const sealBottom = fitLines(ctx, result.sealBottom, 164, 65, 25, 19, 800, 1.13);
    ctx.fillStyle = "#082856";
    drawCenteredLines(ctx, sealTop, 1015, 449);
    drawCenteredLines(ctx, sealBottom, 1015, 490);

    roundedRect(ctx, 42, 916, 1116, 203, 10, "#fff", "#183d70", 2);
    roundedRect(ctx, 51, 924, 1098, 187, 7, null, "#dce6f0", 2);
    roundedRect(ctx, 72, 905, 120, 43, 20, "#ec183d", "#ec183d", 2);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.font = '800 28px "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif';
    ctx.fillText("総評", 89, 936);
    const summaryText = result.type === "A" ? result.description.replace("動きながら「", "動きながら\n「") : result.description;
    const description = fitLines(ctx, summaryText, 820, 144, 39, 31, 700, 1.34);
    ctx.fillStyle = "#082856";
    description.lines.forEach((line, index) => ctx.fillText(line, 105, 1005 + index * description.lineHeight));
    drawContained(ctx, chef, 957, 943, 169, 160);

    roundedRect(ctx, 42, 1137, 711, 112, 8, "#fffdfb", "#8ba0b8", 2);
    ctx.fillStyle = "#ec183d";
    ctx.fillRect(42, 1147, 5, 91);
    roundedRect(ctx, 54, 1144, 145, 39, 19, "#ec183d", "#ec183d", 2);
    ctx.fillStyle = "#fff";
    ctx.font = '800 26px "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif';
    ctx.fillText("主成分", 68, 1172);
    const ingredients = fitLines(ctx, result.ingredients, 640, 45, 34, 28, 700, 1.2);
    ctx.fillStyle = "#082856";
    ingredients.lines.forEach((line, index) => ctx.fillText(line, 94, 1230 + index * ingredients.lineHeight));
    roundedRect(ctx, 42, 1259, 711, 165, 8, "#fffafb", "#ec9da8", 2);
    roundedRect(ctx, 54, 1267, 248, 38, 19, "#fff0f1", "#ec9da8", 2);
    ctx.fillStyle = "#ec183d";
    ctx.font = '800 26px "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif';
    ctx.fillText("おいしくなるコツ", 68, 1295);
    const tipText = result.tip.replace("、", "、\n");
    const tip = fitLines(ctx, tipText, 640, 105, 32, 26, 700, 1.08);
    ctx.fillStyle = "#082856";
    tip.lines.forEach((line, index) => ctx.fillText(line, 94, 1350 + index * tip.lineHeight));

    roundedRect(ctx, 779, 1137, 379, 165, 5, "#fff1ba", null);
    ctx.fillStyle = "#fffefa";
    ctx.beginPath(); ctx.moveTo(1139, 1137); ctx.lineTo(1158, 1137); ctx.lineTo(1158, 1156); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ec183d";
    ctx.font = '800 28px "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif';
    ctx.fillText("隠し味", 805, 1175);
    const flavor = fitLines(ctx, result.hiddenFlavor, 325, 85, 29, 23, 700, 1.2);
    ctx.fillStyle = "#082856";
    flavor.lines.forEach((line, index) => ctx.fillText(line, 805, 1218 + index * flavor.lineHeight));
    ctx.textAlign = "right";
    ctx.font = '800 36px "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif';
    ctx.fillText(HASHTAG, 1148, 1392);
    canvas.setAttribute("aria-busy", "false");
    cardReady = true;
    document.querySelector('[data-action="save"]').disabled = false;
    document.querySelector('[data-action="share-file"]').disabled = false;
    canvas.toBlob((blob) => {
      if (!blob || !canvas.isConnected) return;
      cardOpenUrl = URL.createObjectURL(blob);
      const link = document.querySelector("#open-card");
      if (link) { link.href = cardOpenUrl; link.hidden = false; }
    }, "image/png");
  } catch (error) {
    console.error(error);
    showToast("カード画像を作成できませんでした");
  }
}
function cardBlob() {
  const canvas = document.querySelector("#recipe-card");
  if (!cardReady || !canvas) return Promise.reject(new Error("カードの準備ができていません"));
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNGを作成できません")), "image/png"));
}
async function saveCard() {
  try {
    const blob = await cardBlob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `clear-recipe-${displayedResult().id}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    showToast("カード画像を保存します");
  } catch (error) { console.error(error); showToast("画像を保存できませんでした"); }
}
async function shareCard() {
  try {
    const blob = await cardBlob();
    const result = displayedResult();
    const file = new File([blob], `clear-recipe-${result.id}.png`, { type: "image/png" });
    if (!navigator.canShare?.({ files: [file] })) {
      showToast("カードを保存し、SNSで画像を添付してください"); return;
    }
    await navigator.share({ title: "私の隠しレシピ診断", text: shareText(result), files: [file] });
  } catch (error) {
    if (error.name !== "AbortError") { console.error(error); showToast("カードを保存し、SNSで画像を添付してください"); }
  }
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("投稿文をコピーしました");
  } catch (_) {
    const area = document.createElement("textarea");
    area.value = text; document.body.appendChild(area); area.select();
    const copied = document.execCommand("copy"); area.remove();
    showToast(copied ? "投稿文をコピーしました" : "投稿文をコピーできませんでした");
  }
}

render();
