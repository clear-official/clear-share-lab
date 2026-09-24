# PROJECT_SPEC.md

## Clear シェアラボ — Project Specification

Repository: `clear-share-lab`

First content: **恋愛通知表**

Last updated: 2026-09-24

---

## 1. Project overview

**Clear シェアラボ** is a recurring participatory content series for the Clear app.

Concept:

**診断 → 結果を楽しむ → SNSでシェア → 見た人も参加したくなる**

The diagnosis theme can change over time, for example:

- 恋愛
- 性格
- 仕事
- 人間関係
- お金

The first release is **恋愛通知表**.

Official hashtag:

**#CLEARシェアラボ**

---

## 2. First content: 恋愛通知表

A 5-question romance diagnosis that outputs one of 6 types.

Result presentation is styled like a school report card / evaluation sheet while keeping the Clear visual identity.

Primary experience goals:

- easy to understand on mobile
- quick to complete
- visually fun result
- easy to share
- strong reason to return to Clear through the 100pt reward

Estimated completion time shown to users:

**約1分**

Question count shown to users:

**5問**

---

## 3. User journey

### Core diagnosis flow

1. TOP
2. 診断スタート
3. Q1–Q5
4. display name input
5. result screen
6. reward explanation
7. share result
8. upload screenshot of SNS post
9. receive campaign code
10. open Clear campaign-code screen

### Reward

**100pt**

### Clear campaign-code destination

`https://app-clear.com/open?act=campaign_code`

---

## 4. TOP screen

Required elements:

- 恋愛通知表 logo
- tagline:
  - `あなたの恋愛、通知表にしたらどんなタイプ？`
- `質問数 5問`
- `所要時間 約1分`
- main button:
  - `診断スタート`
- combined white-coat Ria + Clear シェアラボ image
- 100pt reward banner

Current intended order:

1. 恋愛通知表 logo
2. tagline
3. question/time chips
4. 診断スタート button
5. combined 白衣リアちゃん＋CLEARシェアラボ image
6. reward banner

The combined Clear branding image should be slightly restrained so the 恋愛通知表 title and CTA remain dominant.

---

## 5. Diagnosis questions and scoring

There are 6 result IDs:

- REVEAL: 好きバレ秒速タイプ
- LOYAL: 一途すぎ忠犬タイプ
- PRINCESS: 追われ待ちプリンセスタイプ
- MEETING: 脳内恋愛会議タイプ
- CHARM: 無自覚沼らせタイプ
- ALL_IN: 恋すると全振りタイプ

Each answer gives +2 to a primary type and +1 to a secondary type.

### Q1

**気になる人ができた！まずどうする？**

A. 自分から話しかけたり、連絡する機会を増やす
- 好きバレ秒速 +2
- 恋すると全振り +1

B. 相手の様子を見ながら、少しずつ距離を縮める
- 無自覚沼らせ +2
- 脳内恋愛会議 +1

C. 向こうから来てくれないかな〜と待つ
- 追われ待ちプリンセス +2
- 一途すぎ忠犬 +1

### Q2

**好きな人から返信が来ない。どうなる？**

A. 「忙しいのかな」と思って普通に待てる
- 一途すぎ忠犬 +2
- 無自覚沼らせ +1

B. 何度もスマホを見ながら、返信が遅い理由を考える
- 脳内恋愛会議 +2
- 追われ待ちプリンセス +1

C. 気になりすぎて、別の話題を送りたくなる
- 恋すると全振り +2
- 好きバレ秒速 +1

### Q3

**好きになったときのあなたに一番近いのは？**

A. 周りから「好きなのバレバレ」と言われる
- 好きバレ秒速 +2
- 恋すると全振り +1

B. 好きな人には尽くしたくなる
- 一途すぎ忠犬 +2
- 追われ待ちプリンセス +1

C. 意外と普段と変わらない
- 無自覚沼らせ +2
- 追われ待ちプリンセス +1

### Q4

**気になる人といい感じ。でも告白してこない！**

A. このまま待つ。できれば相手から言ってほしい
- 追われ待ちプリンセス +2
- 一途すぎ忠犬 +1

B. 「私のことどう思ってるんだろう」と脳内反省会が始まる
- 脳内恋愛会議 +2
- 無自覚沼らせ +1

