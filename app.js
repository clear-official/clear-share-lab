"use strict";

const CAMPAIGN_CODE = "LVR7Q2";
const STORAGE_KEY = "clearShareLab_v1";
const TEACHER_IMAGE = Object.freeze({ src: "./assets/ria-teacher.webp", width: 720, height: 629 });
const LOVE_REPORT_LOGO = Object.freeze({ src: "./assets/love-report-logo.webp", width: 1000, height: 333 });
const CLEAR_SHARE_LAB_LOGO = Object.freeze({ src: "./assets/clear-share-lab-logo.webp", width: 720, height: 298 });
const HOME_BRAND_RIA_IMAGE = Object.freeze({ src: "./assets/clear-ria-lockup.webp", width: 877, height: 706 });
const PAPER_REPORT_IMAGE = Object.freeze({ src: "./assets/paper-report.webp", width: 900, height: 1350 });
const PAPER_MESSAGE_IMAGE = Object.freeze({ src: "./assets/paper-message-card.webp", width: 1200, height: 675 });
const POINT_COIN_IMAGE = Object.freeze({ src: "./assets/point-coin.webp", width: 360, height: 336 });
const SHARE_CONFIG = Object.freeze({
  displayHashtag: "＃CLEARシェアラボ",
  socialHashtag: "#CLEARシェアラボ",
  shareUrl: "https://clear-love-report-2026.nakamura-s391270.chatgpt.site/",
  xText: (result) => `恋愛通知表やってみた！\n私は「${result.typeName}」でした！\n\n${SHARE_CONFIG.socialHashtag}`,
  lineText: (result) => `恋愛通知表やってみた！\n私は「${result.typeName}」でした！\n${SHARE_CONFIG.socialHashtag}`,
  generalText: (result) => `恋愛通知表やってみた！\n私は「${result.typeName}」でした！\n\n${SHARE_CONFIG.socialHashtag}`,
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
  result: "診断結果",
};

const defaultState = () => ({ screen: "home", questionIndex: 0, answers: [], name: "", resultId: null, sharePanelOpen: false, campaignUnlocked: false });
let state = loadState();
let selectedUpload = null;
let selectedUploadUrl = null;
let uploadError = "";
let advancing = false;
let copyCodeResetTimer = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return defaultState();
    const restoredScreen = ["share", "upload", "code"].includes(saved.screen) ? "result" : saved.screen;
    if (!SCREEN_TITLES[restoredScreen]) return defaultState();
    return {
      ...defaultState(),
      ...saved,
      screen: restoredScreen,
      sharePanelOpen: saved.sharePanelOpen || ["share", "upload", "code"].includes(saved.screen),
      campaignUnlocked: saved.campaignUnlocked || saved.screen === "code",
      answers: Array.isArray(saved.answers) ? saved.answers.slice(0, 5) : [],
    };
  } catch (_) {
    return defaultState();
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setScreen(screen, { push = true, top = true } = {}) {
  state.screen = screen;
  persistState();
  if (push) history.pushState({ screen }, "", `#${screen}`);
  render();
  if (top) window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetDiagnosis() {
  if (selectedUploadUrl) URL.revokeObjectURL(selectedUploadUrl);
  selectedUpload = null;
  selectedUploadUrl = null;
  uploadError = "";
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
  }, 170);
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
  state.sharePanelOpen = false;
  state.campaignUnlocked = false;
  setScreen("result");
}

function stars(value) {
  return Array.from({ length: 5 }, (_, index) => `<span class="${index < value ? "star-full" : "star-empty"}" aria-hidden="true">★</span>`).join("");
}

function topbar(backTarget = null, showBrand = true) {
  return `<div class="topbar${showBrand ? "" : " topbar-back-only"}">${showBrand ? `<img class="brand-mini-logo" src="${CLEAR_SHARE_LAB_LOGO.src}" alt="Clear シェアラボ" width="${CLEAR_SHARE_LAB_LOGO.width}" height="${CLEAR_SHARE_LAB_LOGO.height}" decoding="async" />` : ""}${backTarget ? `<button class="ghost-btn" data-go="${backTarget}">← 戻る</button>` : ""}</div>`;
}

