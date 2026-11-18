"use strict";

const SUPPORT_URL = "https://app-clear.com/open?act=page_contact";
const STORAGE_KEY = "clearShareLab_v1";
const CLEAR_STORE_URLS = Object.freeze({
  ios: "https://apps.apple.com/jp/app/%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E5%8D%A0%E3%81%84-clear-%E3%82%AF%E3%83%AA%E3%82%A2-%E6%81%8B%E6%84%9B-%E5%BE%A9%E7%B8%81%E7%9B%B8%E8%AB%87%E3%82%A2%E3%83%97%E3%83%AA/id6467590967",
  android: "https://play.google.com/store/apps/details?id=com.clear.user",
});
const TEACHER_IMAGE = Object.freeze({ src: "./assets/ria-teacher.webp", width: 720, height: 629 });
const LOVE_REPORT_LOGO = Object.freeze({ src: "./assets/love-report-logo.webp", width: 1000, height: 333 });
const CLEAR_SHARE_LAB_LOGO = Object.freeze({ src: "./assets/clear-share-lab-logo.webp", width: 720, height: 298 });
const PAPER_REPORT_IMAGE = Object.freeze({ src: "./assets/paper-report.webp", width: 900, height: 1350 });
const POINT_COIN_IMAGE = Object.freeze({ src: "./assets/point-coin.webp", width: 360, height: 336 });
const SHARE_CONFIG = Object.freeze({
  displayHashtag: "#CLEARシェアラボ",
  shareUrl: "https://clear-official.github.io/clear-share-lab/love-report-preview/",
  snsText: (result) => `恋愛通知表やってみた💗\n私は「${result.typeName}」でした！\n\n#PR #CLEARシェアラボ\n\nよかったらやってみてね👇\n${SHARE_CONFIG.shareUrl}`,
  lineText: (result) => `恋愛通知表をやってみたよ💗\n私は「${result.typeName}」だった！\nよかったら試してみてね👇\n${SHARE_CONFIG.shareUrl}`,
});
const HASHTAG = SHARE_CONFIG.displayHashtag;

const TYPE_IDS = {
  REVEAL: "reveal",
  LOYAL: "loyal",
  PRINCESS: "princess",
  MEETING: "meeting",
  CHARM: "charm",
  ALL_IN: "all-in",
};

const RESULTS = {
  [TYPE_IDS.REVEAL]: {
    id: TYPE_IDS.REVEAL,
    typeName: "好きバレ秒速タイプ",
    typeDisplay: ["好きバレ", "秒速タイプ"],
    catchCopy: "好きになったら、だいたい顔に出てます。",
    characterImage: "./assets/ria-cupid.webp",
    characterWidth: 720,
    characterHeight: 655,
    characterScale: 1,
    ratings: { "積極性": 5, "一途度": 4, "甘え上手度": 3, "駆け引き力": 1, "沼りやすさ": 4 },
    teacherComment: "隠しているつもりでも、周囲にはほぼ提出済みです。",
    summary: "好きな人ができると、表情も返信速度も分かりやすく恋愛モードに。\n隠しているつもりでも、周りには意外とバレているかも…？\n駆け引きより、素直に「好き」が出ちゃうのがあなたの魅力です。",
    accentColor: "#f13b96",
    accentSoft: "#fff0f7",
    accentDeep: "#bd216c",
  },
  [TYPE_IDS.LOYAL]: {
    id: TYPE_IDS.LOYAL,
    typeName: "一途すぎ忠犬タイプ",
    typeDisplay: ["一途すぎ", "忠犬タイプ"],
    catchCopy: "好きになったら、他は見えません。",
    characterImage: "./assets/ria-dog.webp",
    characterWidth: 720,
    characterHeight: 519,
    characterScale: 1.16,
    ratings: { "積極性": 3, "一途度": 5, "甘え上手度": 4, "駆け引き力": 1, "沼りやすさ": 5 },
    teacherComment: "好きな人への皆勤賞は素晴らしいですが、自分の時間も大切にしましょう。",
    summary: "一度好きになると、とことん一途。\n待つのも尽くすのも苦にならない、愛情たっぷりタイプです。\nただし気づいたら、予定も気分も好きな人中心になっていることも。",
    accentColor: "#ef7099",
    accentSoft: "#fff5ef",
    accentDeep: "#b54b70",
  },
  [TYPE_IDS.PRINCESS]: {
    id: TYPE_IDS.PRINCESS,
    typeName: "追われ待ちプリンセスタイプ",
    typeDisplay: ["追われ待ち", "プリンセスタイプ"],
    catchCopy: "好き。でも、そっちから来て？",
    characterImage: "./assets/ria-princess.webp",
    characterWidth: 720,
    characterHeight: 606,
    characterScale: 1.06,
    ratings: { "積極性": 1, "一途度": 3, "甘え上手度": 5, "駆け引き力": 4, "沼りやすさ": 3 },
    teacherComment: "待っているだけでは先生も採点できません。たまには自分から一歩。",
    summary: "気になる人がいても、自分からグイグイ行くのはちょっと違う。\n「好きなら向こうから来てほしい」が本音の、追われたいタイプです。\n大切にされている実感が、恋のスイッチになることも。",
    accentColor: "#8a49e6",
    accentSoft: "#f7efff",
    accentDeep: "#6b31b4",
  },
  [TYPE_IDS.MEETING]: {
    id: TYPE_IDS.MEETING,
    typeName: "脳内恋愛会議タイプ",
    typeDisplay: ["脳内恋愛", "会議タイプ"],
    catchCopy: "返信ひとつで、会議が始まります。",
    characterImage: "./assets/ria-detective.webp",
    characterWidth: 720,
    characterHeight: 554,
    characterScale: 1.1,
    ratings: { "積極性": 2, "一途度": 4, "甘え上手度": 2, "駆け引き力": 3, "沼りやすさ": 5 },
    teacherComment: "返信の「！」が1個減っただけで、緊急会議を開かないように。",
    summary: "相手の言葉や行動を細かく読み取る慎重派。\n「あの言葉ってどういう意味？」と考えているうちに、脳内会議が長期化することも。\nでも、それだけ相手をよく見ているタイプでもあります。\n深く考える力は、恋を大切にするあなただからこその魅力です。",
    accentColor: "#6c3ee4",
    accentSoft: "#eef3ff",
    accentDeep: "#4f32ad",
  },
  [TYPE_IDS.CHARM]: {
    id: TYPE_IDS.CHARM,
    typeName: "無自覚沼らせタイプ",
    typeDisplay: ["無自覚", "沼らせタイプ"],
    catchCopy: "何もしてないのに、なぜか相手が沼る。",
    characterImage: "./assets/ria-devil.webp",
    characterWidth: 720,
    characterHeight: 604,
    characterScale: 1.05,
    ratings: { "積極性": 3, "一途度": 3, "甘え上手度": 4, "駆け引き力": 5, "沼りやすさ": 1 },
    teacherComment: "本人にその気はないようですが、周囲から被害報告が届いています。",
    summary: "追いかけすぎず、恋愛中でも自然体。\nその絶妙な距離感が、気づかないうちに相手を夢中にさせているかも。\n一番厄介なのは、本人にまったくその自覚がないところです。",
    accentColor: "#7e3bcf",
    accentSoft: "#f7efff",
    accentDeep: "#5f239c",
  },
  [TYPE_IDS.ALL_IN]: {
    id: TYPE_IDS.ALL_IN,
    typeName: "恋すると全振りタイプ",
    typeDisplay: ["恋すると", "全振りタイプ"],
    catchCopy: "通常運転、終了。恋愛モード突入。",
    characterImage: "./assets/ria-cheer.webp",
    characterWidth: 720,
    characterHeight: 555,
    characterScale: 1.1,
    ratings: { "積極性": 5, "一途度": 4, "甘え上手度": 3, "駆け引き力": 2, "沼りやすさ": 5 },
    teacherComment: "恋愛科目だけ急に履修単位が多すぎます。",
    summary: "本気で好きになった瞬間、恋愛スイッチが入ります！\n連絡も予定も美容も、一気に恋仕様へ切り替わります。\n好きな人のためなら全力疾走できる、熱量全開タイプです。",
    accentColor: "#f04a8d",
    accentSoft: "#fff0f4",
    accentDeep: "#bc245e",
  },
};

