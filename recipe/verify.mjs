import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const contentSource = readFileSync(new URL("./content.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const types = "ABCDEF".split("");
const appearances = { A: 5, B: 4, C: 5, D: 6, E: 4, F: 4 };
const mappings = ["ABCD", "DCEF", "ABDF", "BCDA", "AEDF", "ACEF", "BCDE"];

function content() {
  const context = vm.createContext({ window: {} });
  vm.runInContext(contentSource, context);
  return context.window.RECIPE_CONTENT;
}
const data = content();
assert.equal(data.questions.length, 7);
assert.equal(data.results.length, 6);
const finalCopy = {
  A: ["名物まかないプレート", "思いついたらすぐに試してみる", "思いついたことを、まず試してみる人。動きながら、自分に合うやり方を見つけます。", "まず試す力／形にする力", "やりたいことが増えたら、まず一つを最後までやってみて。", "思いついたことをすぐ試す行動力"],
  B: ["好き全部のせカレー", "気になったらすぐに詳しく調べる", "気になることを、自分で詳しく調べる人。知るほど興味が深まり、楽しみが広がります。", "好奇心／詳しく調べる力", "調べて分かったことを誰かと話すと、新しい発見につながるかも。", "気になることを掘り下げる好奇心"],
  C: ["ほっとさせるあったかスープ", "変化に気づいたらすぐに声をかける", "相手の希望や困りごとに気づける人。話を聞きながら、相手に合う方法を考えます。", "気づく力／相手の話を聞く力", "相手の希望を聞いたら、自分の希望も伝えてみて。", "相手の希望を確かめる気づかい"],
  D: ["先読みフルコース", "条件を確認してから動き出す", "時間や予算などを先に確認し、進め方を考える人。必要な準備を整えてから行動できます。", "見通す力／段取りを組む力", "予定を詰め込みすぎず、当日を楽しむ余裕も残してみて。", "条件を確かめて段取りを考える力"],
  E: ["逆転アレンジパスタ", "予定が変わったらすぐに切り替え", "予定どおりにいかないときも、今あるものを使って別の方法を考えられる人です。", "切り替える力／工夫する力", "うまくいった工夫は覚えておくと、次にも役立ちます。", "別の方法を見つける柔軟さ"],
  F: ["じっくり煮込みシチュー", "少しずつ、じっくり積み重ねる", "急がず、自分のペースで続ける人。少しずつ経験を重ね、できることを増やしていきます。", "自分のペースを守る力／続ける力", "ときどき振り返ると、続けてきたことに気づけます。", "自分のペースで続ける粘り強さ"],
};
const sealBreaks = {
  A: ["思いついたら", "すぐに", "試してみる"],
  B: ["気になったら", "すぐに", "詳しく調べる"],
  C: ["変化に気づいたら", "すぐに", "声をかける"],
  D: ["条件を", "確認してから", "動き出す"],
  E: ["予定が変わったら", "すぐに", "切り替え"],
  F: ["少しずつ、", "じっくり", "積み重ねる"],
};
for (const result of data.results) {
  assert.deepEqual([result.name, result.seal, result.description, result.ingredients, result.tip, result.hiddenFlavorText], finalCopy[result.type], `確定稿: ${result.type}`);
}
assert.deepEqual(Array.from(data.questions, (question) => Array.from(question.answers, (answer) => answer.type).join("")), mappings);
for (const type of types) {
  const count = data.questions.flatMap((question) => question.answers).filter((answer) => answer.type === type).length;
  assert.equal(count, appearances[type], `登場回数: ${type}`);
}

function expectedOrder(choices) {
  const selected = choices.map((choice, index) => mappings[index][choice]);
  const counts = Object.fromEntries(types.map((type) => [type, selected.filter((entry) => entry === type).length]));
  return [...types].sort((a, b) => counts[b] / appearances[b] - counts[a] / appearances[a]
    || counts[b] - counts[a]
    || selected.lastIndexOf(b) - selected.lastIndexOf(a)
    || a.localeCompare(b));
}

const examples = new Map();
const tieCases = { normalized: 0, latest: 0 };
for (let encoded = 0; encoded < 4 ** 7; encoded += 1) {
  let number = encoded;
  const choices = Array.from({ length: 7 }, () => {
    const choice = number % 4;
    number = Math.floor(number / 4);
    return choice;
  });
  const expected = expectedOrder(choices);
  const actual = Array.from(data.rankTypes(choices));
  assert.deepEqual(actual, expected, `回答: ${choices.join("")}`);
  assert.equal(data.resolveResult(choices), data.results.find((result) => result.type === expected[0]).id);
  assert.equal(data.resolveHiddenFlavor(choices), data.results.find((result) => result.type === expected[1]).id);
  assert.notEqual(expected[0], expected[1]);
  if (!examples.has(expected[0])) examples.set(expected[0], choices);
  const picked = choices.map((choice, index) => mappings[index][choice]);
  const firstCount = picked.filter((type) => type === expected[0]).length;
  const secondCount = picked.filter((type) => type === expected[1]).length;
  if (firstCount / appearances[expected[0]] === secondCount / appearances[expected[1]]) {
    if (firstCount !== secondCount) tieCases.normalized += 1;
    else tieCases.latest += 1;
  }
}
assert.equal(examples.size, 6, "6結果すべてに到達できる");
assert.ok(tieCases.normalized > 0);
assert.ok(tieCases.latest > 0);

function makeApp(urlText, { withCanvas = false, canShareFiles = true, secureContext = true, userAgent = "", sealFontScale = 1, blobFailure = false, imageFailure = false, shareFailure = false } = {}) {
  const answerButtons = Array.from({ length: 4 }, (_, choice) => ({
    dataset: { action: "answer", choice: String(choice) },
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    disabled: false,
  }));
  const app = { innerHTML: "", addEventListener(_name, handler) { this.clickHandler = handler; }, querySelectorAll() { return answerButtons; } };
  const timers = new Map();
  let nextTimer = 0;
  const classes = new Set();
  const drawnText = [];
  const drawing = {
    font: "16px sans-serif",
    beginPath() {}, moveTo() {}, lineTo() {}, arcTo() {}, closePath() {}, rect() {}, clip() {}, save() {}, restore() {},
    fill() {}, stroke() {}, fillRect() {}, strokeRect() {}, arc() {}, setLineDash() {}, strokeText() {}, drawImage(...args) { this.imageCount += 1; this.lastImageDraw = args; },
    imageCount: 0,
    fillText(text, x, y) { drawnText.push({ text, x, y, fillStyle: this.fillStyle, textAlign: this.textAlign, textBaseline: this.textBaseline }); },
    measureText(text) {
      const size = Number(/(\d+)px/.exec(this.font)?.[1] || 16);
      return { width: Array.from(text).reduce((width, char) => width + (/[\u0020-\u007e]/.test(char) ? .58 : 1) * size, 0) * (this.font.startsWith("800 ") ? sealFontScale : 1) };
    },
  };
  const saveButton = { disabled: true };
  const shareButton = { disabled: true };
  const savePreviewButton = { disabled: true };
  const savePreviewImage = { src: "" };
  const savePreview = { hidden: true, scrollIntoView() {} };
  const toast = { textContent: "", classList: { add() {}, remove() {} } };
  const shareFeedback = { textContent: "", hidden: true };
  const errors = [];
  let sharedData = null;
  let downloaded = null;
  const canvas = {
    isConnected: true,
    getContext() { return drawing; },
    setAttribute() {},
    toBlob(callback) { callback(blobFailure ? null : new Blob(["card"], { type: "image/png" })); },
  };
  const document = {
    title: "",
    body: { classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } }, appendChild() {} },
    fonts: { load: async () => [], ready: Promise.resolve() },
    createElement(tag) {
      assert.equal(tag, "a");
      return { href: "", download: "", click() { downloaded = { href: this.href, filename: this.download }; }, remove() {} };
    },
    querySelector(selector) {
      return selector === "#app" ? app
        : withCanvas && selector === "#recipe-card" ? canvas
        : withCanvas && selector === '[data-action="save"]' ? saveButton
        : withCanvas && selector === '[data-action="share-file"]' ? shareButton
        : withCanvas && selector === '[data-action="save-preview"]' ? savePreviewButton
        : withCanvas && selector === "#save-preview-image" ? savePreviewImage
        : withCanvas && selector === "#save-preview" ? savePreview
        : withCanvas && selector === "#share-feedback" ? shareFeedback
        : selector === "#toast" ? toast
        : null;
    },
  };
  const location = {};
  function updateLocation(next) {
    const url = new URL(next, location.href || urlText);
    for (const key of ["href", "protocol", "hostname", "hash", "search"]) location[key] = url[key];
  }
  updateLocation(urlText);
  const storage = new Map();
  const history = {
    pushState(_a, _b, url) { updateLocation(url); },
    replaceState(_a, _b, url) { updateLocation(url); },
  };
  const window = { isSecureContext: secureContext, scrollY: 0, addEventListener() {}, scrollTo() {} };
  class Image {
    naturalWidth = 1402;
    naturalHeight = 1122;
    set src(_value) { queueMicrotask(() => imageFailure ? this.onerror?.() : this.onload?.()); }
  }
  const context = vm.createContext({
    window, document, location, history, localStorage: {
      getItem(key) { return storage.get(key) || null; },
      setItem(key, value) { storage.set(key, value); },
    },
    URL, URLSearchParams, Blob, File, Image, console: { error(error) { errors.push(error); } },
    navigator: { userAgent, canShare({ files }) { return canShareFiles && files.length === 1; }, async share(data) { if (shareFailure) throw new Error("共有に失敗しました"); sharedData = data; } },
    setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    requestAnimationFrame(callback) { callback(); },
  });
  vm.runInContext(contentSource, context);
  vm.runInContext(appSource, context);
  async function click(action, other = {}) {
    const control = action === "answer" ? answerButtons[Number(other.choice)] : { dataset: { action, ...other } };
    await app.clickHandler({ target: { closest() { return control; } } });
  }
  function advanceAnswer() {
    const [id, callback] = Array.from(timers.entries()).at(-1) || [];
    assert.ok(callback, "回答後の自動遷移が予約される");
    timers.delete(id);
    callback();
  }
  return { app, location, document, click, advanceAnswer, answerButtons, window, drawing, drawnText, saveButton, shareButton, savePreviewButton, savePreview, shareFeedback, toast, errors, get sharedData() { return sharedData; }, get downloaded() { return downloaded; } };
}