function renderHome() {
  return `<section class="screen">
    <div class="hero glass-card">
      <img class="home-title-logo" src="${LOVE_REPORT_LOGO.src}" alt="恋愛通知表" width="${LOVE_REPORT_LOGO.width}" height="${LOVE_REPORT_LOGO.height}" fetchpriority="high" decoding="async" />
      <p class="hero-copy">あなたの恋愛、<br>通知表にしたらどんなタイプ？</p>
      <div class="facts"><span class="fact">質問数 5問</span><span class="fact">所要時間 約1分</span></div>
      <button class="cta cta-pink" id="start-button">診断スタート <span aria-hidden="true">›</span></button>
      <img class="home-brand-ria-lockup" src="${HOME_BRAND_RIA_IMAGE.src}" alt="白衣リアちゃんとCLEARシェアラボ" width="${HOME_BRAND_RIA_IMAGE.width}" height="${HOME_BRAND_RIA_IMAGE.height}" fetchpriority="high" decoding="async" />
      <aside class="home-reward-card" aria-label="診断結果をシェアすると100ポイントプレゼント">
        <img class="point-coin home-coin home-coin-left" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" aria-hidden="true" decoding="async" />
        <div class="home-reward-copy"><span>診断結果をシェアして</span><strong><b>100</b>pt</strong><em>プレゼント！</em></div>
        <img class="point-coin home-coin home-coin-right" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" aria-hidden="true" decoding="async" />
      </aside>
    </div>
  </section>`;
}

function renderQuiz() {
  const q = QUESTIONS[state.questionIndex];
  const progress = ((state.questionIndex + 1) / QUESTIONS.length) * 100;
  return `<section class="screen quiz-wrap">
    ${topbar(state.questionIndex > 0 ? "prev-question" : "home")}
    <div class="progress-row"><span class="progress-label">${state.questionIndex + 1}問目 / 全${QUESTIONS.length}問</span><span>${Math.round(progress)}%</span></div>
    <div class="progress-track" role="progressbar" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${state.questionIndex + 1}" aria-label="診断の進み具合"><div class="progress-fill" style="width:${progress}%"></div></div>
    <article class="question-card glass-card">
      <p class="question-no">第${state.questionIndex + 1}問</p>
      <h1 class="question-title">${q.text}</h1>
      <div class="answers">
        ${q.answers.map((answer, index) => `<button class="answer-btn" data-answer="${index}"><span class="answer-key">${answer.key}</span><span>${answer.text}</span><span class="answer-arrow" aria-hidden="true">›</span></button>`).join("")}
      </div>
    </article>
  </section>`;
}

