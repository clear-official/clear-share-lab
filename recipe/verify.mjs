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

function makeApp(urlText, { withCanvas = false } = {}) {
  const app = { innerHTML: "", addEventListener(_name, handler) { this.clickHandler = handler; } };
  const classes = new Set();
  const drawnText = [];
  const drawing = {
    font: "16px sans-serif",
    beginPath() {}, moveTo() {}, lineTo() {}, arcTo() {}, closePath() {},
    fill() {}, stroke() {}, fillRect() {}, arc() {}, setLineDash() {}, drawImage() { this.imageCount += 1; },
    imageCount: 0,
    fillText(text, x, y) { drawnText.push({ text, x, y }); },
    measureText(text) {
      const size = Number(/(\d+)px/.exec(this.font)?.[1] || 16);
      return { width: Array.from(text).reduce((width, char) => width + (/[\u0020-\u007e]/.test(char) ? .58 : 1) * size, 0) };
    },
  };
  const saveButton = { disabled: true };
  const shareButton = { disabled: true };
  const openCard = { hidden: true, href: "" };
  const canvas = {
    isConnected: true,
    getContext() { return drawing; },
    setAttribute() {},
    toBlob(callback) { callback(new Blob(["card"], { type: "image/png" })); },
  };
  const document = {
    title: "",
    body: { classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } } },
    fonts: { ready: Promise.resolve() },
    querySelector(selector) {
      return selector === "#app" ? app
        : withCanvas && selector === "#recipe-card" ? canvas
        : withCanvas && selector === '[data-action="save"]' ? saveButton
        : withCanvas && selector === '[data-action="share-file"]' ? shareButton
        : withCanvas && selector === "#open-card" ? openCard
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
  const window = { addEventListener() {}, scrollTo() {} };
  class Image {
    naturalWidth = 1402;
    naturalHeight = 1122;
    set src(_value) { queueMicrotask(() => this.onload?.()); }
  }
  const context = vm.createContext({
    window, document, location, history, localStorage: {
      getItem(key) { return storage.get(key) || null; },
      setItem(key, value) { storage.set(key, value); },
    },
    URL, URLSearchParams, Blob, Image, console, setTimeout, clearTimeout,
  });
  vm.runInContext(contentSource, context);
  vm.runInContext(appSource, context);
  async function click(action, other = {}) {
    await app.clickHandler({ target: { closest() { return { dataset: { action, ...other } }; } } });
  }
  return { app, location, document, click, window, drawing, drawnText, saveButton, shareButton };
}

for (const [type, choices] of examples) {
  const site = makeApp("file:///recipe/index.html");
  assert.match(site.app.innerHTML, /data-action="start"/);
  assert.doesNotMatch(site.app.innerHTML, /確定版の設問と結果原稿を準備中/);
  await site.click("start");
  for (let index = 0; index < 7; index += 1) {
    assert.equal(site.location.hash, `#q-${index + 1}`);
    assert.ok(site.app.innerHTML.includes(data.questions[index].text));
    for (const answer of data.questions[index].answers) assert.ok(site.app.innerHTML.includes(answer.text));
    await site.click("answer", { choice: String(choices[index]) });
    assert.match(site.app.innerHTML, /aria-pressed="true"/);
    await site.click("next");
  }
  assert.equal(site.location.hash, "#result");
  const result = data.results.find((entry) => entry.type === type);
  const flavor = data.results.find((entry) => entry.id === data.resolveHiddenFlavor(choices));
  for (const copy of [result.name, result.image, result.ingredients, result.description, result.tip, flavor.hiddenFlavorText]) {
    assert.ok(site.app.innerHTML.includes(copy), `結果画面の内容: ${type} ${copy}`);
  }
  await site.click("share-page");
  assert.equal(site.location.hash, "#share");
  assert.match(site.app.innerHTML, /width="1200" height="1500"/);
  assert.match(site.app.innerHTML, /#CLEARシェアラボ/);
  assert.match(site.app.innerHTML, /運営側が確認後、100ptを加算/);
}

for (const type of types) {
  const alternate = types.find((candidate) => candidate !== type);
  const preview = makeApp(`file:///recipe/index.html?preview=result-${type}&flavor=${alternate}`);
  assert.ok(preview.app.innerHTML.includes(data.results.find((entry) => entry.type === type).name));
  assert.ok(preview.app.innerHTML.includes(data.results.find((entry) => entry.type === alternate).hiddenFlavorText));
  const card = makeApp(`file:///recipe/index.html?preview=share-${type}&flavor=${alternate}`, { withCanvas: true });
  assert.match(card.app.innerHTML, /id="recipe-card"/);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(card.saveButton.disabled, false, `保存ボタン: ${type}`);
  assert.equal(card.shareButton.disabled, false, `共有ボタン: ${type}`);
  assert.equal(card.drawing.imageCount, 1, `料理画像: ${type}`);
  const text = card.drawnText.map((entry) => entry.text).join("");
  const result = data.results.find((entry) => entry.type === type);
  const flavor = data.results.find((entry) => entry.type === alternate);
  for (const copy of [result.name, result.description, result.sealTop, result.sealBottom, flavor.hiddenFlavorText]) {
    assert.ok(text.includes(copy), `カードの文字: ${type} ${copy}`);
  }
  assert.ok(card.drawnText.every(({ x, y }) => x >= 0 && x <= 1200 && y >= 0 && y <= 1500));
}
for (let index = 1; index <= 7; index += 1) {
  const preview = makeApp(`file:///recipe/index.html?preview=q-${index}`);
  assert.ok(preview.app.innerHTML.includes(data.questions[index - 1].text));
}
const publicSite = makeApp("https://clear-official.github.io/clear-share-lab/recipe/?preview=result-A");
assert.match(publicSite.app.innerHTML, /data-action="start"/);
assert.doesNotMatch(publicSite.app.innerHTML, /あなたの隠しレシピは/);

console.log("OK: 16,384通りの判定、6結果の画面遷移とカード描画、7問と結果・カードのローカルプレビューを確認");