const QUESTIONS = [
  {
    text: "気になる人ができた！まずどうする？",
    answers: [
      { key: "A", text: "自分から話しかけたり、連絡する機会を増やす", scores: { [TYPE_IDS.REVEAL]: 2, [TYPE_IDS.ALL_IN]: 1 } },
      { key: "B", text: "相手の様子を見ながら、少しずつ距離を縮める", scores: { [TYPE_IDS.CHARM]: 2, [TYPE_IDS.MEETING]: 1 } },
      { key: "C", text: "向こうから来てくれないかな〜と待つ", scores: { [TYPE_IDS.PRINCESS]: 2, [TYPE_IDS.LOYAL]: 1 } },
    ],
  },
  {
    text: "好きな人から返信が来ない。どうなる？",
    answers: [
      { key: "A", text: "「忙しいのかな」と思って普通に待てる", scores: { [TYPE_IDS.LOYAL]: 2, [TYPE_IDS.CHARM]: 1 } },
      { key: "B", text: "何度もスマホを見ながら、返信が遅い理由を考える", scores: { [TYPE_IDS.MEETING]: 2, [TYPE_IDS.PRINCESS]: 1 } },
      { key: "C", text: "気になりすぎて、別の話題を送りたくなる", scores: { [TYPE_IDS.ALL_IN]: 2, [TYPE_IDS.REVEAL]: 1 } },
    ],
  },
  {
    text: "好きになったときのあなたに一番近いのは？",
    answers: [
      { key: "A", text: "周りから「好きなのバレバレ」と言われる", scores: { [TYPE_IDS.REVEAL]: 2, [TYPE_IDS.ALL_IN]: 1 } },
      { key: "B", text: "好きな人には尽くしたくなる", scores: { [TYPE_IDS.LOYAL]: 2, [TYPE_IDS.PRINCESS]: 1 } },
      { key: "C", text: "意外と普段と変わらない", scores: { [TYPE_IDS.CHARM]: 2, [TYPE_IDS.PRINCESS]: 1 } },
    ],
  },
  {
    text: "気になる人といい感じ。でも告白してこない！",
    answers: [
      { key: "A", text: "このまま待つ。できれば相手から言ってほしい", scores: { [TYPE_IDS.PRINCESS]: 2, [TYPE_IDS.LOYAL]: 1 } },
      { key: "B", text: "「私のことどう思ってるんだろう」と脳内反省会が始まる", scores: { [TYPE_IDS.MEETING]: 2, [TYPE_IDS.CHARM]: 1 } },
      { key: "C", text: "自分からさらに距離を縮めて、ほぼ答えを出しにいく", scores: { [TYPE_IDS.REVEAL]: 2, [TYPE_IDS.ALL_IN]: 1 } },
    ],
  },
  {
    text: "恋をすると、生活はどうなる？",
    answers: [
      { key: "A", text: "気づいたら好きな人中心になっている", scores: { [TYPE_IDS.LOYAL]: 2, [TYPE_IDS.MEETING]: 1 } },
      { key: "B", text: "恋愛も大事だけど、自分のペースはあまり変わらない", scores: { [TYPE_IDS.CHARM]: 2, [TYPE_IDS.PRINCESS]: 1 } },
      { key: "C", text: "連絡・予定・美容まで一気に恋愛モードになる", scores: { [TYPE_IDS.ALL_IN]: 2, [TYPE_IDS.REVEAL]: 1 } },
    ],
  },
];

const SCREEN_TITLES = {
  home: "恋愛通知表",
  quiz: "恋愛診断",
  name: "表示名の入力",
  grading: "先生が採点中",
  result: "診断結果",
};

const defaultState = () => ({ screen: "home", questionIndex: 0, answers: [], name: "", resultId: null, shareDestination: "sns" });
let state = loadState();
let advancing = false;
let gradingTimer = null;
let gradingPhaseTimer = null;
let previewOpen = false;
let previewScrollY = 0;
let shareBlob = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return defaultState();
    const restoredScreen = ["share", "upload", "code", "grading"].includes(saved.screen) ? "result" : saved.screen;
    if (!SCREEN_TITLES[restoredScreen]) return defaultState();
    return {
      ...defaultState(),
      screen: restoredScreen,
      questionIndex: Number.isInteger(saved.questionIndex) ? Math.max(0, Math.min(QUESTIONS.length - 1, saved.questionIndex)) : 0,
      answers: Array.isArray(saved.answers) ? saved.answers.slice(0, QUESTIONS.length).map((value) => [0, 1, 2].includes(value) ? value : null) : [],
      name: typeof saved.name === "string" ? saved.name.slice(0, 20) : "",
      resultId: Object.prototype.hasOwnProperty.call(RESULTS, saved.resultId) ? saved.resultId : null,
      shareDestination: ["sns", "line"].includes(saved.shareDestination) ? saved.shareDestination : "sns",
    };
  } catch (_) {
    return defaultState();
  }
}

