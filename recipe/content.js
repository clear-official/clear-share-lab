"use strict";

// A–F are internal diagnosis symbols; the published choices show only numbers.
const RECIPE_QUESTIONS = [
  {
    text: "友達と日帰り旅行に行くことになりました。行く場所はまだ決まっていません。最初に何をしますか？",
    answers: [
      { text: "「ここに行ってみない？」と、まず一つ提案する", type: "A" },
      { text: "前から気になっていたお店の営業時間やメニューを調べる", type: "B" },
      { text: "友達に行きたい場所を聞く", type: "C" },
      { text: "現地で過ごせる時間と移動手段を確認する", type: "D" },
    ],
  },
  {
    text: "友達と一緒に観たい映画があります。二人とも空いている時間のチケットを探したら、その上映回は売り切れでした。どうしますか？",
    answers: [
      { text: "同じ時間に、別の映画館で上映していないか探す", type: "D" },
      { text: "友達に、今日は別の映画にするか、後日にするか聞く", type: "C" },
      { text: "今日は映画の代わりに、近くで楽しめることを探す", type: "E" },
      { text: "観たかった映画は、二人の予定が合う別の日に観る", type: "F" },
    ],
  },
  {
    text: "もしカメラを趣味として始めたら、次の休日は何をしてみたいですか？",
    answers: [
      { text: "カメラを持って街に出て、気になったものを撮る", type: "A" },
      { text: "好きな写真を集めて、撮ってみたい雰囲気を探す", type: "B" },
      { text: "光の使い方やカメラの設定を調べて、撮影に試す", type: "D" },
      { text: "いつもの道を歩き、同じ場所の写真を撮りためる", type: "F" },
    ],
  },
  {
    text: "友達Aの誕生日会を数人で準備します。まず何を考えますか？",
    answers: [
      { text: "友達Aの好きなものを調べて、飾り付けにどう取り入れるか", type: "B" },
      { text: "友達Aに食べられないものがないか、食事を決める前に確認しよう", type: "C" },
      { text: "必要なものを、予算内で用意できるか", type: "D" },
      { text: "自分が先に進められる準備は何か", type: "A" },
    ],
  },
  {
    text: "初めてクッキーを焼いたら、形が崩れてしまいました。味はおいしく、材料はまだ残っています。どうしますか？",
    answers: [
      { text: "今度は形を変えて、もう一度焼いてみる", type: "A" },
      { text: "割れたクッキーを使って、別のおやつにアレンジする", type: "E" },
      { text: "生地の厚さや焼き時間を見直してから、もう一度焼く", type: "D" },
      { text: "今回はおいしく食べて、次に作るときに形を工夫する", type: "F" },
    ],
  },
  {
    text: "友達から「習い事を始めたいけど、仕事の予定が毎週変わるから続けられるか不安」と相談されました。最初に何と返しますか？",
    answers: [
      { text: "「まず一度、体験レッスンに行ってみたら？」", type: "A" },
      { text: "「どんな内容や通い方なら楽しめそう？」", type: "C" },
      { text: "「都合のいい日に予約できる教室も探してみようか」", type: "E" },
      { text: "「月に一回くらいから始めてみるのはどう？」", type: "F" },
    ],
  },
  {
    text: "友達とパスタを作る約束をしています。買い物に行くと、使う予定だったトマトが売り切れでした。どうしますか？",
    answers: [
      { text: "トマトなしでもおいしく作れるパスタのレシピを探す", type: "B" },
      { text: "友達に、別の味のパスタでもいいか聞く", type: "C" },
      { text: "近くの別のお店にトマトがないか確認する", type: "D" },
      { text: "店にある別の野菜を使ってアレンジする", type: "E" },
    ],
  },
];