C. 自分からさらに距離を縮めて、ほぼ答えを出しにいく
- 好きバレ秒速 +2
- 恋すると全振り +1

### Q5

**恋をすると、生活はどうなる？**

A. 気づいたら好きな人中心になっている
- 一途すぎ忠犬 +2
- 脳内恋愛会議 +1

B. 恋愛も大事だけど、自分のペースはあまり変わらない
- 無自覚沼らせ +2
- 追われ待ちプリンセス +1

C. 連絡・予定・美容まで一気に恋愛モードになる
- 恋すると全振り +2
- 好きバレ秒速 +1

---

## 6. Tie-break logic

When total scores tie:

1. Compare count of +2 primary selections.
2. If still tied, check the primary result of answers in reverse question order:
   - Q5
   - Q4
   - Q3
   - Q2
   - Q1
3. Return the first tied candidate encountered in that priority order.

Do not change this logic without explicit approval.

---

## 7. Result types

### 7.1 好きバレ秒速タイプ

Catch:

`好きになったら、だいたい顔に出てます。`

Ratings:

- 積極性 5
- 一途度 4
- 甘え上手度 3
- 駆け引き力 1
- 沼りやすさ 4

Teacher comment:

`隠しているつもりでも、周囲にはほぼ提出済みです。`

Summary:

`好きな人ができると、表情も返信速度も分かりやすく恋愛モードに。`
`隠しているつもりでも、周りには意外とバレているかも…？`
`駆け引きより、素直に「好き」が出ちゃうのがあなたの魅力です。`

Asset:

`assets/ria-cupid.webp`

---

### 7.2 一途すぎ忠犬タイプ

Catch:

`好きになったら、他は見えません。`

Ratings:

- 積極性 3
- 一途度 5
- 甘え上手度 4
- 駆け引き力 1
- 沼りやすさ 5

Teacher comment:

`好きな人への皆勤賞は素晴らしいですが、自分の時間も大切にしましょう。`

Summary:

`一度好きになると、とことん一途。`
`待つのも尽くすのも苦にならない、愛情たっぷりタイプです。`
`ただし気づいたら、予定も気分も好きな人中心になっていることも。`

Asset:

`assets/ria-dog.webp`

Visual note:

The dog costume has a larger silhouette than other character assets. Use a dedicated result-screen size adjustment if necessary rather than forcing the same apparent size as all other types.

---

### 7.3 追われ待ちプリンセスタイプ

Catch:

`好き。でも、そっちから来て？`

Ratings:

- 積極性 1
- 一途度 3
- 甘え上手度 5
- 駆け引き力 4
- 沼りやすさ 3

Teacher comment:

`待っているだけでは先生も採点できません。たまには自分から一歩。`

Summary:

`気になる人がいても、自分からグイグイ行くのはちょっと違う。`
`「好きなら向こうから来てほしい」が本音の、追われたいタイプです。`
`大切にされている実感が、恋のスイッチになることも。`

Asset:

`assets/ria-princess.webp`

---

### 7.4 脳内恋愛会議タイプ

Catch:

`返信ひとつで、会議が始まります。`

Ratings:

- 積極性 2
- 一途度 4
- 甘え上手度 2
- 駆け引き力 3
- 沼りやすさ 5

Teacher comment:

`返信の「！」が1個減っただけで、緊急会議を開かないように。`

Summary:

`相手の言葉や行動を細かく読み取る慎重派。`
`「あの言葉ってどういう意味？」と考えているうちに、脳内会議が長期化することも。`
`でも、それだけ相手をよく見ているタイプでもあります。`
`深く考える力は、恋を大切にするあなただからこその魅力です。`

Asset:

`assets/ria-detective.webp`

---

### 7.5 無自覚沼らせタイプ

Catch:

`何もしてないのに、なぜか相手が沼る。`

Ratings:

- 積極性 3
- 一途度 3
- 甘え上手度 4
- 駆け引き力 5
- 沼りやすさ 1

Teacher comment:

`本人にその気はないようですが、周囲から被害報告が届いています。`

Summary:

`追いかけすぎず、恋愛中でも自然体。`
`その絶妙な距離感が、気づかないうちに相手を夢中にさせているかも。`
`一番厄介なのは、本人にまったくその自覚がないところです。`

Asset:

`assets/ria-devil.webp`

---