function persistState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* Storage can be unavailable in private browsing. */ }
}

function setScreen(screen, { push = true, top = true } = {}) {
  state.screen = screen;
  persistState();
  if (push) history.pushState({ screen }, "", `#${screen}`);
  render();
  if (top) window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetDiagnosis() {
  closeSharePreview({ restoreHistory: false });
  state = defaultState();
  persistState();
  history.pushState({ screen: "home" }, "", "#home");
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scoreDiagnosis(answerIndexes) {
  const scores = Object.fromEntries(Object.keys(RESULTS).map((id) => [id, 0]));
  const primaryCounts = Object.fromEntries(Object.keys(RESULTS).map((id) => [id, 0]));
  const primaryByQuestion = [];

  answerIndexes.forEach((answerIndex, questionIndex) => {
    const answer = QUESTIONS[questionIndex]?.answers[answerIndex];
    if (!answer) return;
    let primaryId = null;
    Object.entries(answer.scores).forEach(([id, points]) => {
      scores[id] += points;
      if (points === 2) {
        primaryCounts[id] += 1;
        primaryId = id;
      }
    });
    primaryByQuestion[questionIndex] = primaryId;
  });

  const highScore = Math.max(...Object.values(scores));
  let candidates = Object.keys(scores).filter((id) => scores[id] === highScore);
  if (candidates.length > 1) {
    const highPrimary = Math.max(...candidates.map((id) => primaryCounts[id]));
    candidates = candidates.filter((id) => primaryCounts[id] === highPrimary);
  }
  if (candidates.length > 1) {
    for (let i = primaryByQuestion.length - 1; i >= 0; i -= 1) {
      if (candidates.includes(primaryByQuestion[i])) return primaryByQuestion[i];
    }
  }
  return candidates[0] || TYPE_IDS.MEETING;
}

function answerQuestion(answerIndex) {
  if (advancing || state.screen !== "quiz") return;
  advancing = true;
  document.querySelector(`[data-answer="${answerIndex}"]`)?.classList.add("is-marked");
  state.answers[state.questionIndex] = answerIndex;
  persistState();
  setTimeout(() => {
    if (state.questionIndex < QUESTIONS.length - 1) {
      state.questionIndex += 1;
      persistState();
      render();
    } else {
      state.resultId = scoreDiagnosis(state.answers);
      setScreen("name");
    }
    advancing = false;
  }, 270);
}

function submitName(event) {
  event.preventDefault();
  const input = document.querySelector("#display-name");
  const name = input.value.trim().slice(0, 20);
  if (!name) {
    input.focus();
    input.setAttribute("aria-invalid", "true");
    showToast("表示する名前を入力してください");
    return;
  }
  state.name = name;
  state.resultId = state.resultId || scoreDiagnosis(state.answers);
  beginGrading();
}

function beginGrading() {
  setScreen("grading");
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 900 : 2200;
  gradingPhaseTimer = window.setTimeout(() => {
    if (state.screen === "grading") document.querySelector("#grading-message")?.replaceChildren("あなたの恋愛通知表が完成しました！");
  }, Math.round(duration * .55));
  gradingTimer = window.setTimeout(finishGrading, duration);
}

function finishGrading() {
  if (state.screen !== "grading") return;
  clearTimeout(gradingTimer);
  clearTimeout(gradingPhaseTimer);
  history.replaceState({ screen: "result" }, "", "#result");
  setScreen("result", { push: false });
}

function stars(value) {
  return Array.from({ length: 5 }, (_, index) => `<span class="${index < value ? "star-full" : "star-empty"}" aria-hidden="true">★</span>`).join("");
}

function topbar(backTarget = null, showBrand = true) {
  return `<div class="topbar${showBrand ? "" : " topbar-back-only"}">${showBrand ? `<img class="brand-mini-logo" src="${CLEAR_SHARE_LAB_LOGO.src}" alt="CLEAR シェアラボ" width="${CLEAR_SHARE_LAB_LOGO.width}" height="${CLEAR_SHARE_LAB_LOGO.height}" decoding="async" />` : ""}${backTarget ? `<button class="ghost-btn" data-go="${backTarget}">← 戻る</button>` : ""}</div>`;
}

function renderHome() {
  return `<section class="screen home-screen">
    <div class="hero glass-card">
      <div class="classroom-window" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <span class="classroom-poster" aria-hidden="true">放課後の<br>恋愛授業 ♡</span>
      <img class="home-title-logo" src="${LOVE_REPORT_LOGO.src}" alt="恋愛通知表" width="${LOVE_REPORT_LOGO.width}" height="${LOVE_REPORT_LOGO.height}" fetchpriority="high" decoding="async" />
      <div class="home-teacher-scene"><span class="chalk-heart" aria-hidden="true">♡</span><span class="chalk-doodle" aria-hidden="true">◎</span><img class="home-teacher" src="${TEACHER_IMAGE.src}" alt="先生リアちゃん" width="${TEACHER_IMAGE.width}" height="${TEACHER_IMAGE.height}" fetchpriority="high" decoding="async" /><span class="chalk-star" aria-hidden="true">✦</span><span class="chalk-stick" aria-hidden="true"></span><span class="board-eraser" aria-hidden="true"></span></div>
      <p class="hero-copy">あなたの恋愛、<br>通知表にしたらどんなタイプ？</p>
      <p class="home-time"><span>所要時間</span><strong>約1分</strong></p>
      <button class="cta cta-pink" id="start-button">診断スタート <span aria-hidden="true">›</span></button>
    </div>
    <aside class="home-reward-card" aria-label="診断結果をシェアすると100ポイントプレゼント">
      <img class="point-coin home-coin home-coin-left" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" aria-hidden="true" decoding="async" />
      <div class="home-reward-copy"><span>診断結果をシェアして</span><strong><b>100</b>pt</strong><em>プレゼント！</em></div>
      <img class="point-coin home-coin home-coin-right" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" aria-hidden="true" decoding="async" />
    </aside>
  </section>`;
}

function renderQuiz() {
  const q = QUESTIONS[state.questionIndex];
  const progress = ((state.questionIndex + 1) / QUESTIONS.length) * 100;
  return `<section class="screen quiz-wrap">
    ${topbar(state.questionIndex > 0 ? "prev-question" : "home", false)}
    <div class="progress-track" role="progressbar" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${state.questionIndex + 1}" aria-label="診断の進み具合"><div class="progress-fill" style="width:${progress}%"></div></div>
    <article class="question-card glass-card">
      <p class="question-kicker">恋愛の小テスト</p>
      <h1 class="question-title">${q.text}</h1>
      <div class="answers">
        ${q.answers.map((answer, index) => `<button class="answer-btn${state.answers[state.questionIndex] === index ? " is-previously-selected" : ""}" data-answer="${index}" aria-pressed="${state.answers[state.questionIndex] === index}"><span class="answer-key">${answer.key}</span><span>${answer.text}</span><span class="answer-arrow" aria-hidden="true">›</span></button>`).join("")}
      </div>
    </article>
  </section>`;
}

function renderGrading() {
  return `<section class="screen grading-screen" aria-label="診断結果を準備中">
    <div class="grading-board">
      <p class="grading-chalk" aria-hidden="true">✎　♡　◎</p>
      <img src="${TEACHER_IMAGE.src}" alt="先生リアちゃん" width="${TEACHER_IMAGE.width}" height="${TEACHER_IMAGE.height}" decoding="async" />
      <p id="grading-message" role="status" aria-live="polite">先生が採点中…</p>
      <span class="grading-mark" aria-hidden="true">◎</span>
      <button class="grading-skip" id="skip-grading" type="button">結果をすぐ見る</button>
    </div>
  </section>`;
}

function renderName() {
  return `<section class="screen name-wrap">
    ${topbar("quiz-last", false)}
    <form class="name-card glass-card" id="name-form">
      <p class="name-kicker">恋愛通知表　氏名欄</p>
      <h1 class="screen-title">結果に表示する名前を教えてね</h1>
      <p class="screen-lead">あなた専用の恋愛通知表を作ります。</p>
      <label for="display-name" class="sr-only">結果に表示する名前</label>
      <input id="display-name" class="name-input" type="text" maxlength="20" autocomplete="nickname" placeholder="例：さくら" value="${escapeHtml(state.name)}" aria-describedby="name-note" required />
      <p class="privacy-note" id="name-note">入力した名前は投稿用の画像にも表示されます。<br>本名ではなく、ニックネームやSNSで使用している名前がおすすめです。</p>
      <button class="cta cta-pink" type="submit">診断結果を見る <span aria-hidden="true">›</span></button>
    </form>
  </section>`;
}

function resultData() {
  return RESULTS[state.resultId] || RESULTS[scoreDiagnosis(state.answers)];
}

function typeNameMarkup(result) {
  return (result.typeDisplay || [result.typeName]).map((line) => `<span>${escapeHtml(line)}</span>`).join("");
}

function ratingsMarkup(result) {
  return Object.entries(result.ratings).map(([label, value]) => `<div class="rating-row${value === 5 ? " is-honmaru" : ""}" role="row"><span class="rating-label" role="rowheader">${label}${value === 5 ? `<span class="rating-honmaru" aria-hidden="true">◎</span>` : ""}</span><span class="stars" role="cell" aria-label="5段階中${value}">${stars(value)}</span></div>`).join("");
}

function summaryMarkup(result) {
  return result.summary.split("\n").map((line, index) => index === 0 ? `<strong>${escapeHtml(line)}</strong>` : escapeHtml(line)).join("<br>");
}

function rewardMarkup() {
  return `<section class="reward-card support-reward">
    <p class="reward-ribbon">シェアで100ptゲット！</p>
    <div class="reward-heading">
      <img class="point-coin reward-coin reward-coin-left" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" aria-hidden="true" loading="lazy" decoding="async" />
      <p class="reward-points"><strong>100pt</strong><span>GET</span></p>
      <span class="reward-coin-pair" aria-hidden="true"><img class="point-coin reward-coin reward-coin-right" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" loading="lazy" decoding="async" /><img class="point-coin reward-coin reward-coin-small" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" loading="lazy" decoding="async" /></span>
    </div>
    <p class="reward-flow-label">100ptの受け取り方</p>
    <div class="steps" aria-label="参加方法">
      <div class="step"><span class="step-no">1</span><span>診断して結果カードを作成</span></div>
      <div class="step"><span class="step-no">2</span><span>公開SNSに投稿、またはLINEで友人・家族に送信</span></div>
      <div class="step"><span class="step-no">3</span><span>投稿・送信が完了した画面のスクリーンショットを撮影</span></div>
      <div class="step"><span class="step-no">4</span><span>スクリーンショットをCLEARのお問い合わせ窓口へ送付</span></div>
      <div class="step"><span class="step-no">5</span><span>運営確認後に100ptを手動加算</span></div>
    </div>
    <p class="reward-response-time">確認状況によっては、加算が翌日になる場合があります。</p>
  </section>`;
}

function sharePanelMarkup() {
  const snsSelected = state.shareDestination === "sns";
  return `<section class="share-panel" id="share-panel">
    <div class="share-panel-heading">
      <h2>この結果をシェアしよう</h2>
    </div>
    <div class="share-canvas-wrap">
      <p class="share-image-loading" id="share-image-loading" role="status">シェア画像を準備中…</p>
      <button class="share-preview-button" id="open-preview" type="button" aria-label="結果カードを拡大して見る" disabled>
        <canvas id="share-canvas" width="1080" height="1080" aria-label="${escapeHtml(state.name)}さんの恋愛通知表シェア画像" aria-busy="true"></canvas>
        <span class="preview-hint">タップして拡大</span>
      </button>
    </div>
    <div class="image-actions" aria-label="画像と文章の準備">
      <button class="sub-action" id="save-image" type="button" disabled>結果カードを保存</button>
      <button class="sub-action" id="copy-text" type="button">シェア文をコピー</button>
    </div>
    <div class="share-destinations" role="group" aria-label="共有先を選ぶ">
      <button class="destination-choice${snsSelected ? " is-active" : ""}" data-destination="sns" type="button" aria-pressed="${snsSelected}"><span class="destination-check" aria-hidden="true">✓</span>公開SNS</button>
      <button class="destination-choice${snsSelected ? "" : " is-active"}" data-destination="line" type="button" aria-pressed="${!snsSelected}"><span class="destination-check" aria-hidden="true">✓</span>LINEで友だちに送る</button>
    </div>
    <div class="destination-details">
      <h3 id="destination-title">${snsSelected ? "公開SNSへの投稿" : "LINEで個人へ送信"}</h3>
      <p id="destination-conditions">${snsSelected ? "結果カード画像を添付し、#PR と #CLEARシェアラボを含めて公開投稿してください。運営の確認が終わるまで、アカウントと投稿を公開状態にしてください。" : "友人や家族など、個人の相手に画像を送ってください。公式アカウント全般への送信は対象外です。ハッシュタグは不要です。"}</p>
      <button class="cta ${snsSelected ? "share-sns-primary" : "share-line-primary"}" id="share-primary" type="button" disabled>${snsSelected ? "画像付きでSNSにシェア" : "画像付きでLINEに送る"}</button>
      <p class="share-menu-note">共有メニューでは選択中の共有先を選んでください。メニューを開いただけでは参加完了になりません。</p>
      <p class="share-feedback" id="share-feedback" role="status" hidden></p>
    </div>
  </section>`;
}

function proofMarkup() {
  return `<section class="proof-card" aria-labelledby="proof-title">
    <h2 id="proof-title">スクリーンショットの撮り方</h2>
    <p>投稿・送信が完了した画面全体を、切り取らずに撮影してください。</p>
    <p id="proof-detail">${state.shareDestination === "sns" ? "公開SNSでは、投稿アカウント名と投稿内容が分かる画面を撮影します。" : "LINEでは、送信先と送信内容が分かる画面を撮影します。"}</p>
    <p class="proof-exclusions">結果カード画像だけ・投稿前の編集画面・共有メニューの画面は確認対象になりません。</p>
  </section>`;
}

function supportSubmissionMarkup() {
  return `<section class="support-submission" id="support-submission" aria-label="お問い合わせ窓口">
    <button class="cta cta-blue support-cta" type="button" disabled>スクリーンショットを送る</button>
    <p class="preview-submission-note">確認用プレビューでは100pt特典の申請を受け付けていません。</p>
  </section>`;
}

function clearAppMarkup() {
  return `<section class="clear-app-card" aria-labelledby="clear-app-title">
    <span class="notice-tape" aria-hidden="true"></span>
    <p class="clear-app-kicker">放課後の掲示板</p>
    <h2 id="clear-app-title">診断のあとは、CLEARでも楽しもう！</h2>
    <p>CLEARでは、恋愛だけでなく、仕事や人間関係などのお悩みも、チャットや電話で占い師に相談できます。</p>
    <button class="cta cta-blue" id="open-clear-store" type="button">CLEARアプリを見てみる</button>
    <div class="store-choices" id="store-choices" hidden>
      <a href="${CLEAR_STORE_URLS.ios}" target="_blank" rel="noopener noreferrer">iPhoneのApp Storeへ</a>
      <a href="${CLEAR_STORE_URLS.android}" target="_blank" rel="noopener noreferrer">AndroidのGoogle Playへ</a>
    </div>
  </section>`;
}

function sharePreviewModalMarkup() {
  return `<div class="share-image-modal" id="share-image-modal" role="dialog" aria-modal="true" aria-label="結果カードの拡大表示" hidden>
    <div class="share-modal-card">
      <button class="modal-close" id="close-preview" type="button">閉じる</button>
      <img id="expanded-share-image" alt="${escapeHtml(state.name)}さんの恋愛通知表" />
      <p>画像を長押しして保存できる端末もあります。保存できない場合は、結果画面の保存ボタンをご利用ください。</p>
    </div>
  </div>`;
}

function renderResult() {
  const result = resultData();
  return `<section class="screen result-wrap${result.id === TYPE_IDS.LOYAL ? " result-loyal" : ""}" style="--accent:${result.accentColor};--accent-soft:${result.accentSoft};--accent-deep:${result.accentDeep}">
    ${topbar("name", false)}
    <article class="result-card">
    <header class="result-hero">
      <span class="result-heart" aria-hidden="true">♡</span>
      <div class="result-heading"><img class="result-logo" src="${LOVE_REPORT_LOGO.src}" alt="恋愛通知表" width="${LOVE_REPORT_LOGO.width}" height="${LOVE_REPORT_LOGO.height}" fetchpriority="high" decoding="async" /></div>
      <div class="report-header"><p class="student-name"><span>氏名</span><strong>${escapeHtml(state.name)}さん</strong></p></div>
      <p class="result-name"><span>${escapeHtml(state.name)}さん</span>の恋愛タイプは…</p>
      <h1 class="type-name">${typeNameMarkup(result)}</h1>
      <div class="result-character-wrap" style="--character-scale:${result.characterScale || 1}"><img class="result-character" src="${result.characterImage}" alt="${result.typeName}のリアちゃん" width="${result.characterWidth}" height="${result.characterHeight}" fetchpriority="high" decoding="async" /></div>
      <p class="catch-copy">${result.catchCopy}</p>
    </header>
    <section class="section-card result-sheet">
      <h2 class="rating-heading">5段階評価</h2>
      <div class="ratings" role="table" aria-label="恋愛通知表の5段階評価">${ratingsMarkup(result)}</div>
      <aside class="teacher-note"><div class="teacher-note-head"><img class="teacher-face" src="${TEACHER_IMAGE.src}" alt="リアちゃん先生" width="${TEACHER_IMAGE.width}" height="${TEACHER_IMAGE.height}" loading="lazy" decoding="async" /><h3>先生からのひとこと</h3></div><span class="teacher-stamp" aria-hidden="true">花まる</span><p class="teacher-text">${result.teacherComment}</p></aside>
      <div class="summary-inline"><h3><span>総評</span></h3><p class="summary-text">${summaryMarkup(result)}</p></div>
    </section>
    </article>
    <section class="journey-card glass-card support-journey">
      ${rewardMarkup()}
      ${sharePanelMarkup()}
      ${proofMarkup()}
      ${supportSubmissionMarkup()}
    </section>
    ${clearAppMarkup()}
    <button class="restart-link" id="restart-button" type="button">もう一度診断する</button>
    ${sharePreviewModalMarkup()}
  </section>`;
}

function render() {
  const app = document.querySelector("#app");
  if (previewOpen) closeSharePreview({ restoreHistory: false });
  document.title = `${SCREEN_TITLES[state.screen]}｜CLEAR シェアラボ（確認用）`;
  const views = { home: renderHome, quiz: renderQuiz, name: renderName, grading: renderGrading, result: renderResult };
  app.innerHTML = (views[state.screen] || renderHome)();
  bindEvents();
  if (state.screen === "result") {
    shareBlob = null;
    drawShareImage().catch(() => {
      document.querySelector("#share-canvas")?.setAttribute("aria-busy", "false");
      const loading = document.querySelector("#share-image-loading");
      if (loading) loading.hidden = true;
      showShareFeedback("結果カードを作成できませんでした。ページを再読み込みしてください。");
    });
  }
}

function bindEvents() {
  document.querySelector("#start-button")?.addEventListener("click", () => {
    preloadCharacters();
    state.questionIndex = 0;
    state.answers = [];
    state.resultId = null;
    setScreen("quiz");
  });
  document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => answerQuestion(Number(button.dataset.answer))));
  document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => navigateAction(button.dataset.go)));
  document.querySelector("#name-form")?.addEventListener("submit", submitName);
  document.querySelector("#skip-grading")?.addEventListener("click", finishGrading);
  document.querySelector("#open-preview")?.addEventListener("click", openSharePreview);
  document.querySelector("#close-preview")?.addEventListener("click", () => closeSharePreview());
  document.querySelector("#share-image-modal")?.addEventListener("click", (event) => { if (event.target.id === "share-image-modal") closeSharePreview(); });
  document.querySelector("#save-image")?.addEventListener("click", saveShareImage);
  document.querySelector("#copy-text")?.addEventListener("click", copyShareText);
  document.querySelectorAll("[data-destination]").forEach((button) => button.addEventListener("click", () => selectShareDestination(button.dataset.destination)));
  document.querySelector("#share-primary")?.addEventListener("click", shareSelectedDestination);
  document.querySelector("#open-clear-store")?.addEventListener("click", openClearStore);
  document.querySelector("#restart-button")?.addEventListener("click", resetDiagnosis);
}

