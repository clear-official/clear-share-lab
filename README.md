# Clear シェアラボ

GitHub Pages: https://clear-official.github.io/clear-share-lab/

- `/`：第1回「恋愛通知表」
- `/recipe/`：第2回「私の隠しレシピ診断」

両コンテンツは静的な HTML・CSS・JavaScript で動作します。画像などの正式素材は `assets/` にあります。

## 別端末で作業を再開する

```sh
git clone https://github.com/clear-official/clear-share-lab.git
cd clear-share-lab
python -m http.server 8000
```

ブラウザで `http://localhost:8000/recipe/` を開きます。第1回は `http://localhost:8000/` です。ローカルサーバーを使うと保存カードの画像生成も確認できます。

第2回の主な編集箇所：

| ファイル | 内容 |
| --- | --- |
| `recipe/content.js` | 7問、A〜Fの確定文言、判定・次点タイプの処理 |
| `recipe/app.js` | 画面表示、シェア、保存カードのCanvas描画 |
| `recipe/styles.css` | スマホを含む画面レイアウト |
| `recipe/verify.mjs` | 判定16,384通り、画面とカード描画の検証 |
| `recipe/CONTENT_NEEDED.md` | 第2回の素材とローカルプレビューの説明 |

Node.js がある端末では `node recipe/verify.mjs` で検証できます。ローカル環境に限り、`/recipe/?preview=result-A&flavor=F` のように主結果と次点タイプを指定できます。`result-A`〜`result-F`、`share-A`〜`share-F`、`q-1`〜`q-7` を確認できます。公開サイトではプレビュー指定は無効です。

公開は GitHub の `main` ブランチから行います。変更後は検証して `main` に反映し、上記の公開URLで表示と保存動作を確認してください。第1回の仕様は `AGENTS.md` と `PROJECT_SPEC.md` を参照してください。