### 7.6 恋すると全振りタイプ

Catch:

`通常運転、終了。恋愛モード突入。`

Ratings:

- 積極性 5
- 一途度 4
- 甘え上手度 3
- 駆け引き力 2
- 沼りやすさ 5

Teacher comment:

`恋愛科目だけ急に履修単位が多すぎます。`

Summary:

`本気で好きになった瞬間、恋愛スイッチが入ります！`
`連絡も予定も美容も、一気に恋仕様へ切り替わります。`
`好きな人のためなら全力疾走できる、熱量全開タイプです。`

Asset:

`assets/ria-cheer.webp`

---

## 8. Name input

Before the result is shown, ask for a display name.

User copy:

`結果に表示する名前を教えてね`

Privacy/supporting copy:

`入力した名前は投稿用の画像にも表示されます。`
`本名ではなく、ニックネームやSNSで使用している名前がおすすめです。`

Current maximum length:

**20 characters**

User input must be HTML-escaped before rendering.

---

## 9. Result screen

Main result area contains:

- Clear シェアラボ mini header logo
- back button
- 恋愛通知表 logo
- user name + “の恋愛タイプは…”
- result character
- result type name
- catch copy

Report section contains:

- smaller 恋愛通知表 logo
- 氏名
- 5段階評価
- 先生からのひとこと
- 総評

Then:

- 100pt reward card
- share area
- upload area
- campaign code area after successful upload/claim

The overall result screen should feel like a polished report card, not a generic white card UI.

---

## 10. Reward card

Main copy:

**シェアしてポイントゲット！**

Reward:

**100pt**

Current four-step explanation:

1. `#CLEARシェアラボ`を付けてSNSへ投稿
2. 投稿画面のスクショを撮影
3. スクショをアップロード
4. キャンペーンコードを受け取る

---

## 11. Share section

Heading:

`この結果をシェアしよう`

Hashtag:

`#CLEARシェアラボ`

Buttons:

- 画像を保存
- シェア文をコピー
- Xでシェア
- LINEでシェア
- その他でシェア

Helper copy:

`X・LINEでは投稿画面で画像を添付してください。`

Do not add a separate “投稿できましたか？” confirmation step.

---

## 12. Share text

General share structure:

`恋愛通知表やってみた！`
`私は「○○タイプ」でした！`
`#CLEARシェアラボ`

The site share URL is appended where appropriate.

---

## 13. Share image specification

Canvas size:

**1080×1080**

Required content:

- lab background
- report-card paper treatment
- 恋愛通知表 logo
- centered name row
- result character
- result type
- catch copy
- teacher comment
- teacher Ria
- 5-stage rating table
- hashtag
- `あなたは何タイプ？`
- Clear シェアラボ logo

### Current desired refinements

- Treat `氏名` + displayed name as one centered group.
- Remove the redundant small `タイプ` label from the type card.
- Add vertical breathing room inside the teacher comment card.
- Add spacing between the teacher heading and body copy.
- Teacher Ria should be clearly visible and larger than the earlier tiny decorative treatment.
- Bottom-right Clear シェアラボ logo should be visibly larger than the earlier version while remaining secondary.
- Teacher comment should not be truncated with `…`.

The share image must remain readable after SNS downsizing.

---

## 14. Upload flow

User-facing heading:

`投稿できたらスクショをアップロード`

Supporting copy:

`SNSに投稿した画面のスクリーンショットを選択してください`

Current recovered implementation only validates the selected file on the front end and uses a mock upload delay.
This is not production-complete.

### Required production behavior

1. user selects screenshot
2. client validates basic file constraints
3. upload to server/storage
4. server validates image content
5. image is stored privately
6. claim metadata is saved
7. duplicate/idempotency checks run
8. only after success is the campaign code returned/displayed

If any required step fails, do not unlock a code.

---

## 15. Upload privacy notice

Display near the upload area before submission:

**アップロードされた画像は、キャンペーン参加確認・不正利用防止のため、運営側で確認・保存する場合があります。**

If a privacy-policy link is available, place it near this notice.

---

## 16. Upload validation

Supported production formats:

- JPG/JPEG
- PNG
- WebP

Current front-end size limit:

**12MB**

Production validation should verify:

- real MIME/content type
- actual decodable image
- maximum size
- maximum dimensions
- zero-byte/corrupt file
- suspicious payloads