function navigateAction(target) {
  if (target === "prev-question") {
    state.questionIndex = Math.max(0, state.questionIndex - 1);
    persistState();
    render();
    return;
  }
  if (target === "quiz-last") {
    state.questionIndex = QUESTIONS.length - 1;
    setScreen("quiz");
    return;
  }
  setScreen(target);
}

function shareText(destination = state.shareDestination) {
  return destination === "line" ? SHARE_CONFIG.lineText(resultData()) : SHARE_CONFIG.snsText(resultData());
}

const imageCache = new Map();

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.decoding = "async";
    image.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

function preloadCharacters() {
  Object.values(RESULTS).forEach((result) => loadImage(result.characterImage).catch(() => imageCache.delete(result.characterImage)));
  loadImage(TEACHER_IMAGE.src).catch(() => imageCache.delete(TEACHER_IMAGE.src));
  loadImage(LOVE_REPORT_LOGO.src).catch(() => imageCache.delete(LOVE_REPORT_LOGO.src));
  loadImage(CLEAR_SHARE_LAB_LOGO.src).catch(() => imageCache.delete(CLEAR_SHARE_LAB_LOGO.src));
  loadImage(PAPER_REPORT_IMAGE.src).catch(() => imageCache.delete(PAPER_REPORT_IMAGE.src));
  loadImage(POINT_COIN_IMAGE.src).catch(() => imageCache.delete(POINT_COIN_IMAGE.src));
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke(); }
}

