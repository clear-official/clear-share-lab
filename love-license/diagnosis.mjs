export const TYPES = [
  {
    id:"A", name:"好きなら直進、アクセル型",
    lead:"次の約束、もう考えてます。",
    skill:"会いたい気持ちを、お誘いに変える",
    caution:"次の予定、まだ前のデート中です",
    summary:"もっと話したい、また会いたい。そう思ったら、自分からきっかけをつくれるあなた。連絡やお誘いを重ねながら、相手のことを知っていきます。楽しい時間を過ごすと、その場で次の約束をしたくなることも。ときどき相手からの提案を待つと、二人のペースも見えてきそうです。",
    tip:"一度誘ったら、次は相手からの提案も待ってみて。"
  },
  {
    id:"B", name:"脈あり待ちの信号待ち型",
    lead:"青なら進める。青なら。",
    skill:"相手の好意を確かめて、一歩進む",
    caution:"二人とも青信号を待っています",
    summary:"近づきたい気持ちはあっても、相手も同じ気持ちなのか確かめてから動きたいあなた。誘いや好意が返ってくると、安心して一歩を踏み出せます。一方で、相手も様子を見ていると、お互いに待ったままになることも。「また会いたい」の一言が、二人のきっかけになるかもしれません。",
    tip:"大きな確信を待つ前に、「また会いたい」と小さな合図を出してみて。"
  },
  {
    id:"C", name:"友達レーンで周回型",
    lead:"仲はいい。出口はどこ？",
    skill:"気軽な会話で、親しさを育てる",
    caution:"いい雰囲気も、つい冗談で通過",
    summary:"気軽な会話や笑いを通して、親しい関係を育てるあなた。一緒にいて楽しいからこそ、急に恋愛の空気になると照れてしまうことも。好意を伝えたい場面でも、つい冗談にしてしまいがちです。いつものやり取りに一言だけ本音を添えると、友達としての親しさの先へ進むきっかけになりそうです。",
    tip:"照れて笑ったあとに、「でも、うれしい」と本音も一言。"
  },
  {
    id:"D", name:"本音を聞いてルート相談型",
    lead:"行き先、一緒に決めませんか。",
    skill:"お互いの希望を言葉にして進む",
    caution:"行き先相談で、出発が延びがち",
    summary:"自分の希望を伝えながら、相手の気持ちも聞いて進めたいあなた。会う場所や次の約束も、二人で納得して決めようとします。ただ、細かく確かめているうちに、次の一歩が後回しになることも。大切な希望を一つずつ話し、決められることから動いてみると、相談する時間も一緒に過ごす時間も楽しめそうです。",
    tip:"全部を決め切る前に、「まずは次に会う日」から。"
  },
  {
    id:"E", name:"ときめくほど急ブレーキ型",
    lead:"うれしい。でも心の準備中。",
    skill:"気持ちが追いつくペースで進む",
    caution:"待っていたお誘いで、一時停止",
    summary:"気になる相手でも、急に距離が縮まると少し立ち止まりたくなるあなた。うれしい気持ちと、まだ心の準備ができていない気持ちが、同時に出てくることもあります。急いで答えを出す必要はありません。好意と、ゆっくり進みたい希望を一緒に伝えると、相手もあなたのペースを知ることができます。",
    tip:"「うれしい。少しゆっくり進みたい」と、好意と希望を一緒に伝えて。"
  }
];