const RECIPE_RESULTS = [
  {
    id: "omurice", type: "A", image: "../assets/recipe/omurice.png", dish: "オムライス",
    name: "名物まかないプレート", ingredients: "まず試す力／形にする力",
    description: "思いついたことを、まず試してみる人。動きながら、自分に合うやり方を見つけます。",
    tip: "やりたいことが増えたら、まず一つを最後までやってみて。",
    seal: "思いついたらすぐに試してみる",
    hiddenFlavorText: "思いついたことをすぐ試す行動力",
  },
  {
    id: "curry", type: "B", image: "../assets/recipe/curry.png", dish: "好き全部のせカレー",
    name: "好き全部のせカレー", ingredients: "好奇心／詳しく調べる力",
    description: "気になることを、自分で詳しく調べる人。知るほど興味が深まり、楽しみが広がります。",
    tip: "調べて分かったことを誰かと話すと、新しい発見につながるかも。",
    seal: "気になったらすぐに詳しく調べる",
    hiddenFlavorText: "気になることを掘り下げる好奇心",
  },
  {
    id: "soup", type: "C", image: "../assets/recipe/soup.png", dish: "スープ",
    name: "ほっとさせるあったかスープ", ingredients: "気づく力／相手の話を聞く力",
    description: "相手の希望や困りごとに気づける人。話を聞きながら、相手に合う方法を考えます。",
    tip: "相手の希望を聞いたら、自分の希望も伝えてみて。",
    seal: "変化に気づいたらすぐに声をかける",
    hiddenFlavorText: "相手の希望を確かめる気づかい",
  },
  {
    id: "course", type: "D", image: "../assets/recipe/course.png", dish: "焼き魚が主役の三品コース",
    name: "先読みフルコース", ingredients: "見通す力／段取りを組む力",
    description: "時間や予算などを先に確認し、進め方を考える人。必要な準備を整えてから行動できます。",
    tip: "予定を詰め込みすぎず、当日を楽しむ余裕も残してみて。",
    seal: "条件を確認してから動き出す",
    hiddenFlavorText: "条件を確かめて段取りを考える力",
  },
  {
    id: "pasta", type: "E", image: "../assets/recipe/pasta.png", dish: "きのこと青菜のパスタ",
    name: "逆転アレンジパスタ", ingredients: "切り替える力／工夫する力",
    description: "予定どおりにいかないときも、今あるものを使って別の方法を考えられる人です。",
    tip: "うまくいった工夫は覚えておくと、次にも役立ちます。",
    seal: "予定が変わったらすぐに切り替え",
    hiddenFlavorText: "別の方法を見つける柔軟さ",
  },
  {
    id: "stew", type: "F", image: "../assets/recipe/stew.png", dish: "クリームシチュー",
    name: "じっくり煮込みシチュー", ingredients: "自分のペースを守る力／続ける力",
    description: "急がず、自分のペースで続ける人。少しずつ経験を重ね、できることを増やしていきます。",
    tip: "ときどき振り返ると、続けてきたことに気づけます。",
    seal: "少しずつ、じっくり積み重ねる",
    hiddenFlavorText: "自分のペースで続ける粘り強さ",
  },
];

const RECIPE_APPEARANCES = Object.freeze({ A: 5, B: 4, C: 5, D: 6, E: 4, F: 4 });

function rankRecipeTypes(answers) {
  if (!Array.isArray(answers) || answers.length !== RECIPE_QUESTIONS.length) throw new Error("回答数が正しくありません");
  const scores = Object.keys(RECIPE_APPEARANCES).map((type) => ({ type, count: 0, latest: -1 }));
  for (let index = 0; index < RECIPE_QUESTIONS.length; index += 1) {
    const choice = answers[index];
    const type = RECIPE_QUESTIONS[index].answers[choice]?.type;
    if (!Number.isInteger(choice) || !type) throw new Error("回答が正しくありません");
    const score = scores.find((entry) => entry.type === type);
    score.count += 1;
    score.latest = index;
  }
  scores.sort((a, b) => b.count * RECIPE_APPEARANCES[a.type] - a.count * RECIPE_APPEARANCES[b.type]
    || b.count - a.count || b.latest - a.latest || a.type.localeCompare(b.type));
  return scores.map((entry) => entry.type);
}

window.RECIPE_CONTENT = Object.freeze({
  questions: RECIPE_QUESTIONS,
  results: RECIPE_RESULTS,
  appearances: RECIPE_APPEARANCES,
  rankTypes: rankRecipeTypes,
  resolveResult(answers) {
    return RECIPE_RESULTS.find((result) => result.type === rankRecipeTypes(answers)[0]).id;
  },
  resolveHiddenFlavor(answers) {
    return RECIPE_RESULTS.find((result) => result.type === rankRecipeTypes(answers)[1]).id;
  },
});