function canvasTextLines(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const char of Array.from(text)) {
    if (ctx.measureText(line + char).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else line += char;
  }
  if (line) lines.push(line);
  return lines;
}

function fitCanvasLines(ctx, text, maxWidth, maxLines, startSize, minSize, weight = 900) {
  for (let size = startSize; size >= minSize; size -= 1) {
    ctx.font = `${weight} ${size}px "Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif`;
    const lines = canvasTextLines(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { lines, size };
  }
  ctx.font = `${weight} ${minSize}px "Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif`;
  return { lines: canvasTextLines(ctx, text, maxWidth), size: minSize };
}

function drawImageContain(ctx, image, x, y, width, height) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawImageCover(ctx, image, x, y, width, height) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawVectorStar(ctx, cx, cy, radius, filled) {
  ctx.beginPath();
  for (let point = 0; point < 10; point += 1) {
    const angle = -Math.PI / 2 + point * Math.PI / 5;
    const distance = point % 2 === 0 ? radius : radius * .45;
    const x = cx + Math.cos(angle) * distance;
    const y = cy + Math.sin(angle) * distance;
    if (point === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = filled ? "#ef3f91" : "#8cbcf0";
  ctx.fillStyle = filled ? "#ef3f91" : "rgba(255,255,255,.55)";
  ctx.fill();
  ctx.stroke();
}

function drawReportStamp(ctx, cx, cy, radius, label) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-.16);
  ctx.strokeStyle = "rgba(207,72,99,.82)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#c94968";
  ctx.textAlign = "center";
  ctx.font = '900 16px "Yu Gothic", sans-serif';
  ctx.fillText(label, 0, 6);
  ctx.restore();
}

async function drawShareImage() {
  const canvas = document.querySelector("#share-canvas");
  if (!canvas) return;
  const loading = document.querySelector("#share-image-loading");
  canvas.setAttribute("aria-busy", "true");
  if (loading) loading.hidden = false;
  const ctx = canvas.getContext("2d");
  const result = resultData();
  await document.fonts?.ready;
  ctx.clearRect(0, 0, 1080, 1080);
  const background = ctx.createLinearGradient(0, 0, 1080, 1080);
  background.addColorStop(0, "#dceefb");
  background.addColorStop(.55, "#e8e3fb");
  background.addColorStop(1, "#fff0eb");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = "rgba(255,255,255,.25)";
  for (let y = 38; y < 1080; y += 46) ctx.fillRect(0, y, 1080, 2);
  ctx.shadowColor = "rgba(35,59,105,.2)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  roundRect(ctx, 28, 22, 1024, 1036, 34, "#fffefa", "#7899bb");
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  try {
    const reportPaper = await loadImage(PAPER_REPORT_IMAGE.src);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(32, 26, 1016, 1028, 30);
    ctx.clip();
    ctx.globalAlpha = .1;
    drawImageCover(ctx, reportPaper, 32, 26, 1016, 1028);
    ctx.restore();
  } catch (_) {}
  ctx.save();
  ctx.strokeStyle = "rgba(125,158,192,.6)";
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 9]);
  ctx.beginPath();
  ctx.roundRect(45, 39, 990, 1002, 24);
  ctx.stroke();
  ctx.restore();
  roundRect(ctx, 60, 52, 960, 158, 22, "rgba(218,239,251,.7)", "#a1b9d2");
  try {
    const logo = await loadImage(LOVE_REPORT_LOGO.src);
    drawImageContain(ctx, logo, 180, 58, 720, 145);
  } catch (_) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#284a83";
    ctx.font = '950 72px "Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif';
    ctx.fillText("恋愛通知表", 540, 148);
  }
  roundRect(ctx, 154, 227, 772, 58, 12, "rgba(255,255,255,.94)", "#9bb3ce");
  const studentLabel = "氏名";
  const studentDisplayName = `${state.name}さん`;
  const studentGap = 25;
  ctx.textAlign = "left";
  ctx.fillStyle = "#526b8e";
  ctx.font = '800 22px "Yu Gothic", sans-serif';
  const studentLabelWidth = ctx.measureText(studentLabel).width;
  ctx.font = '900 28px "Yu Gothic", sans-serif';
  const studentNameWidth = ctx.measureText(studentDisplayName).width;
  const studentStartX = 540 - (studentLabelWidth + studentGap + studentNameWidth) / 2;
  ctx.font = '800 22px "Yu Gothic", sans-serif';
  ctx.fillText(studentLabel, studentStartX, 265);
  ctx.fillStyle = "#21375d";
  ctx.font = '900 28px "Yu Gothic", sans-serif';
  ctx.fillText(studentDisplayName, studentStartX + studentLabelWidth + studentGap, 265);
  drawReportStamp(ctx, 971, 254, 29, "採点済");

  roundRect(ctx, 68, 304, 944, 275, 22, result.accentSoft, "#a6a3ce");
  roundRect(ctx, 85, 320, 374, 242, 17, "#d9edf6", "#9ebbd0");
  ctx.strokeStyle = "rgba(255,255,255,.7)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(272, 323); ctx.lineTo(272, 559);
  ctx.moveTo(88, 441); ctx.lineTo(456, 441);
  ctx.stroke();
  try {
    const character = await loadImage(result.characterImage);
    const characterBox = result.id === TYPE_IDS.LOYAL
      ? { x: 103, y: 328, width: 336, height: 228 }
      : { x: 85, y: 318, width: 375, height: 245 };
    ctx.save();
    ctx.shadowColor = "rgba(29,54,100,.16)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 7;
    drawImageContain(ctx, character, characterBox.x, characterBox.y, characterBox.width, characterBox.height);
    ctx.restore();
  } catch (_) {}
  ctx.textAlign = "left";
  ctx.fillStyle = "#21375d";
  const typeLines = Array.isArray(result.typeDisplay) && result.typeDisplay.join("") === result.typeName
    ? result.typeDisplay
    : fitCanvasLines(ctx, result.typeName, 495, 2, 48, 39, 950).lines;
  for (let size = 54; size >= 43; size -= 1) {
    ctx.font = `950 ${size}px "Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif`;
    if (typeLines.every((line) => ctx.measureText(line).width <= 495)) break;
  }
  typeLines.forEach((line, index) => ctx.fillText(line, 490, 379 + index * 58));
  ctx.fillStyle = "#9d376f";
  const catchLayout = fitCanvasLines(ctx, result.catchCopy, 485, 3, 25, 22, 850);
  const catchStartY = 379 + (typeLines.length - 1) * 58 + 50;
  catchLayout.lines.forEach((line, index) => ctx.fillText(line, 490, catchStartY + index * 31));

  roundRect(ctx, 68, 596, 944, 143, 17, "rgba(255,247,250,.96)", "#d9a6bd");
  roundRect(ctx, 87, 612, 274, 38, 8, "#ffe1eb", null);
  ctx.textAlign = "left";
  ctx.fillStyle = "#a1346b";
  ctx.font = '900 23px "Yu Gothic", sans-serif';
  ctx.fillText("先生からのひとこと", 101, 638);
  drawReportStamp(ctx, 780, 635, 25, "花まる");
  ctx.fillStyle = "#21375d";
  const teacherLayout = fitCanvasLines(ctx, result.teacherComment, 690, 3, 26, 22, 750);
  teacherLayout.lines.forEach((line, index) => ctx.fillText(line, 101, 676 + index * 27));
  try {
    const teacher = await loadImage(TEACHER_IMAGE.src);
    drawImageContain(ctx, teacher, 827, 602, 162, 130);
  } catch (_) {}
  ctx.fillStyle = "#21375d";
  ctx.font = '900 24px "Yu Gothic", sans-serif';
  ctx.fillText("5段階評価", 83, 775);
  const tableX = 68;
  const tableY = 791;
  const tableWidth = 944;
  const rowHeight = 54;
  const entries = Object.entries(result.ratings);
  entries.forEach(([label, value], index) => {
    const isLast = index === 4;
    const column = index % 2;
    const row = Math.floor(index / 2);
    const cellX = isLast ? tableX : tableX + column * (tableWidth / 2);
    const cellWidth = isLast ? tableWidth : tableWidth / 2;
    const cellY = tableY + row * rowHeight;
    roundRect(ctx, cellX + 2, cellY + 2, cellWidth - 4, rowHeight - 4, 9, "rgba(247,251,255,.96)", "#a7bfd8");
    ctx.textAlign = "left";
    ctx.fillStyle = "#21375d";
    ctx.font = '850 23px "Yu Gothic", sans-serif';
    ctx.fillText(label, cellX + 20, cellY + 36);
    if (value === 5) {
      ctx.fillStyle = "#d94f69";
      ctx.font = '900 27px "Yu Gothic", sans-serif';
      ctx.fillText("◎", cellX + (isLast ? 262 : 183), cellY + 37);
    }
    const starStart = isLast ? cellX + 320 : cellX + 222;
    for (let star = 0; star < 5; star += 1) {
      drawVectorStar(ctx, starStart + star * 43, cellY + 28, 16, star < value);
    }
  });
  ctx.textAlign = "center";
  ctx.fillStyle = "#a63873";
  ctx.font = '950 32px "Yu Gothic", sans-serif';
  ctx.fillText(HASHTAG, 365, 988);
  ctx.fillStyle = "#334d72";
  ctx.font = '850 25px "Yu Gothic", sans-serif';
  ctx.fillText("あなたは何タイプ？", 365, 1023);
  try {
    const brandLogo = await loadImage(CLEAR_SHARE_LAB_LOGO.src);
    drawImageContain(ctx, brandLogo, 805, 961, 190, 73);
  } catch (_) {}
  canvas.toBlob((blob) => {
    if (!canvas.isConnected) return;
    shareBlob = blob;
    canvas.setAttribute("aria-busy", "false");
    if (loading) loading.hidden = true;
    if (!blob) {
      showShareFeedback("結果カードの画像を作成できませんでした。ページを再読み込みしてください。");
      return;
    }
    ["open-preview", "save-image", "share-primary"].forEach((id) => { document.getElementById(id).disabled = false; });
  }, "image/png", 1);
}