function renderName() {
  return `<section class="screen">
    ${topbar("quiz-last")}
    <form class="name-card glass-card" id="name-form">
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
  return Object.entries(result.ratings).map(([label, value]) => `<div class="rating-row" role="row"><span class="rating-label" role="rowheader">${label}</span><span class="stars" role="cell" aria-label="5段階中${value}">${stars(value)}</span></div>`).join("");
}

function rewardMarkup() {
  return `<section class="reward-card">
    <p class="reward-ribbon">シェアしてポイントゲット！</p>
    <div class="reward-heading">
      <img class="point-coin reward-coin reward-coin-left" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" aria-hidden="true" loading="lazy" decoding="async" />
      <p class="reward-points"><strong>100pt</strong><span>GET</span></p>
      <span class="reward-coin-pair" aria-hidden="true"><img class="point-coin reward-coin reward-coin-right" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" loading="lazy" decoding="async" /><img class="point-coin reward-coin reward-coin-small" src="${POINT_COIN_IMAGE.src}" alt="" width="${POINT_COIN_IMAGE.width}" height="${POINT_COIN_IMAGE.height}" loading="lazy" decoding="async" /></span>
    </div>
    <p class="reward-caption">投稿画面のスクショを送るだけ</p>
    <div class="steps" aria-label="参加方法">
      <div class="step"><span class="step-no">1</span><span>${HASHTAG}を付けて<br>SNSへ投稿</span></div>
      <div class="step"><span class="step-no">2</span><span>投稿画面の<br>スクショを撮影</span></div>
      <div class="step"><span class="step-no">3</span><span>スクショを<br>アップロード</span></div>
      <div class="step"><span class="step-no">4</span><span>キャンペーン<br>コードを受け取る</span></div>
    </div>
  </section>`;
}

function sharePanelMarkup() {
  const result = resultData();
  const xUrl = `https://twitter.com/intent/tweet?${new URLSearchParams({ text: SHARE_CONFIG.xText(result), url: SHARE_CONFIG.shareUrl })}`;
  const lineMessage = `${SHARE_CONFIG.lineText(result)}\n${SHARE_CONFIG.shareUrl}`;
  const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(lineMessage)}`;
  return `<section class="share-panel" id="share-panel">
    <div class="share-panel-heading">
      <span class="flow-badge">まずはシェア</span>
      <h2>この結果をシェアしよう</h2>
      <p class="hashtag">${HASHTAG}</p>
    </div>
    <div class="share-canvas-wrap">
      <p class="share-image-loading" id="share-image-loading" role="status">シェア画像を準備中…</p>
      <canvas id="share-canvas" width="1080" height="1080" aria-label="${escapeHtml(state.name)}さんの恋愛通知表シェア画像" aria-busy="true"></canvas>
    </div>
    <div class="image-actions" aria-label="画像と文章の準備">
      <button class="sub-action" id="save-image">画像を保存</button>
      <button class="sub-action" id="copy-text">シェア文をコピー</button>
    </div>
    <div class="share-destinations" aria-label="共有先を選ぶ">
      <a class="share-choice share-x" id="x-share" href="${escapeHtml(xUrl)}" target="_blank" rel="noopener noreferrer">Xでシェア</a>
      <a class="share-choice share-line" id="line-share" href="${escapeHtml(lineUrl)}" target="_blank" rel="noopener noreferrer">LINEでシェア</a>
      <button class="share-choice share-other" id="other-share" type="button">その他でシェア</button>
    </div>
    <p class="share-attach-note">X・LINEでは投稿画面で画像を添付してください。</p>
    <p class="share-fallback-note" id="share-fallback-note" hidden>この端末では共有画面を開けません。画像の保存とシェア文のコピーをご利用ください。</p>
  </section>`;
}

function codeMarkup() {
  if (!state.campaignUnlocked) return "";
  return `<section class="code-card" id="campaign-code-section" tabindex="-1">
    <p class="thanks">アップロード完了！</p>
    <h2 class="code-reward"><span>コードを入力して</span><span>100ptゲットしよう！</span></h2>
    <p class="code-label">キャンペーンコード</p>
    <div class="code-box">
      <code class="campaign-code">${CAMPAIGN_CODE}</code>
      <button class="copy-btn" id="copy-code">コピー</button>
    </div>
    <ol class="code-steps" aria-label="ポイントを受け取る手順">
      <li><span>1</span>コードをコピー</li>
      <li><span>2</span>100ptゲットする</li>
    </ol>
    <a class="cta cta-blue app-code-cta" href="https://app-clear.com/open?act=campaign_code">100ptゲットする</a>
    <p class="code-help">コピーしたコードを入力してください。</p>
    <p class="code-note">※ポイントの受け取りは1アカウントにつき1回までです</p>
    <button class="restart-link" id="restart-button">もう一度診断する</button>
  </section>`;
}

function uploadMarkup() {
  return `<section class="upload-inline" id="upload-section">
    <div class="upload-heading">
      <div><span class="flow-badge flow-badge-upload">シェア後はここ</span><h2>投稿できたらスクショをアップロード</h2></div>
    </div>
    <p class="upload-lead">SNSに投稿した画面のスクリーンショットを選択してください</p>
    <label class="file-drop" for="screenshot-input">
      <span>${selectedUpload ? "スクショを変更" : "スクショを選択"}</span>
      <input id="screenshot-input" type="file" accept="image/*" />
    </label>
    ${selectedUploadUrl ? `<div class="upload-preview"><img src="${selectedUploadUrl}" alt="選択した投稿スクリーンショットのプレビュー" /></div><div class="change-row"><button class="text-btn" id="change-image">画像を変更</button></div>` : ""}
    ${uploadError ? `<div class="error-box" role="alert">${escapeHtml(uploadError)}</div>` : ""}
    <button class="cta cta-blue upload-submit" id="upload-button" ${selectedUpload ? "" : "disabled"}>この画像をアップロードする</button>
    ${codeMarkup()}
  </section>`;
}

function renderResult() {
  const result = resultData();
  return `<section class="screen result-wrap${result.id === TYPE_IDS.LOYAL ? " result-loyal" : ""}" style="--accent:${result.accentColor};--accent-soft:${result.accentSoft};--accent-deep:${result.accentDeep}">
    ${topbar("name")}
    <header class="result-hero glass-card">
      <div class="result-heading"><img class="result-logo" src="${LOVE_REPORT_LOGO.src}" alt="恋愛通知表" width="${LOVE_REPORT_LOGO.width}" height="${LOVE_REPORT_LOGO.height}" fetchpriority="high" decoding="async" /></div>
      <p class="result-name"><span>${escapeHtml(state.name)}さん</span>の恋愛タイプは…</p>
      <div class="result-profile">
        <div class="result-character-wrap" style="--character-scale:${result.characterScale || 1}"><img class="result-character" src="${result.characterImage}" alt="${result.typeName}のリアちゃん" width="${result.characterWidth}" height="${result.characterHeight}" fetchpriority="high" decoding="async" /></div>
        <div class="result-copy"><div class="result-type-box"><h1 class="type-name">${typeNameMarkup(result)}</h1><p class="catch-copy">${result.catchCopy}</p></div></div>
      </div>
    </header>
    <section class="section-card result-sheet glass-card">
      <div class="report-header"><img class="report-title-logo" src="${LOVE_REPORT_LOGO.src}" alt="恋愛通知表" width="${LOVE_REPORT_LOGO.width}" height="${LOVE_REPORT_LOGO.height}" decoding="async" /><p class="student-name"><span>氏名</span><strong>${escapeHtml(state.name)}さん</strong></p></div>
      <div class="ratings" role="table" aria-label="恋愛通知表の5段階評価">${ratingsMarkup(result)}</div>
      <aside class="teacher-note"><div class="teacher-note-head"><img class="teacher-face" src="${TEACHER_IMAGE.src}" alt="リアちゃん先生" width="${TEACHER_IMAGE.width}" height="${TEACHER_IMAGE.height}" loading="lazy" decoding="async" /><h3>先生からのひとこと</h3></div><p class="teacher-text">${result.teacherComment}</p></aside>
      <div class="summary-inline"><h3><span>総評</span></h3><p class="summary-text">${result.summary}</p></div>
    </section>
    <section class="journey-card glass-card">
      ${rewardMarkup()}
      ${sharePanelMarkup()}
      ${uploadMarkup()}
    </section>
  </section>`;
}

function render() {
  const app = document.querySelector("#app");
  document.title = `${SCREEN_TITLES[state.screen]}｜Clear シェアラボ`;
  const views = { home: renderHome, quiz: renderQuiz, name: renderName, result: renderResult };
  app.innerHTML = (views[state.screen] || renderHome)();
  bindEvents();
  if (state.screen === "result") drawShareImage();
}

function bindEvents() {
  document.querySelector("#start-button")?.addEventListener("click", () => {
    preloadCharacters();
    state.questionIndex = 0;
    state.answers = [];
    state.resultId = null;
    state.sharePanelOpen = false;
    state.campaignUnlocked = false;
    setScreen("quiz");
  });
  document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => answerQuestion(Number(button.dataset.answer))));
  document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => navigateAction(button.dataset.go)));
  document.querySelector("#name-form")?.addEventListener("submit", submitName);
  document.querySelector("#other-share")?.addEventListener("click", shareToOtherApps);
  document.querySelector("#save-image")?.addEventListener("click", saveShareImage);
  document.querySelector("#copy-text")?.addEventListener("click", copyShareText);
  document.querySelector("#screenshot-input")?.addEventListener("change", handleFileSelection);
  document.querySelector("#change-image")?.addEventListener("click", () => document.querySelector("#screenshot-input")?.click());
  document.querySelector("#upload-button")?.addEventListener("click", uploadScreenshot);
  document.querySelector("#copy-code")?.addEventListener("click", copyCampaignCode);
  document.querySelector("#restart-button")?.addEventListener("click", resetDiagnosis);
}

function navigateAction(target) {
  if (target === "prev-question") {
    state.questionIndex = Math.max(0, state.questionIndex - 1);
    state.answers = state.answers.slice(0, state.questionIndex);
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

function handleFileSelection(event) {
  const file = event.target.files?.[0];
  uploadError = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    uploadError = "画像ファイルを選択してください。";
    selectedUpload = null;
    render();
    requestAnimationFrame(() => scrollToSection("#upload-section"));
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    uploadError = "画像サイズが大きすぎます。12MB以下の画像を選択してください。";
    selectedUpload = null;
    render();
    requestAnimationFrame(() => scrollToSection("#upload-section"));
    return;
  }
  if (selectedUploadUrl) URL.revokeObjectURL(selectedUploadUrl);
  selectedUpload = file;
  selectedUploadUrl = URL.createObjectURL(file);
  render();
  requestAnimationFrame(() => scrollToSection("#upload-section"));
}

async function uploadScreenshot() {
  if (!selectedUpload) {
    uploadError = "先にスクリーンショットを選択してください。";
    render();
    requestAnimationFrame(() => scrollToSection("#upload-section"));
    return;
  }
  const button = document.querySelector("#upload-button");
  button.disabled = true;
  button.innerHTML = `<span class="loading"><span class="spinner"></span>アップロード中…</span>`;
  uploadError = "";
  try {
    await mockUploadService(selectedUpload);
    state.campaignUnlocked = true;
    persistState();
    render();
    requestAnimationFrame(() => {
      scrollToSection("#campaign-code-section");
      document.querySelector("#campaign-code-section")?.focus({ preventScroll: true });
    });
  } catch (error) {
    uploadError = error.message || "アップロードできませんでした。もう一度お試しください。";
    render();
    requestAnimationFrame(() => scrollToSection("#upload-section"));
  }
}

function mockUploadService(file) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (!file || file.name.toLowerCase().includes("error")) reject(new Error("アップロードできませんでした。画像を確認して、もう一度お試しください。"));
    else resolve({ ok: true });
  }, 1100));
}

function shareText() {
  return SHARE_CONFIG.generalText(resultData());
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
  loadImage(HOME_BRAND_RIA_IMAGE.src).catch(() => imageCache.delete(HOME_BRAND_RIA_IMAGE.src));
  loadImage(PAPER_REPORT_IMAGE.src).catch(() => imageCache.delete(PAPER_REPORT_IMAGE.src));
  loadImage(PAPER_MESSAGE_IMAGE.src).catch(() => imageCache.delete(PAPER_MESSAGE_IMAGE.src));
  loadImage(POINT_COIN_IMAGE.src).catch(() => imageCache.delete(POINT_COIN_IMAGE.src));
  loadImage("./assets/lab-background.webp").catch(() => imageCache.delete("./assets/lab-background.webp"));
}

function scrollToSection(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke(); }
}

function fitText(ctx, text, maxWidth, startSize, weight = 900) {
  let size = startSize;
  do {
    ctx.font = `${weight} ${size}px "Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif`;
    size -= 2;
  } while (ctx.measureText(text).width > maxWidth && size > 28);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const chars = Array.from(text);
  const lines = [];
  let line = "";
  for (const char of chars) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = char;
      if (lines.length === maxLines - 1) break;
    } else line = test;
  }
  const consumed = lines.join("").length + line.length;
  if (consumed < chars.length) line += "…";
  lines.push(line);
  lines.forEach((row, index) => ctx.fillText(row, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
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

  try {
    const background = await loadImage("./assets/lab-background.webp");
    drawImageCover(ctx, background, 0, 0, 1080, 1080);
  } catch (_) {
    const fallback = ctx.createLinearGradient(0, 0, 1080, 1080);
    fallback.addColorStop(0, "#dff5ff");
    fallback.addColorStop(1, "#eff4ff");
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, 1080, 1080);
  }
  ctx.fillStyle = "rgba(240,249,255,.62)";
  ctx.fillRect(0, 0, 1080, 1080);

  ctx.shadowColor = "rgba(16,73,139,.2)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  roundRect(ctx, 38, 28, 1004, 1024, 38, "rgba(255,255,255,.93)", "rgba(105,169,230,.7)");
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  try {
    const reportPaper = await loadImage(PAPER_REPORT_IMAGE.src);
    ctx.save();
    ctx.globalAlpha = .26;
    drawImageCover(ctx, reportPaper, 41, 31, 998, 1018);
    ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,.58)";
    ctx.fillRect(41, 31, 998, 1018);
  } catch (_) {}

  try {
    const logo = await loadImage(LOVE_REPORT_LOGO.src);
    drawImageContain(ctx, logo, 170, 38, 740, 214);
  } catch (_) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#1766cb";
    ctx.font = '950 72px "Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif';
    ctx.fillText("恋愛通知表", 540, 130);
  }
  roundRect(ctx, 250, 270, 580, 54, 14, "rgba(248,252,255,.94)", "#9cc9ef");
  const studentLabel = "氏名";
  const studentDisplayName = `${state.name}さん`;
  const studentGap = 28;
  ctx.textAlign = "left";
  ctx.fillStyle = "#365d89";
  ctx.font = '800 20px "Yu Gothic", sans-serif';
  const studentLabelWidth = ctx.measureText(studentLabel).width;
  ctx.font = '900 26px "Yu Gothic", sans-serif';
  const studentNameWidth = ctx.measureText(studentDisplayName).width;
  const studentStartX = 540 - (studentLabelWidth + studentGap + studentNameWidth) / 2;
  ctx.font = '800 20px "Yu Gothic", sans-serif';
  ctx.fillText(studentLabel, studentStartX, 307);
  ctx.fillStyle = "#0a438f";
  ctx.font = '900 26px "Yu Gothic", sans-serif';
  ctx.fillText(studentDisplayName, studentStartX + studentLabelWidth + studentGap, 307);

  try {
    const character = await loadImage(result.characterImage);
    const characterBox = result.id === TYPE_IDS.LOYAL
      ? { x: 70, y: 370, width: 360, height: 246 }
      : { x: 58, y: 360, width: 398, height: 270 };
    ctx.save();
    ctx.shadowColor = "rgba(26,62,122,.18)";
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 8;
    drawImageContain(ctx, character, characterBox.x, characterBox.y, characterBox.width, characterBox.height);
    ctx.restore();
  } catch (_) {
    roundRect(ctx, 72, 365, 390, 255, 30, "#eef7ff", "#c0dcf5");
  }

  roundRect(ctx, 470, 360, 520, 148, 24, "rgba(255,249,252,.94)", "#efb5d5");
  ctx.textAlign = "center";
  ctx.fillStyle = result.accentDeep;
  fitText(ctx, result.typeName, 450, 48, 950);
  ctx.fillText(result.typeName, 730, 430);
  ctx.fillStyle = "#0a438f";
  ctx.font = '850 23px "Yu Gothic", sans-serif';
  wrapCanvasText(ctx, result.catchCopy, 730, 470, 445, 26, 2);

  roundRect(ctx, 470, 516, 520, 148, 22, "rgba(255,251,253,.96)", "#9abfe6");
  try {
    const teacher = await loadImage(TEACHER_IMAGE.src);
    drawImageContain(ctx, teacher, 848, 522, 136, 136);
  } catch (_) {}
  ctx.textAlign = "left";
  ctx.fillStyle = "#e33383";
  ctx.font = '900 23px "Yu Gothic", sans-serif';
  ctx.fillText("先生からのひとこと", 510, 559);
  ctx.fillStyle = "#113e7c";
  ctx.font = '750 18px "Yu Gothic", sans-serif';
  wrapCanvasText(ctx, result.teacherComment, 510, 596, 326, 25, Number.POSITIVE_INFINITY);

  ctx.fillStyle = "#0b4fa8";
  ctx.font = '900 24px "Yu Gothic", sans-serif';
  ctx.fillText("5段階評価", 82, 692);
  const tableX = 70;
  const tableY = 710;
  const tableWidth = 940;
  const rowHeight = 73;
  roundRect(ctx, tableX, tableY, tableWidth, rowHeight * 3, 18, "rgba(248,252,255,.97)", "#9bc6ed");
  ctx.strokeStyle = "#bdd9f3";
  ctx.lineWidth = 2;
  [1, 2].forEach((row) => {
    ctx.beginPath();
    ctx.moveTo(tableX, tableY + row * rowHeight);
    ctx.lineTo(tableX + tableWidth, tableY + row * rowHeight);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.moveTo(tableX + tableWidth / 2, tableY);
  ctx.lineTo(tableX + tableWidth / 2, tableY + rowHeight * 2);
  ctx.stroke();

  const entries = Object.entries(result.ratings);
  entries.forEach(([label, value], index) => {
    const isLast = index === 4;
    const column = index % 2;
    const row = Math.floor(index / 2);
    const cellX = isLast ? tableX : tableX + column * (tableWidth / 2);
    const cellWidth = isLast ? tableWidth : tableWidth / 2;
    const cellY = tableY + row * rowHeight;
    ctx.textAlign = "left";
    ctx.fillStyle = "#0a438f";
    ctx.font = '850 20px "Yu Gothic", sans-serif';
    ctx.fillText(label, cellX + 22, cellY + 45);
    const starStart = isLast ? cellX + 325 : cellX + 185;
    for (let star = 0; star < 5; star += 1) {
      drawVectorStar(ctx, starStart + star * 45, cellY + 36, 16, star < value);
    }
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#0a4ea8";
  ctx.font = '950 34px "Yu Gothic", sans-serif';
  ctx.fillText(HASHTAG, 540, 982);
  ctx.fillStyle = "#214c82";
  ctx.font = '850 27px "Yu Gothic", sans-serif';
  ctx.fillText("あなたは何タイプ？", 540, 1023);
  try {
    const brandLogo = await loadImage(CLEAR_SHARE_LAB_LOGO.src);
    drawImageContain(ctx, brandLogo, 790, 962, 240, 84);
  } catch (_) {}
  canvas.setAttribute("aria-busy", "false");
  if (loading) loading.hidden = true;
}

function canvasBlob() {
  const canvas = document.querySelector("#share-canvas");
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
}

async function shareToOtherApps() {
  const blob = await canvasBlob();
  const file = new File([blob], `clear-love-report-${resultData().id}.png`, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ title: "恋愛通知表", text: shareText(), url: SHARE_CONFIG.shareUrl, files: [file] });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: "恋愛通知表", text: shareText(), url: SHARE_CONFIG.shareUrl });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  const note = document.querySelector("#share-fallback-note");
  if (note) note.hidden = false;
  showToast("画像の保存かシェア文のコピーをご利用ください");
}

