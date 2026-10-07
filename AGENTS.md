# AGENTS.md

## Project

Repository: `clear-share-lab`

This repository contains the **Clear シェアラボ** diagnostic/share experience.
The first content is **恋愛通知表**.

Before making any change, read this file and `PROJECT_SPEC.md`.
Treat the existing implementation and the specifications in these files as the source of truth.

Last updated: 2026-10-07

---

## 1. Working principles

- Do not redesign or restructure unrelated areas unless explicitly requested.
- Preserve the current visual identity, copy, diagnosis logic, and user flow.
- Prefer small, targeted diffs over broad rewrites.
- Do not replace working code merely to make it “cleaner” unless the change is necessary.
- Do not rename existing assets, IDs, classes, state keys, or public URLs without a clear reason.
- Do not remove existing mobile support.
- Do not change copy, labels, or hashtags unless specifically instructed.
- Do not add third-party libraries unless the task clearly requires them.
- Do not add new backend services or external dependencies without explaining why they are needed.

When a task is completed:

1. Implement the requested change.
2. Verify the affected flow.
3. Fix any regression caused by the change.
4. Re-test the same flow.
5. Commit the verified change when the task authorizes repository updates.
6. Push the commit and verify the GitHub Pages deployment.
7. Report what changed, what was tested, and any remaining risk.

Do not stop at “implemented” without verification.

For small and medium changes, complete the verification, commit, push, and GitHub Pages check in the same task when authorized. For major design changes, high-impact flow changes, or work that cannot be checked adequately from the Codex environment, report the limitation and request human verification before commit and push.

---

## 2. Current repository structure

Expected root structure:

```text
clear-share-lab/
├─ index.html
├─ app.js
├─ styles.css
├─ assets/
├─ AGENTS.md
└─ PROJECT_SPEC.md
```

Current app is a lightweight front-end implementation using plain HTML/CSS/JavaScript.
Avoid introducing a framework unless a future requirement genuinely needs one.

---

## 3. Current asset rules

Use the existing files under `assets/`.
Do not substitute generated or stock imagery without explicit approval.

Current assets include:

- `lab-background.webp`
- `ria-cupid.webp`
- `ria-dog.webp`
- `ria-princess.webp`
- `ria-detective.webp`
- `ria-devil.webp`
- `ria-cheer.webp`
- `ria-teacher.webp`
- `love-report-logo.webp`
- `clear-share-lab-logo.webp`
- `clear-ria-lockup.webp`
- `paper-report.webp`
- `paper-message-card.webp`
- `point-coin.webp`

Image proportions must not be distorted.
Use per-type sizing overrides when visual balance differs between character assets.

---

## 4. Brand and copy rules

Series name:

**Clear シェアラボ**

Official hashtag:

**#CLEARシェアラボ**

Use uppercase `CLEAR` consistently in the hashtag.
Do not revert to `#Clearシェアラボ`.

The first diagnosis is:

**恋愛通知表**

The visual priority is:

1. 恋愛通知表
2. 診断スタート / main user action
3. point/reward messaging
4. Clear シェアラボ branding

The Clear シェアラボ branding should support the experience, not overpower the 恋愛通知表 title.

---

## 5. Mobile-first requirements

Primary reference width: **375px**.

Also verify layouts at approximately:

- 390px
- 393px
- 414px
- 430px

Primary browsers/devices:

- iPhone Safari
- Android Chrome
- in-app/WebView-like environments where possible

Do not approve a visual change without checking the 375px layout.

Avoid:

- horizontal scrolling
- clipped text
- overlapping buttons
- character images protruding outside intended cards
- buttons too close to viewport edges
- unreadably small helper text

---

## 6. Diagnosis logic is fixed

The diagnosis has **5 questions** and **6 result types**.

Do not modify the scoring system, questions, answer scores, tie-break rules, result copy, or ratings unless explicitly requested.