function shareFile() {
  return shareBlob ? new File([shareBlob], `clear-love-report-${resultData().id}.png`, { type: "image/png" }) : null;
}

function canShareFile(file) {
  if (!file || !navigator.share || !navigator.canShare) return false;
  try { return navigator.canShare({ files: [file] }); } catch (_) { return false; }
}

function showShareFeedback(message, fallbackUrl = "") {
  const feedback = document.querySelector("#share-feedback");
  if (!feedback) return;
  feedback.replaceChildren(document.createTextNode(message));
  if (fallbackUrl) {
    const link = document.createElement("a");
    link.href = fallbackUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = state.shareDestination === "line" ? "LINEで文章を開く" : "Xで文章を開く";
    feedback.append(" ", link);
  }
  feedback.hidden = false;
}

function selectShareDestination(destination) {
  if (!["sns", "line"].includes(destination)) return;
  state.shareDestination = destination;
  persistState();
  document.querySelectorAll("[data-destination]").forEach((button) => {
    const active = button.dataset.destination === destination;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const sns = destination === "sns";
  const title = document.querySelector("#destination-title");
  const conditions = document.querySelector("#destination-conditions");
  const primary = document.querySelector("#share-primary");
  const proof = document.querySelector("#proof-detail");
  if (title) title.textContent = sns ? "公開SNSへの投稿" : "LINEで個人へ送信";
  if (conditions) conditions.textContent = sns
    ? "結果カード画像を添付し、#PR と #CLEARシェアラボを含めて公開投稿してください。運営の確認が終わるまで、アカウントと投稿を公開状態にしてください。"
    : "友人や家族など、個人の相手に画像を送ってください。公式アカウント全般への送信は対象外です。ハッシュタグは不要です。";
  if (primary) {
    primary.textContent = sns ? "画像付きでSNSにシェア" : "画像付きでLINEに送る";
    primary.classList.toggle("share-sns-primary", sns);
    primary.classList.toggle("share-line-primary", !sns);
  }
  if (proof) proof.textContent = sns
    ? "公開SNSでは、投稿アカウント名と投稿内容が分かる画面を撮影します。"
    : "LINEでは、送信先と送信内容が分かる画面を撮影します。";
  const feedback = document.querySelector("#share-feedback");
  if (feedback) feedback.hidden = true;
}

function fallbackShareUrl() {
  return state.shareDestination === "line"
    ? `https://line.me/R/share?text=${encodeURIComponent(shareText("line"))}`
    : `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText("sns"))}`;
}

async function shareSelectedDestination() {
  const file = shareFile();
  if (!file) {
    showShareFeedback("結果カードを作成できませんでした。ページを再読み込みしてください。");
    return;
  }
  if (canShareFile(file)) {
    try {
      await navigator.share({ title: "恋愛通知表", text: shareText(), files: [file] });
      showShareFeedback("共有先で投稿・送信が完了したか確認してください。共有メニューを閉じただけでは参加完了になりません。");
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
      showShareFeedback("画像付き共有を開けませんでした。結果カードを保存し、共有先で画像を手動添付してください。");
      return;
    }
  }
  showShareFeedback("このブラウザからは画像を直接添付できません。結果カードを保存して手動添付してください。以下のリンクで開くのは文章のみです。", fallbackShareUrl());
}

async function saveShareImage() {
  const file = shareFile();
  if (!file) {
    showShareFeedback("結果カードを作成できませんでした。ページを再読み込みしてください。");
    return;
  }
  if (canShareFile(file)) {
    try {
      await navigator.share({ title: "恋愛通知表", files: [file] });
      showShareFeedback("端末の共有メニューで画像の保存先を選んでください。保存できたかは端末側で確認してください。");
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  downloadBlob(shareBlob, file.name);
  showShareFeedback("画像のダウンロードを開始しました。端末に保存できたか確認してください。拡大表示から長押し保存できる端末もあります。");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function copyShareText() {
  return copyText(shareText(), "シェア文をコピーしました");
}

function openSharePreview() {
  const canvas = document.querySelector("#share-canvas");
  const modal = document.querySelector("#share-image-modal");
  const image = document.querySelector("#expanded-share-image");
  if (!shareBlob || !canvas || !modal || !image) return;
  previewScrollY = window.scrollY;
  image.src = canvas.toDataURL("image/png");
  modal.hidden = false;
  previewOpen = true;
  document.documentElement.classList.add("preview-is-open");
  history.pushState({ screen: "result", preview: true }, "", "#preview");
  modal.querySelector("#close-preview")?.focus();
}

function closeSharePreview({ restoreHistory = true } = {}) {
  if (!previewOpen) return;
  if (restoreHistory && location.hash === "#preview") {
    history.back();
    return;
  }
  previewOpen = false;
  const modal = document.querySelector("#share-image-modal");
  if (modal) modal.hidden = true;
  document.documentElement.classList.remove("preview-is-open");
  window.scrollTo({ top: previewScrollY, behavior: "auto" });
  document.querySelector("#open-preview")?.focus({ preventScroll: true });
}

function openClearStore() {
  const ua = navigator.userAgent;
  const url = /iPad|iPhone|iPod/.test(ua) ? CLEAR_STORE_URLS.ios
    : /Android/.test(ua) ? CLEAR_STORE_URLS.android : null;
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  const choices = document.querySelector("#store-choices");
  if (choices) choices.hidden = false;
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (_) {
      copied = false;
    } finally {
      area.remove();
    }
    if (!copied) {
      showToast("コピーできませんでした");
      return false;
    }
  }
  showToast(message);
  return true;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

window.addEventListener("popstate", (event) => {
  if (previewOpen) {
    closeSharePreview({ restoreHistory: false });
    if (event.state?.screen === "result" || location.hash === "#result") return;
  }
  const screen = event.state?.screen || location.hash.slice(1);
  const normalizedScreen = ["share", "upload", "code", "grading", "preview"].includes(screen) ? "result" : screen;
  if (!SCREEN_TITLES[normalizedScreen]) return;
  if (normalizedScreen !== screen) history.replaceState({ screen: normalizedScreen }, "", `#${normalizedScreen}`);
  state.screen = normalizedScreen;
  persistState();
  render();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && previewOpen) closeSharePreview();
});

if (location.hash === "#home") state.screen = "home";
if (!location.hash || location.hash !== `#${state.screen}`) history.replaceState({ screen: state.screen }, "", `#${state.screen}`);
if (["quiz", "name", "result"].includes(state.screen)) preloadCharacters();
render();
