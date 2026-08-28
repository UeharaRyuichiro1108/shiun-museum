# 志雲町立博物館

一次創作「愛館市立郷土資料館」の世界観を基盤とした、志雲町立博物館（しうんちょうりつはくぶつかん）のキャラクター紹介サイトです。

## ローカル確認

```bash
npm install
npm run dev
```

## Cloudflare 自動公開

Cloudflare Workers の「Git リポジトリをインポート」でこのGitHubリポジトリを選び、ビルドコマンドを `npm run build`、デプロイコマンドを `npx wrangler deploy` に設定します。以後は `main` ブランチへの更新が自動公開されます。

## キャラクターを追加する方法

1. `content/characters/_template.md.example` を複製します。
2. 複製したファイル名を `新しいid.md` に変更します（例：`aoi.md`）。
3. ファイル上部の各項目と、`---` より下の紹介文を編集します。
4. 画像を `public/images/characters/` に保存し、Markdownの `listImage` と `detailImage` にパスを書きます。`detailImage` の画像は詳細ページの設定一覧の一番下にある「デザイン画」欄にも表示されます。
5. 変更をコミットして `main` ブランチへプッシュします。

`id` は半角英数字とハイフンだけで、ほかのキャラクターと重複しない値にします。`order` の数字が小さいキャラクターから一覧へ表示されます。

作成者名と元ポストは次の項目へ記載します。ポストがない場合は `postUrl: ""` としてください。

```md
creator: "作成者名"
postUrl: "https://x.com/ユーザー名/status/ポスト番号"
```

FA・3L・深い関係・NG・作者からひと言は、次の項目へ記載します。

```md
fa: "FAについて"
threeL: "3Lについて"
deepRelationship: "深い関係について"
ng: "NG事項"
creatorComment: "作者からひと言"
```

文章を二行以上にしたい場合は、改行したい位置へ `\n` を記載できます。

相関関係は次の形式で追加できます。

```md
relationships:
  - "相手のid|関係の説明"
  - "別の相手のid|別の説明"
```

相手側から見た関係も表示したい場合は、相手のMarkdownにも逆方向の関係を記載してください。

関係文を二行にしたい場合は、改行したい位置へ `\n` を記載します。

```md
relationships:
  - "相手のid|一行目の文章\n二行目の文章"
```

## お知らせを追加する方法

1. `content/news/_template.md.example` を複製します。
2. 複製したファイル名を `日付-短い名前.md` に変更します（例：`2026-09-01-character.md`）。
3. `date` と `title` を編集します。
4. 変更をコミットして `main` ブランチへプッシュします。

```md
---
date: "2026-09-01"
title: "新しいキャラクターを追加しました"
---
```

日付は `年-月-日` の形式で記載してください。サイトでは新しい日付のお知らせから順番に表示されます。

## イラスト（上原）を追加する方法

1. 画像を `public/images/art/` に保存します。
2. `content/illustrations/uehara/_template.md.example` を複製し、任意の半角英数字のファイル名へ変更します。
3. 次の内容を編集してコミットします。

```md
---
order: 10
title: "イラストのタイトル"
image: "/images/art/画像ファイル名.webp"
---
```

## イラスト（参加者）を追加する方法

1. 画像を `public/images/gift/` に保存します。
2. `content/illustrations/participants/_template.md.example` を複製し、任意の半角英数字のファイル名へ変更します。
3. 次の内容を編集してコミットします。

```md
---
order: 10
creator: "作者名"
image: "/images/gift/画像ファイル名.webp"
postUrl: "https://x.com/ユーザー名/status/ポスト番号"
---
```

どちらもイラスト1件につきMarkdownを1ファイル作成します。`order` の数字が小さい作品から一覧へ表示されます。参加者作品にポストURLがない場合は `postUrl: ""` としてください。
