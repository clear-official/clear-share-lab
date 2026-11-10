import { traits } from './data.js';

const portraits = {
  action: { file: 'ria-action.png', crop: [216, 192, 632, 1116] },
  curiosity: { file: 'ria-curiosity.png', crop: [164, 200, 664, 1112] },
  empathy: { file: 'ria-empathy.png', crop: [144, 192, 692, 1140] },
  idea: { file: 'ria-idea.png', crop: [204, 196, 624, 1108] },
  steady: { file: 'ria-steady.png', crop: [212, 188, 604, 1132] },
  observe: { file: 'ria-observe.png', crop: [116, 196, 700, 1124] }
};

const shardArt = {
  action: 'shard-action.png', curiosity: 'shard-curiosity.png',
  empathy: 'shard-empathy.png', idea: 'shard-idea.png', steady: 'shard-steady.png'
};

const catchLines = {
  action: ['あなたの一歩が、', '物語を動かす。'],
  curiosity: ['「気になる」の先に、', '宝物がある。'],
  empathy: ['そのやさしさが、', '仲間の力になる。'],
  idea: ['見方を変えて、', '道をひらく。'],
  steady: ['続けた時間が、', 'あなたの力になる。'],
  observe: ['小さな気づきで、', '進む道を整える。']
};
const skillLines = {
  action: ['迷って止まった場面に、', '動き出すきっかけをつくる。'],
  curiosity: ['何気ない毎日から、', 'まだ知らない楽しみを見つける。'],
  empathy: ['相手の気持ちを受け止め、', 'ほっと話せる空気をつくる。'],
  idea: ['行き詰まったときも、', '別の角度から突破口を見つける。'],
  steady: ['一度では届かない目標も、', '少しずつ形にしていく。'],
  observe: ['状況の変化に気づき、', 'つまずく前に進み方を整える。']
};

const imageCache = new Map();
function image(name) {
  if (!imageCache.has(name)) imageCache.set(name, new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`画像を読み込めません: ${name}`));
    img.src = `./assets/${name}`;
  }));
  return imageCache.get(name);
}

function stepShape(ctx, x, y, w, h, s) {
  ctx.beginPath();
  ctx.moveTo(x + s * 2, y);
  ctx.lineTo(x + w - s * 2, y);
  ctx.lineTo(x + w - s * 2, y + s);
  ctx.lineTo(x + w - s, y + s);
  ctx.lineTo(x + w - s, y + s * 2);
  ctx.lineTo(x + w, y + s * 2);
  ctx.lineTo(x + w, y + h - s * 2);
  ctx.lineTo(x + w - s, y + h - s * 2);
  ctx.lineTo(x + w - s, y + h - s);
  ctx.lineTo(x + w - s * 2, y + h - s);
  ctx.lineTo(x + w - s * 2, y + h);
  ctx.lineTo(x + s * 2, y + h);
  ctx.lineTo(x + s * 2, y + h - s);
  ctx.lineTo(x + s, y + h - s);
  ctx.lineTo(x + s, y + h - s * 2);
  ctx.lineTo(x, y + h - s * 2);
  ctx.lineTo(x, y + s * 2);
  ctx.lineTo(x + s, y + s * 2);
  ctx.lineTo(x + s, y + s);
  ctx.lineTo(x + s * 2, y + s);
  ctx.closePath();
}

function stepWindow(ctx, x, y, w, h, colors = {}) {
  const { dark = '#061128', rim = '#66dce7', face = '#0b2447' } = colors;
  for (const [inset, fill] of [[0, dark], [8, rim], [14, face]]) {
    ctx.fillStyle = fill;
    stepShape(ctx, x + inset, y + inset, w - inset * 2, h - inset * 2, 8);
    ctx.fill();
  }
}