Prefer server-side re-encoding/EXIF removal where practical.

---

## 17. Stored claim metadata

The production implementation should retain enough information for operations review.

Recommended fields:

- claim/upload ID
- upload timestamp
- diagnosis timestamp
- diagnosis type
- displayed name
- Clear account/user identifier if safely available
- stored image reference
- image hash
- campaign identifier
- campaign code issuance timestamp
- campaign code status
- review status
- admin notes
- last review timestamp

---

## 18. Admin review

Statuses:

- 未確認
- 確認済み
- 要確認
- 不正疑い

List view should support:

- thumbnail
- uploaded at
- displayed name
- diagnosis type
- account identifier where available
- status

Detail view should support:

- full screenshot
- claim metadata
- code issuance status
- review status change
- admin notes
- last review time

Images must remain private.
Do not expose predictable public image URLs.

---

## 19. Anti-abuse requirements

### Campaign code

Do not embed the production campaign code directly in client-side JavaScript.

The recovered site currently exposes the code in the browser source. This is a known temporary implementation and must be fixed before production.

Preferred architecture:

user/account + campaign + successful screenshot claim → server decides eligibility → server returns one-time/user-specific code where possible

If the Clear platform only supports a shared campaign code with one redemption per account, still record who was shown the code and enforce the strongest available claim controls.

### Duplicate handling

Compute an image hash for exact duplicate detection.

Exact duplicate:

- flag or reject according to business rules
- do not automatically label it fraud without review

### Idempotency

Prevent duplicate code issuance caused by:

- double tap
- retry
- reload
- browser back/forward
- multiple tabs
- repeated API calls

Prefer a server-side unique constraint such as:

`user_id + campaign_id`

when user identity is available.

---

## 20. Known limitations of screenshot proof

A screenshot does not prove all of the following:

- the post belongs to the uploader
- the post is still live
- the screenshot was not reused

Therefore screenshot review is only one anti-abuse layer.

Primary controls should also rely on account-based redemption restrictions, claim records, duplication signals, and manual review where needed.

---

## 21. Current technical architecture

Recovered implementation:

- plain `index.html`
- plain `styles.css`
- plain `app.js`
- local assets under `assets/`
- hash-based navigation
- `localStorage` persistence
- canvas-based share image generation
- Web Share API where supported
- fallback image download / text copy

Current `localStorage` key:

`clearShareLab_v1`

The existing lightweight architecture should be preserved unless a future backend/storage requirement clearly requires a different structure.

---

## 22. Current assets

```text
assets/
├─ lab-background.webp
├─ ria-cupid.webp
├─ ria-dog.webp
├─ ria-princess.webp
├─ ria-detective.webp
├─ ria-devil.webp
├─ ria-cheer.webp
├─ ria-teacher.webp
├─ love-report-logo.webp
├─ clear-share-lab-logo.webp
├─ clear-ria-lockup.webp
├─ paper-report.webp
├─ paper-message-card.webp
└─ point-coin.webp
```

Do not rename these without updating all code references.

---

## 23. Mobile acceptance criteria

Primary width:

**375px**

At minimum verify:

- TOP
- all question screens
- name input
- result
- reward section
- share section
- share image preview
- upload section
- code section

No horizontal scrolling.
No clipped copy.
No overlapping interactive elements.

---

## 24. Production readiness checklist

Before final production release:

- [ ] all 6 result types render correctly
- [ ] all 14 assets load
- [ ] 5-question scoring verified
- [ ] tie-break verified
- [ ] name escaping verified
- [ ] share image readable at 1080×1080 and on mobile preview
- [ ] teacher comment not truncated
- [ ] official hashtag is `#CLEARシェアラボ`
- [ ] X / LINE / Web Share flows checked
- [ ] screenshot upload uses real server/storage
- [ ] privacy notice displayed
- [ ] upload validation exists server-side
- [ ] uploaded screenshots are private
- [ ] admin review flow exists
- [ ] duplicate/idempotency protections exist
- [ ] campaign code removed from client source
- [ ] code issued only after successful claim creation
- [ ] Clear deep link tested
- [ ] 375px mobile flow tested end-to-end
- [ ] iPhone Safari tested
- [ ] no new console errors
- [ ] failure paths tested