async function saveShareImage() {
  const blob = await canvasBlob();
  const file = new File([blob], `clear-love-report-${resultData().id}.png`, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ title: "恋愛通知表", files: [file] });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  downloadBlob(blob, `clear-love-report-${resultData().id}.png`);
  showToast("画像を保存しました");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function copyShareText() {
  return copyText(shareText(), "シェア文をコピーしました");
}

async function copyCampaignCode() {
  const copied = await copyText(CAMPAIGN_CODE, "キャンペーンコードをコピーしました");
  if (!copied) return;
  const button = document.querySelector("#copy-code");
  if (!button) return;
  clearTimeout(copyCodeResetTimer);
  button.textContent = "コピー済み ✓";
  button.classList.add("is-copied");
  copyCodeResetTimer = setTimeout(() => {
    if (!button.isConnected) return;
    button.textContent = "コピー";
    button.classList.remove("is-copied");
  }, 1600);
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
  const screen = event.state?.screen || location.hash.slice(1);
  const normalizedScreen = ["share", "upload", "code"].includes(screen) ? "result" : screen;
  if (SCREEN_TITLES[normalizedScreen]) {
    state.screen = normalizedScreen;
    if (["share", "upload", "code"].includes(screen)) state.sharePanelOpen = true;
    if (screen === "code") state.campaignUnlocked = true;
    persistState();
    render();
  }
});

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const tools = [
    {
      name: "get_diagnosis_state",
      title: "診断の状態を確認",
      description: "Clear 恋愛通知表の現在画面、回答済み数、診断結果を確認します。",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ screen: state.screen, answered: state.answers.length, totalQuestions: QUESTIONS.length, result: state.resultId ? RESULTS[state.resultId].typeName : null }),
    },
    {
      name: "start_diagnosis",
      title: "恋愛診断を開始",
      description: "恋愛通知表の診断を最初から開始し、最初の質問を表示します。",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => { state.questionIndex = 0; state.answers = []; state.resultId = null; setScreen("quiz"); return { screen: "quiz", question: 1, totalQuestions: 5 }; },
    },
    {
      name: "answer_current_question",
      title: "現在の質問に回答",
      description: "表示中の恋愛診断質問にA、B、Cのいずれかで回答します。",
      inputSchema: { type: "object", properties: { choice: { type: "string", enum: ["A", "B", "C"] } }, required: ["choice"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: ({ choice }) => {
        if (state.screen !== "quiz") throw new Error("診断質問画面を表示してから回答してください。");
        const index = ["A", "B", "C"].indexOf(choice);
        answerQuestion(index);
        return { accepted: true, question: state.questionIndex + 1, choice };
      },
    },
  ];
  tools.forEach((tool) => { try { void Promise.resolve(context.registerTool(tool)).catch(() => {}); } catch (_) {} });
}

if (!location.hash || ["#share", "#upload", "#code"].includes(location.hash)) history.replaceState({ screen: state.screen }, "", `#${state.screen}`);
if (["quiz", "name", "result"].includes(state.screen)) preloadCharacters();
render();
registerWebMCP();