function brickwork(ctx, x, y, w, h) {
  ctx.fillStyle = '#0a1b3a'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#18345b';
  for (let row = 0; row < h / 30; row++) {
    const offset = row % 2 ? -35 : 0;
    for (let col = offset; col < w; col += 94) {
      if ((row + Math.floor(col / 94)) % 3 === 0) ctx.fillRect(x + col, y + row * 30, 78, 24);
    }
  }
}

function pixelRing(ctx, cx, cy, radius, color, square = 9) {
  ctx.fillStyle = color;
  const count = Math.round(radius * .7);
  for (let i = 0; i < count; i++) {
    const angle = i * Math.PI * 2 / count;
    const x = Math.round((cx + Math.cos(angle) * radius) / 6) * 6;
    const y = Math.round((cy + Math.sin(angle) * radius) / 6) * 6;
    ctx.fillRect(x, y, square, square);
  }
}

function magicCircle(ctx, color) {
  const cx = 272, cy = 410;
  pixelRing(ctx, cx, cy, 208, color, 9);
  pixelRing(ctx, cx, cy, 180, '#417f9e', 7);
  ctx.strokeStyle = color; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(cx - 132, cy); ctx.lineTo(cx + 132, cy);
  ctx.moveTo(cx, cy - 132); ctx.lineTo(cx, cy + 132); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const px = Math.round((cx + Math.cos(a) * 148) / 6) * 6;
    const py = Math.round((cy + Math.sin(a) * 148) / 6) * 6;
    ctx.fillStyle = '#b8f8f4'; ctx.fillRect(px - 10, py - 10, 20, 20);
    ctx.fillStyle = '#0b2749'; ctx.fillRect(px - 5, py - 5, 10, 10);
  }
  ctx.strokeStyle = '#61b7cc'; ctx.lineWidth = 5;
  const r = 128; ctx.beginPath();
  for (let i = 0; i <= 6; i++) {
    const angle = -Math.PI / 2 + i * Math.PI * 2 / 6;
    const x = Math.round((cx + Math.cos(angle) * r) / 6) * 6;
    const y = Math.round((cy + Math.sin(angle) * r) / 6) * 6;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function centeredLines(ctx, lines, original, x, y, maxWidth, font, lineHeight) {
  if (lines.join('') !== original) throw new Error(`カード文面が確定済みデータと一致しません: ${original}`);
  ctx.font = font;
  ctx.textAlign = 'center';
  lines.forEach((line, i) => {
    if (ctx.measureText(line).width > maxWidth) throw new Error(`カード内の文章が収まりません: ${line}`);
    ctx.fillText(line, x, y + lineHeight * i);
  });
}

function gem(ctx, x, y, color) {
  ctx.fillStyle = '#061328'; ctx.fillRect(x - 8, y - 27, 48, 58);
  ctx.fillStyle = color;
  const points = [[16,-24],[34,-7],[34,9],[16,28],[-2,9],[-2,-7]];
  ctx.beginPath(); points.forEach(([px,py],i) => i ? ctx.lineTo(x+px,y+py) : ctx.moveTo(x+px,y+py));
  ctx.closePath();ctx.fill();
  ctx.fillStyle='#e8ffff';ctx.fillRect(x+13,y-13,6,34);ctx.fillRect(x+3,y+1,26,5);
}

async function traitGem(ctx, key, x, y) {
  const file = shardArt[key];
  if (!file) { gem(ctx,x,y,traits[key].color); return; }
  const img = await image(file);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 540, 278, 320, 540, x - 8, y - 27, 48, 58);
}

async function attributeRow(ctx, key, label, centerX, centerY) {
  const gap = 16, valueGap = 23, iconWidth = 48;
  ctx.font = '700 31px "Noto Sans JP",sans-serif';
  const labelWidth = ctx.measureText(label).width;
  ctx.font = '800 35px "Noto Sans JP",sans-serif';
  const valueWidth = ctx.measureText(traits[key].name).width;
  const start = centerX - (iconWidth + gap + labelWidth + valueGap + valueWidth) / 2;
  await traitGem(ctx, key, start + 8, centerY);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#d7f4fb';
  ctx.font = '700 31px "Noto Sans JP",sans-serif';
  ctx.fillText(label, start + iconWidth + gap + labelWidth / 2, centerY + 14);
  ctx.fillStyle = traits[key].color;
  ctx.font = '800 35px "Noto Sans JP",sans-serif';
  ctx.fillText(traits[key].name, start + iconWidth + gap + labelWidth + valueGap + valueWidth / 2, centerY + 14);
}

