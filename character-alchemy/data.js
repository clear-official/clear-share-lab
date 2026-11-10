export const traits = {
  action: { name: '行動', type: 'はじまりの冒険家', color: '#ff8f7e', shape: 'arrow', skill: 'スタートダッシュ', skillCopy: '迷って止まった場面に、動き出すきっかけをつくる。', catch: 'あなたの一歩が、物語を動かす。', description: '「やってみたい」を行動に変えられるあなた。実際に試しながら、自分に合う方法を見つけていきます。あなたのひと声が、周りの人のきっかけになることも。', shine: '誰も動き出せず、きっかけを待っているとき。', care: '勢いに乗ると、予定や引き受けることを増やしすぎることも。', tip: '動き出す前に「今日はここまで」をひとつ決めてみよう。' },
  curiosity: { name: '好奇心', type: 'ときめきの探索家', color: '#f9cf72', shape: 'star', skill: '発見レーダー', skillCopy: '何気ない毎日から、まだ知らない楽しみを見つける。', catch: '「気になる」の先に、宝物がある。', description: '小さな違いや、初めて見るものを楽しめるあなた。気になったことを調べたり、足を運んだりするうちに、自分だけのお気に入りが増えていきます。', shine: 'いつもの毎日に、少し物足りなさを感じたとき。', care: '興味が次々に広がり、どれを楽しむか迷ってしまうことも。', tip: '今いちばん気になることを、ひとつだけ深掘りしてみよう。' },
  empathy: { name: '共感', type: 'よりそいの精霊使い', color: '#ee9dbb', shape: 'octagon', skill: '安心の結界', skillCopy: '相手の気持ちを受け止め、ほっと話せる空気をつくる。', catch: 'そのやさしさが、仲間の力になる。', description: '相手の言葉や表情から、気持ちをくみ取るあなた。すぐに答えを出すよりも、まず受け止めることを大切にします。その姿勢が「話してよかった」と思える安心につながります。', shine: '誰かが気持ちをうまく言葉にできずにいるとき。', care: '相手を優先して、自分の疲れや希望を後回しにしてしまうことも。', tip: '「私はどうしたい？」も、相手の気持ちと同じくらい大切にしよう。' },
  idea: { name: '発想', type: 'ひらめきの魔法使い', color: '#67e6ee', shape: 'bolt', skill: '視点チェンジ', skillCopy: '行き詰まったときも、別の角度から突破口を見つける。', catch: '見方を変えて、道をひらく。', description: '決まったやり方に縛られず、別の可能性を考えられるあなた。一見つながらないものを組み合わせたり、前提を変えたりして、行き詰まった場面に新しい道をつくります。', shine: 'いつもの方法では、うまく進まなくなったとき。', care: '考えが先へ進み、周りへの説明が追いつかないことも。', tip: '思いついた案に「まず何をするか」をひとつ添えてみよう。' },
  steady: { name: '継続', type: '積み重ねの錬成士', color: '#74d7ad', shape: 'square', skill: '毎日の一歩', skillCopy: '一度では届かない目標も、少しずつ形にしていく。', catch: '続けた時間が、あなたの力になる。', description: 'すぐに結果が出なくても、小さな変化を重ねられるあなた。自分に合うペースを見つけ、少しずつ形にしていきます。その丁寧な積み重ねが、周りからの信頼にもつながります。', shine: '一度の挑戦では届かない目標に向き合うとき。', care: '「続けなきゃ」が強くなると、休むタイミングを逃してしまうことも。', tip: 'できたことを振り返り、休む日も予定に入れてみよう。' },
  observe: { name: '観察', type: '道しるべの賢者', color: '#82b7ff', shape: 'diamond', skill: '先読みマップ', skillCopy: '状況の変化に気づき、つまずく前に進み方を整える。', catch: '小さな気づきで、進む道を整える。', description: '状況をよく見て、必要な情報を整理できるあなた。見落とされがちな変化にも気づき、先に準備を進めます。その気配りが、自分や周りの人の「困った」を減らしていきます。', shine: '選択肢が多く、進み方を決めたいとき。', care: '確認したいことが増えて、決めるまでに時間がかかることも。', tip: '「ここまで分かれば進める」という目安を決めてみよう。' }
};

