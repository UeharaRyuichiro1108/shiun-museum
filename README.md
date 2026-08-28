# 志雲町立博物館

一次創作「愛館市立郷土資料館」の世界観を基盤とした、志雲町立博物館（しうんちょうりつはくぶつかん）のキャラクター紹介サイトです。

## ローカル確認

```bash
npm install
npm run dev
```

## Cloudflare 自動公開

Cloudflare Workers の「Git リポジトリをインポート」でこのGitHubリポジトリを選び、ビルドコマンドを `npm run build`、デプロイコマンドを `npx wrangler deploy` に設定します。以後は `main` ブランチへの更新が自動公開されます。