function portrait(ctx, img, key) {
  const [sx, sy, sw, sh] = portraits[key].crop;
  const maxW = 440, maxH = 548;
  const scale = Math.min(maxW / sw, maxH / sh);
  const w = sw * scale, h = sh * scale;
  const dx = 272 - w / 2, dy = 140 + (maxH - h) / 2;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, w, h);
}

export async function createResultCard(result) {
  await document.fonts.ready;
  const main = traits[result.main], sub = traits[result.sub];
  const [workshop, title, person] = await Promise.all([image('workshop-pixel.png'), image('title-pixel.png'), image(portraits[result.main].file)]);
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 900;
  const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;

  brickwork(ctx, 0, 0, 1200, 900);
  ctx.drawImage(workshop, 0, 0, 1200, 505);
  ctx.fillStyle = '#07152eaa'; ctx.fillRect(0, 0, 1200, 690);
  ctx.fillStyle = '#06142d'; ctx.fillRect(0, 658, 1200, 242);
  magicCircle(ctx, main.color);
  portrait(ctx, person, result.main);
  ctx.drawImage(title, 172, 160, 1204, 480, 406, 22, 390, 155);

  const panelCenter = 833;
  stepWindow(ctx, 518, 190, 630, 480);
  ctx.fillStyle = '#f7fbff';
  centeredLines(ctx, catchLines[result.main], main.catch, panelCenter, 261, 558, '800 40px "Noto Sans JP",sans-serif', 51);
  ctx.fillStyle = '#54d5e7'; ctx.fillRect(560, 350, 546, 6);
  await attributeRow(ctx, result.main, 'メイン属性', panelCenter, 397);
  await attributeRow(ctx, result.sub, 'サブ属性', panelCenter, 449);

  stepWindow(ctx, 540, 475, 586, 182, {dark:'#051228',rim:'#378ea7',face:'#123356'});
  ctx.fillStyle = '#ffe29b';
  ctx.font = '800 32px "Noto Sans JP",sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('◆ 固有スキル ◆', panelCenter, 527);
  ctx.fillStyle = '#f7fcff';
  ctx.font = '800 34px "Noto Sans JP",sans-serif';
  ctx.fillText(main.skill, panelCenter, 567);
  centeredLines(ctx, skillLines[result.main], main.skillCopy, panelCenter, 603, 548, '700 27px "Noto Sans JP",sans-serif', 31);

  stepWindow(ctx, 46, 690, 1108, 155, {dark:'#051024',rim:main.color,face:'#0b2245'});
  ctx.fillStyle = main.color; ctx.fillRect(110, 747, 18, 18); ctx.fillRect(128, 752, 10, 8);
  ctx.textAlign = 'center';ctx.fillStyle = '#e2f7fc'; ctx.font = '700 31px "DotGothic16","Noto Sans JP",sans-serif';ctx.fillText('あなたのキャラは',600,744);
  ctx.fillStyle = '#fff7d1';ctx.font = '800 54px "Noto Sans JP",sans-serif';ctx.fillText(`${main.type}！`,600,811);
  ctx.fillStyle = '#d3f8fc';ctx.font = '700 27px "Noto Sans JP",sans-serif';ctx.fillText('#CLEARシェアラボ',600,879);
  ctx.fillStyle = '#61c9d9';ctx.fillRect(118, 864, 238, 5);ctx.fillRect(844, 864, 238, 5);

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('結果カードを生成できませんでした。');
  return blob;
}