export const QUESTIONS = [
  {
    title:"次に会う約束",
    prompt:"気になる人と二人で出かけ、楽しく過ごせました。\n帰宅後に「今日はありがとう！」と連絡が来たら？",
    options:[
      "「次は〇〇に行かない？」と、次の約束を提案する",
      "「また会いたい」と相手から言ってくれるか、会話を続けてみる",
      "今日の面白かった出来事を話して、いつものノリで盛り上がる",
      "「私はまた会いたいな。どうだった？」と、自分の気持ちも伝えて聞く"
    ],
    mapping:["A","B","C","D"]
  },
  {
    title:"二人きりへのお誘い",
    prompt:"いつも数人で遊ぶ気になる人から、\n「今度は二人で出かけない？」と誘われました。どう返す？",
    options:[
      "「行こう！ いつ空いてる？」と日程の話をする",
      "「ほかの人も誘う？」と、二人きりのお誘いなのか確かめる",
      "照れて「二人で何するの？」と、いったん冗談っぽく返す",
      "うれしいけれど緊張して、少し考えてから返す"
    ],
    mapping:["A","B","C","E"]
  },
  {
    title:"連絡のペース",
    prompt:"気になる人と毎晩やり取りするようになりました。\n楽しいけれど、そろそろ寝たい。そんな夜は？",
    options:[
      "「続きは明日聞かせて！」と、次につながる言葉で終える",
      "相手が会話を終えるまでは、自分から切り上げにくい",
      "「もう寝る！ また明日」と、いつもの軽いノリで終える",
      "「話すのは楽しいけど、平日はこの時間に寝たい」と伝える"
    ],
    mapping:["A","B","C","D"]
  },
  {
    title:"急に距離が近づいたら",
    prompt:"二人で歩いていると、気になる人に\n「手、つないでもいい？」と聞かれました。\n自分もつなぎたいと思っているなら？",
    options:[
      "「いいよ」と、自分から手を差し出す",
      "相手も自分を意識していると分かり、安心してうなずく",
      "「なんか照れるね」と、笑って照れを隠す",
      "うれしいのに体が固まり、「ちょっと待って」と言ってしまう"
    ],
    mapping:["A","B","C","E"]
  },
  {
    title:"自分の希望を伝えるとき",
    prompt:"次のデートに、相手がにぎやかなお店を提案してくれました。\nあなたは、今回は静かな場所でゆっくり話したい気分です。どうする？",
    options:[
      "「今回はここに行かない？」と、別のお店を提案する",
      "せっかく誘ってくれたので、今回は相手の提案に乗る",
      "「ゆっくり話したいから、静かなお店はどう？」と理由も伝える",
      "お店を決める前に、二人でどう過ごしたいか話してみる"
    ],
    mapping:["A","B","D","D"]
  },
  {
    title:"予定が延期になったら",
    prompt:"気になる人との約束が、相手の仕事で延期になりました。\n「ごめん、また予定を合わせたい」と連絡が来たら？",
    options:[
      "「来週の土曜か日曜はどう？」と候補を出す",
      "「落ち着いたら教えて」と返し、次は相手から誘ってくれるか待つ",
      "「次はおいしいもの付きでよろしく」と、明るく返す",
      "「私はまた会いたいな。いつ頃なら予定が分かりそう？」と聞く"
    ],
    mapping:["A","B","C","D"]
  },
  {
    title:"関係が変わる瞬間",
    prompt:"何度か二人で会った相手から、\n「付き合いたいと思ってる」と伝えられました。\nあなたにも好意があります。反応に近いのは？",
    options:[
      "「私も！」と答え、これから一緒にしたいことが浮かぶ",
      "同じ気持ちだと分かってほっとし、ようやく素直に好意を伝えられる",
      "「真面目に言われると照れるね」と、一度笑ってしまう",
      "うれしいけれど、すぐに答えず自分の気持ちを整理したくなる"
    ],
    mapping:["A","B","C","E"]
  }
];

const FULL_MARKS = {A:19,B:19,C:16,D:10,E:9};
const TIE_ORDER = [6,3,1,0,5,4,2];

export function judge(answers) {
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length ||
      !answers.every(answer => Number.isInteger(answer) && answer >= 0 && answer < 4)) return null;
  const points = {A:0,B:0,C:0,D:0,E:0};
  const primaryCounts = {A:0,B:0,C:0,D:0,E:0};
  answers.forEach((answer,index) => {
    const id = QUESTIONS[index].mapping[answer];
    points[id] += index === 2 ? 1 : 3;
    if (index !== 2) primaryCounts[id]++;
  });
  const candidates = TYPES.map(type => type.id).filter(id => primaryCounts[id] >= 2);
  if (!candidates.length) throw new Error("候補がありません");
  let leaders = [candidates[0]];
  for (const id of candidates.slice(1)) {
    const comparison = points[id] * FULL_MARKS[leaders[0]] - points[leaders[0]] * FULL_MARKS[id];
    if (comparison > 0) leaders = [id];
    else if (comparison === 0) leaders.push(id);
  }
  const tieUsed = leaders.length > 1;
  let typeId = leaders[0];
  if (tieUsed) {
    for (const index of TIE_ORDER) {
      const selected = QUESTIONS[index].mapping[answers[index]];
      if (leaders.includes(selected)) { typeId = selected; break; }
    }
  }
  return {typeId,tieUsed};
}

export function postText(typeId, formalUrl, destination = "public") {
  const type = TYPES.find(item => item.id === typeId);
  if (!type || !formalUrl) return null;
  let url;
  try { url = new URL(formalUrl); } catch { return null; }
  if (url.protocol !== "https:" || url.search || url.hash) return null;
  if (destination === "line") return [
    "「恋愛運転免許証」をやってみたよ🚗",
    "",
    "私は「" + type.name + "」でした！",
    "",
    "あなたはどんなタイプ？",
    "よかったら診断してみてね。",
    url.href
  ].join("\n");
  return [
    "#PR",
    "",
    "私の恋愛運転タイプは",
    "「" + type.name + "」でした🚗",
    "",
    "あなたの恋は、どんな運転？",
    "「恋愛運転免許証」で診断してみてね！",
    "",
    url.href,
    "",
    "#CLEARシェアラボ"
  ].join("\n");
}