Tie-break priority is:

1. highest total score
2. highest count of +2 primary selections
3. latest primary answer in this order: Q5 → Q4 → Q3 → Q2 → Q1

See `PROJECT_SPEC.md` for the full diagnosis specification.

---

## 7. Navigation and state

The current app uses hash navigation and `localStorage`.

Current storage key:

`clearShareLab_v1`

Do not break:

- back navigation
- restoring the diagnosis state
- returning from SNS sharing
- result rendering after reload

The current result/share/upload/code flow may be represented within the result page rather than separate full pages. Preserve the user-facing behavior unless a task explicitly changes it.

---

## 8. TOP screen design rules

Current intended order:

1. 恋愛通知表 logo
2. short explanation
3. “質問数 5問” / “所要時間 約1分”
4. 診断スタート button
5. combined **白衣リアちゃん＋CLEARシェアラボ** image
6. 100pt reward banner

The combined Clear シェアラボ image should sit **below the 診断スタート button** and be slightly more restrained than the main title/logo.

Do not restore a redundant standalone Clear シェアラボ logo above the 恋愛通知表 logo.

---

## 9. Result screen design rules

- Keep the result screen readable and report-card-like.
- The Clear シェアラボ mini logo belongs in the page header/top bar, not directly under the 恋愛通知表 logo inside the main result card.
- The 忠犬 character requires a per-type size adjustment if needed so it does not look larger than the other result characters.
- 総評 body copy should use a weight consistent with the other body copy.
- “先生からのひとこと” should remain readable and visually separated from the surrounding content.

Do not use oversized decorative elements that compete with the diagnosis result.

---

## 10. Share image rules

The share image is a 1080×1080 canvas.

It must include:

- 恋愛通知表 logo
- displayed name
- result character
- result type name
- catch copy
- 先生からのひとこと
- 5段階評価
- `#CLEARシェアラボ`
- `あなたは何タイプ？`
- Clear シェアラボ logo

Current layout requirements:

- The “氏名” label and displayed name are treated as one group and centered together.
- Remove the small redundant `タイプ` label above the result type name in the share image.
- The teacher heading and body copy must not look crowded against the top edge of the teacher card.
- Add comfortable spacing between `先生からのひとこと` and the body text.
- The teacher Ria image should be clearly recognizable, not tiny decorative filler.
- The bottom-right Clear シェアラボ logo should be large enough to read while remaining subordinate to the main content.
- The teacher comment should display fully; do not apply ellipsis/line-clamp truncation.
- Preserve a balanced bottom margin around hashtag, CTA copy, and logo.

Do not shrink text aggressively to solve layout issues. Prefer spacing and box adjustments first.

---

## 11. Share UX

Current share choices:

- Xでシェア
- LINEでシェア
- その他でシェア

Helper copy:

`X・LINEでは投稿画面で画像を添付してください。`

Use Web Share API with file sharing when supported.
Provide fallback behavior for browsers that cannot share files.

Do not restore the old “投稿できましたか？” confirmation step.

Desired flow:

result → share → screenshot → support contact → manual campaign code delivery → enter code in Clear

---

## 12. Reward flow

Reward: **100pt**

User-facing sequence:

1. Post result to SNS with `#CLEARシェアラボ`
2. Take a screenshot of the posted screen
3. Open the support contact page from the result screen
4. Send the screenshot through the support contact page
5. Receive a campaign code manually after review
6. Open Clear and enter the code

Current support contact destination:

`https://app-clear.com/open?act=page_contact`

Current main CTA:

**問い合わせ窓口へスクショを送る**

---

## 13. Upload / storage implementation rules

The current production-facing submission mode is `support`.

Keep `CAMPAIGN_SUBMISSION_MODE` set to `"support"` until the development team provides an approved storage and issuance plan. In support mode:

- do not show or run the image selection/upload UI
- do not store images on this site
- do not display or automatically issue a campaign code
- do not show a campaign-code input CTA or other code-entry guidance
- send users to `https://app-clear.com/open?act=page_contact`

The existing image selection, preview, mock upload, completion, campaign-code, copy, and point CTA code is retained for a possible future `upload` mode. Do not remove it, expose it in support mode, or add Google Drive, GAS, external storage, or automatic code issuance until the development team provides an approved plan.

The retained front-end upload implementation uses a mock upload. It is not production-ready.

Before production, replace it with real server-side storage and claim recording.

Required user-facing notice near upload:

**アップロードされた画像は、キャンペーン参加確認・不正利用防止のため、運営側で確認・保存する場合があります。**

Allowed image types:

- JPG/JPEG
- PNG
- WebP

Validation must happen server-side as well as client-side.
Do not trust browser-provided MIME/type alone.

Validate:

- actual content type
- file size
- image dimensions
- damaged/zero-byte files
- suspicious/executable content

Use server-generated filenames.
Prefer EXIF removal/re-encoding where practical.

---

## 14. Security / anti-abuse rules

### Critical

Do **not** keep the production campaign code in client-side JavaScript.
The retained upload-mode UI must receive any future campaign code from an approved server flow. `CAMPAIGN_CODE` currently has no value in `app.js`.

The production flow should be:

1. screenshot upload succeeds
2. server/storage write succeeds
3. claim record succeeds
4. eligibility/idempotency check succeeds
5. only then return/display a campaign code

Never display or issue a code after an upload/storage/database failure.

Server-side protections should include:

- idempotent claim creation
- duplicate-click protection
- multi-tab protection
- reload/back-navigation protection
- duplicate screenshot hash flagging
- per-account/per-campaign redemption control where possible
- protected admin access
- non-public image storage
- no direct predictable image URLs
- no IDOR access to other users’ uploads

An identical image hash is a review signal, not automatic proof of fraud.

A screenshot alone does not prove that the post belongs to the uploader or remains publicly posted. Treat screenshot review as one layer of protection, not the only one.

---

## 15. Admin review requirements

Future admin review should support:

List view:

- thumbnail
- upload date/time
- displayed name
- diagnosis type
- account/user identifier where safely available
- status

Detail view:

- uploaded image
- campaign/claim information
- campaign code issuance state
- status changes
- admin notes
- last review time

Statuses:

- 未確認
- 確認済み
- 要確認
- 不正疑い

Uploaded images must not be publicly browsable.
Retention period should be configurable rather than indefinite.

---

## 16. Regression checklist

After any meaningful change, verify at minimum:

### Diagnosis
- TOP loads
- 診断スタート works
- all 5 questions progress correctly
- back navigation works
- name input works
- correct result renders

### Result/share
- all 6 result types can render
- character images load
- share image generates
- name is centered correctly
- teacher comment is complete
- rating stars render correctly
- share buttons work or fall back correctly

### Current support/reward
- support submission heading and CTA are visible
- support CTA points to `https://app-clear.com/open?act=page_contact`
- later manual code delivery and the one-account limit are explained
- image selection/upload controls and completion UI are not visible
- campaign code value, code copy, point CTA, and code-entry guidance are not visible

### Future upload mode
- upload button disabled with no file
- invalid file handling works
- failure does not reveal a campaign code
- successful production upload is required before code issuance
- Clear deep link works

### Mobile
- 375px layout has no overflow or overlap
- iPhone Safari flow is usable

### Console
- no new uncaught JavaScript errors
- no failed asset requests introduced by the change

---

## 17. Do not silently change product decisions

If a requested technical change conflicts with these fixed decisions, point it out before changing behavior.

Do not silently:

- change the hashtag
- alter diagnosis scoring
- replace approved copy
- change reward amount
- remove the screenshot submission requirement
- expose a campaign code client-side
- turn uploaded images public
- add tracking/analytics scripts
- change external links