const option = (text, primary, secondary) => ({ text, primary, secondary });
export const questions = [
  { text: '予定のない休日。SNSで気になるイベントを見つけたら、まずどうする？', options: [option('行けそうなら、そのまま出かけてみる','action','curiosity'),option('どんなものがあるのか、写真や投稿をもっと見る','curiosity','idea'),option('一緒に楽しめそうな友達に送ってみる','empathy','action'),option('開催時間や混み具合、行き方を確認する','observe','steady')] },
  { text: '友達とのお出かけ先が、なかなか決まらない。あなたがしそうなのは？', options: [option('「この中ならここはどう？」と、ひとつ提案する','action','steady'),option('みんなが何をしたい気分なのか、聞いてみる','empathy','observe'),option('出ている案を組み合わせて、別のプランを考える','idea','empathy'),option('予算や移動時間を比べて、候補を整理する','observe','steady')] },
  { text: '新しい趣味を始めるなら、どんな始め方が自分に近い？', options: [option('どんなものが作れるのか、写真や動画を見てみる','curiosity','observe'),option('お手本に自分なりのアレンジを加えてみる','idea','action'),option('無理なく続けられる、小さな目標を決める','steady','action'),option('基本のやり方や、必要な道具をひと通り確認する','observe','curiosity')] },
  { text: '友達から「今日ちょっと嫌なことがあって」と連絡が来た。最初に返しそうなのは？', options: [option('「気分転換に、何かおいしいものでも食べに行く？」','action','empathy'),option('「何があったの？ よかったら聞かせて」','empathy','steady'),option('「一緒に、少し気が楽になる考え方を探してみる？」','idea','curiosity'),option('「今はゆっくりしてね。また明日も連絡するね」','steady','empathy')] },
  { text: '楽しみにしていたお店が、まさかの臨時休業。そんなときは？', options: [option('近くで入れそうなお店を見つけて、まず向かう','action','idea'),option('せっかくなので、周辺を歩いて気になるお店を探す','curiosity','action'),option('買って帰って家で楽しむなど、過ごし方ごと変える','idea','curiosity'),option('営業中のお店や待ち時間を調べてから、次を決める','observe','steady')] },
  { text: '少し時間のかかることに取り組むとき、「もう少し続けよう」と思えるのは？', options: [option('途中で、知らなかったことを発見したとき','curiosity','observe'),option('誰かが喜んでくれたり、役に立てたと感じたとき','empathy','idea'),option('前よりできるようになったことに気づいたとき','steady','curiosity'),option('自分で工夫した方法が、うまくいったとき','idea','curiosity')] },
  { text: '友達と旅行を終えた後、言われて特にうれしいのは？', options: [option('「誘ってくれたおかげで、楽しい旅行になった！」','action','idea'),option('「いろいろ気にかけてくれて、安心して楽しめた！」','empathy','observe'),option('「少しずつ準備を進めてくれて、すごく助かった！」','steady','empathy'),option('「先に気づいて調べてくれたから、迷わず回れた！」','observe','steady')] }
];

export function scoreAnswers(answers) {
  if (answers.length !== questions.length || answers.some((a) => !Number.isInteger(a) || a < 0 || a > 3)) return null;
  const stats = Object.fromEntries(Object.keys(traits).map((key) => [key, { points: 0, primary: 0, last: -1, lastPrimary: false }]));
  answers.forEach((answer, index) => {
    const choice = questions[index].options[answer];
    stats[choice.primary].points += 2;
    stats[choice.primary].primary += 1;
    stats[choice.primary].last = index;
    stats[choice.primary].lastPrimary = true;
    stats[choice.secondary].points += 1;
    if (stats[choice.secondary].last < index) { stats[choice.secondary].last = index; stats[choice.secondary].lastPrimary = false; }
  });
  const ranked = Object.keys(traits).sort((a,b) => stats[b].points - stats[a].points || stats[b].primary - stats[a].primary || stats[b].last - stats[a].last || Number(stats[b].lastPrimary) - Number(stats[a].lastPrimary) || Object.keys(traits).indexOf(a) - Object.keys(traits).indexOf(b));
  return { main: ranked[0], sub: ranked[1], stats, ranked };
}

export function shareText(kind, result, url) {
  if (!result || !url) return '';
  const type = traits[result.main].type;
  if (kind === 'line') return `「わたしのキャラ錬成」をやってみたよ！\nわたしは『${type}』でした！\nあなたはどんなキャラになる？\nよかったらやってみてね！\n${url}`;
  return `わたしのキャラは『${type}』でした！\nメイン属性：${traits[result.main].name}／サブ属性：${traits[result.sub].name}\nあなたはどんなキャラになる？\n#PR #CLEARシェアラボ\n${url}`;
}