for (const [type, choices] of examples) {
  const site = makeApp("file:///recipe/index.html");
  assert.match(site.app.innerHTML, /data-action="start"/);
  assert.doesNotMatch(site.app.innerHTML, /確定版の設問と結果原稿を準備中/);
  await site.click("start");
  for (let index = 0; index < 7; index += 1) {
    assert.equal(site.location.hash, `#q-${index + 1}`);
    const displayedQuestion = site.app.innerHTML.match(/<h1 class="question-text">([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g, "");
    assert.equal(displayedQuestion, data.questions[index].text, "設問の文言を保つ");
    assert.doesNotMatch(site.app.innerHTML, /class="question-number"/, "設問枠内の第N問を表示しない");
    assert.doesNotMatch(site.app.innerHTML, /class="progress-dots"/, "丸と線の進捗バーを表示しない");
    assert.ok(site.app.innerHTML.includes(`class="quiz-progress-text">${index + 1}/7</p>`), "進捗のN/7を表示する");
    assert.doesNotMatch(site.app.innerHTML, /data-action="next"/);
    assert.match(site.app.innerHTML, /class="kitchen-props"/);
    assert.match(site.app.innerHTML, /class="cooking-utensil"/);
    for (const answer of data.questions[index].answers) assert.ok(site.app.innerHTML.includes(answer.text));
    await site.click("answer", { choice: String(choices[index]) });
    assert.equal(site.answerButtons[choices[index]].attributes["aria-pressed"], "true");
    await site.click("answer", { choice: String((choices[index] + 1) % 4) });
    assert.equal(site.answerButtons[choices[index]].attributes["aria-pressed"], "true", "連打で回答を変えない");
    site.advanceAnswer();
  }
  assert.equal(site.location.hash, "#result");
  await site.click("back", { target: "q-7" });
  assert.equal(site.location.hash, "#q-7");
  assert.match(site.app.innerHTML, /aria-pressed="true"/, "前の設問に戻っても回答が残る");
  await site.click("answer", { choice: String(choices[6]) });
  site.advanceAnswer();
  assert.equal(site.location.hash, "#result");
  const result = data.results.find((entry) => entry.type === type);
  const flavor = data.results.find((entry) => entry.id === data.resolveHiddenFlavor(choices));
  const renderedText = site.app.innerHTML.replace(/<[^>]*>/g, "");
  for (const copy of [result.name, result.ingredients, result.description, result.tip, flavor.hiddenFlavorText]) {
    assert.ok(renderedText.includes(copy) || site.app.innerHTML.includes(copy), `結果画面の内容: ${type} ${copy}`);
  }
  assert.ok(site.app.innerHTML.includes(result.image), `料理画像: ${type}`);
  assert.ok(site.app.innerHTML.includes(`aria-label="${result.seal}"`), `丸い欄の文言: ${type}`);
  assert.ok(site.app.innerHTML.includes(`<span class="result-seal-text">${sealBreaks[type].join("<br>")}</span>`), `丸い欄の3行: ${type}`);
  assert.match(site.app.innerHTML, /<div class="result-seal(?: result-seal-long)?"/, `丸い欄: ${type}`);
  assert.match(site.app.innerHTML, /結果の見方/, `結果の見方: ${type}`);
  assert.doesNotMatch(site.app.innerHTML, /result-seal-divider/, `波線なし: ${type}`);
  await site.click("share-page");
  assert.equal(site.location.hash, "#share");
  assert.match(site.app.innerHTML, /width="1200" height="1500"/);
  assert.doesNotMatch(site.app.innerHTML, /結果の見方/, `カードに説明欄を入れない: ${type}`);
  assert.match(site.app.innerHTML, /#CLEARシェアラボ/);
  assert.match(site.app.innerHTML, /運営側が確認後、100ptを加算/);
  assert.match(site.app.innerHTML, /スクリーンショットは切り取らないでください/);
  assert.match(site.app.innerHTML, /投稿・送信したアカウント名/);
}

for (const type of types) {
  const alternate = types.find((candidate) => candidate !== type);
  const preview = makeApp(`file:///recipe/index.html?preview=result-${type}&flavor=${alternate}`);
  assert.ok(preview.app.innerHTML.includes(data.results.find((entry) => entry.type === type).name));
  assert.ok(preview.app.innerHTML.includes(data.results.find((entry) => entry.type === alternate).hiddenFlavorText));
  const card = makeApp(`file:///recipe/index.html?preview=share-${type}&flavor=${alternate}`, { withCanvas: true });
  assert.match(card.app.innerHTML, /id="recipe-card"/);
  assert.match(card.app.innerHTML, /data-action="save" disabled>画像を保存する<\/button>/);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(card.saveButton.disabled, false, `保存ボタン: ${type}`);
  assert.equal(card.shareButton.disabled, false, `共有ボタン: ${type}`);
  assert.equal(card.savePreviewButton.disabled, false, `長押し保存ボタン: ${type}`);
  const shareLocation = card.location.href;
  await card.click("save");
  assert.equal(card.location.href, shareLocation, `保存で画面を移動しない: ${type}`);
  assert.equal(card.downloaded.filename, `clear-recipe-${data.results.find((entry) => entry.type === type).id}.png`, `PNGをダウンロード: ${type}`);
  await card.click("share-file");
  assert.equal(card.sharedData.files[0].type, "image/png", `保存メニューにPNGを渡す: ${type}`);
  const fallback = makeApp(`file:///recipe/index.html?preview=share-${type}`, { withCanvas: true, canShareFiles: false, userAgent: "iPhone" });
  await new Promise((resolve) => setImmediate(resolve));
  const fallbackLocation = fallback.location.href;
  await fallback.click("save");
  assert.equal(fallback.location.href, fallbackLocation, `iPhone代替保存で画面を移動しない: ${type}`);
  assert.equal(fallback.savePreview.hidden, false, `iPhone代替保存で画像を表示: ${type}`);
  await fallback.click("close-save-preview");
  assert.equal(fallback.savePreview.hidden, true, `代替保存画像を閉じる: ${type}`);
  await fallback.click("share-file");
  assert.match(fallback.shareFeedback.textContent, /画像を保存する/, `共有非対応時に保存方法を案内: ${type}`);
  await fallback.click("save-preview");
  assert.equal(fallback.savePreview.hidden, false, `共有非対応時も画像保存へ進める: ${type}`);
  assert.equal(card.drawing.imageCount, 7, `料理画像・最新版リアちゃん・タイトル・背景: ${type}`);
  const text = card.drawnText.map((entry) => entry.text).join("");
  const result = data.results.find((entry) => entry.type === type);
  const flavor = data.results.find((entry) => entry.type === alternate);
  for (const copy of [result.name, result.ingredients, result.description, result.tip, result.seal, flavor.hiddenFlavorText]) {
    assert.ok(text.includes(copy), `カードの文字: ${type} ${copy}`);
  }
  const summaryBreaks = {
    A: ["思いついたことを、まず試してみる人。", "動きながら、自分に合うやり方を見つけます。"],
    B: ["気になることを、自分で詳しく調べる人。", "知るほど興味が深まり、楽しみが広がります。"],
    C: ["相手の希望や困りごとに気づける人。", "話を聞きながら、相手に合う方法を考えます。"],
    D: ["時間や予算などを先に確認し、進め方を考える人。", "必要な準備を整えてから行動できます。"],
    E: ["予定どおりにいかないときも、今あるものを使って", "別の方法を考えられる人です。"],
    F: ["急がず、自分のペースで続ける人。", "少しずつ経験を重ね、できることを増やしていきます。"],
  }[type];
  const summaryLines = card.drawnText.filter(({ x, y }) => x === 112 && y >= 1000 && y <= 1090);
  assert.deepEqual(summaryLines.map(({ text }) => text), summaryBreaks, `総評の2行と改行位置: ${type}`);
  assert.equal(summaryLines[0].y, 1014, `総評本文の上余白: ${type}`);
  assert.ok(summaryLines[1].y < 1080, `総評本文の下余白: ${type}`);
  assert.equal(card.drawing.lastImageDraw[1], 866, `リアちゃんを赤線の位置へ移動: ${type}`);
  assert.equal(card.drawing.lastImageDraw[3], 254, `リアちゃんの大きさを維持: ${type}`);
  for (const [label, x, y] of [["総評", 166, 944], ["主成分", 126.5, 1163.5]]) {
    const drawn = card.drawnText.find((entry) => entry.text === label);
    assert.ok(drawn && drawn.x === x && drawn.y === y && drawn.textAlign === "center" && drawn.textBaseline === "middle", `赤いラベル内の中央配置: ${type} ${label}`);
  }
  const ingredientLines = card.drawnText.filter(({ x, y }) => x === 397.5 && y >= 1170 && y <= 1225);
  assert.equal(ingredientLines.map(({ text }) => text).join(""), result.ingredients, `主成分の本文を中央配置: ${type}`);
  assert.ok(ingredientLines.every(({ y, textAlign, textBaseline }) => y === 1208 && textAlign === "center" && textBaseline === "middle"), `主成分の中央揃え: ${type}`);
  const tipLines = card.drawnText.filter(({ x, y }) => x === 397.5 && y >= 1320 && y <= 1410);
  assert.equal(tipLines.length, 2, `おいしくなるコツの2行: ${type}`);
  assert.equal(tipLines.map(({ text }) => text).join(""), result.tip, `おいしくなるコツの文言: ${type}`);
  assert.ok(tipLines.every(({ textAlign, textBaseline }) => textAlign === "center" && textBaseline === "middle"), `おいしくなるコツの中央揃え: ${type}`);
  assert.ok(tipLines[1].y - tipLines[0].y >= 32.5 && tipLines[0].y >= 1340 && tipLines[1].y < 1400, `おいしくなるコツの行間と上下余白: ${type}`);
  assert.ok(card.drawnText.some(({ text, x, y }) => text === "隠し味" && x === 805 && y === 1175), `隠し味の見出し位置: ${type}`);
  const flavorLines = card.drawnText.filter(({ x, y }) => x === 968.5 && y >= 1200 && y <= 1302);
  assert.equal(flavorLines.map(({ text }) => text).join(""), flavor.hiddenFlavorText, `隠し味の本文: ${type}`);
  assert.ok(flavorLines.length <= 2 && flavorLines.every(({ text }) => Array.from(text).length > 1), `隠し味の一文字改行なし: ${type}`);
  assert.equal(flavorLines.reduce((sum, { y }) => sum + y, 0) / flavorLines.length, 1233, `隠し味の縦中央: ${type}`);
  assert.equal(card.drawnText.find(({ text }) => text === "#CLEARシェアラボ")?.fillStyle, "#082856", `ハッシュタグの色: ${type}`);
  const finalSealLines = card.drawnText.slice(-3);
  assert.deepEqual(finalSealLines.map(({ text }) => text), sealBreaks[type], `丸い欄を指定の3行で最後に描画: ${type}`);
  assert.deepEqual(finalSealLines.map(({ y }) => y), [350, 385, 420], `丸い欄を縦中央に配置: ${type}`);
  assert.ok(finalSealLines.every(({ x, textAlign, textBaseline }) => x === 1031 && textAlign === "center" && textBaseline === "middle"), `丸い欄を横中央に配置: ${type}`);
  assert.ok(card.drawnText.every(({ x, y }) => x >= 0 && x <= 1200 && y >= 0 && y <= 1500));
}
for (const flavorType of types) {
  const resultType = flavorType === "A" ? "B" : "A";
  const card = makeApp(`file:///recipe/index.html?preview=share-${resultType}&flavor=${flavorType}`, { withCanvas: true });
  await new Promise((resolve) => setImmediate(resolve));
  const flavorLines = card.drawnText.filter(({ x, y }) => x === 968.5 && y >= 1200 && y <= 1302);
  assert.equal(flavorLines.map(({ text }) => text).join(""), data.results.find(({ type }) => type === flavorType).hiddenFlavorText, `隠し味6種類: ${flavorType}`);
  assert.ok(flavorLines.length <= 2 && flavorLines.every(({ text }) => Array.from(text).length > 1), `隠し味6種類の一文字改行なし: ${flavorType}`);
  assert.equal(flavorLines.reduce((sum, { y }) => sum + y, 0) / flavorLines.length, 1233, `隠し味6種類の縦中央: ${flavorType}`);
}
for (const type of types) {
  const card = makeApp(`file:///recipe/index.html?preview=share-${type}`, { withCanvas: true, sealFontScale: 1.15 });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(card.shareButton.disabled, false, `幅が広い日本語フォントでもカードを生成: ${type}`);
  assert.deepEqual(card.drawnText.slice(-3).map(({ text }) => text), sealBreaks[type], `幅が広い日本語フォントでも丸い欄を描画: ${type}`);
}
for (const [failure, expectedError] of [["imageFailure", "画像を読み込めません"], ["blobFailure", "カード画像のPNG書き出しに失敗しました"]]) {
  const failed = makeApp("file:///recipe/index.html?preview=share-C", { withCanvas: true, [failure]: true });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(failed.shareButton.disabled, true, `${failure}: 共有を有効にしない`);
  assert.equal(failed.saveButton.disabled, true, `${failure}: 保存を有効にしない`);
  assert.equal(failed.toast.textContent, "カード画像を作成できませんでした", `${failure}: エラーを案内する`);
  assert.ok(failed.errors.some((error) => String(error.message).includes(expectedError)), `${failure}: 実際の例外を記録する`);
}
const failedShare = makeApp("file:///recipe/index.html?preview=share-C", { withCanvas: true, userAgent: "iPhone", shareFailure: true });
await new Promise((resolve) => setImmediate(resolve));
await failedShare.click("share-file");
assert.equal(failedShare.shareButton.disabled, false, "共有APIの失敗後もカードを利用できる");
assert.equal(failedShare.saveButton.disabled, false, "共有APIの失敗後も保存できる");
assert.match(failedShare.shareFeedback.textContent, /画像付き共有を開けませんでした（Error）.*画像を保存する/, "共有APIの失敗時は保存を案内する");
await failedShare.click("save");
assert.equal(failedShare.savePreview.hidden, false, "共有APIの失敗後、iPhone向け長押し保存を表示する");
const insecureShare = makeApp("http://localhost/recipe/index.html?preview=share-C", { withCanvas: true, secureContext: false, userAgent: "iPhone" });
await new Promise((resolve) => setImmediate(resolve));
await insecureShare.click("share-file");
assert.match(insecureShare.shareFeedback.textContent, /HTTP接続.*画像を保存する/, "安全でない接続では保存方法をすぐ案内する");
assert.equal(insecureShare.sharedData, null, "安全でない接続では共有APIを呼ばない");
for (let index = 1; index <= 7; index += 1) {
  const preview = makeApp(`file:///recipe/index.html?preview=q-${index}`);
  const displayedQuestion = preview.app.innerHTML.match(/<h1 class="question-text">([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g, "");
  assert.equal(displayedQuestion, data.questions[index - 1].text);
}
const publicSite = makeApp("https://clear-official.github.io/clear-share-lab/recipe/?preview=result-A");
assert.match(publicSite.app.innerHTML, /data-action="start"/);
assert.doesNotMatch(publicSite.app.innerHTML, /あなたの隠しレシピは/);
const home = makeApp("file:///recipe/index.html?preview=home");
assert.match(home.app.innerHTML, /class="home-count">－全7問－<\/p>/);

console.log("OK: 16,384通りの判定、6結果の画面遷移とカード描画、7問と結果・カードのローカルプレビューを確認");
