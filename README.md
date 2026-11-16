# ReLog

Next.js製のブログ・ポートフォリオです。記事、画像、著者、タグはEmDashで管理します。

## 構成

- ルート: 既存のNext.js画面。トップと記事をリクエストごとに取得し、公開・更新・公開取り消しを再ビルドなしで反映します。
- cms/: EmDash 1.5 + AstroのNode.jsアプリ。SQLiteとアップロードファイルを永続保存します。
- /_emdash/admin: 管理画面。Next.jsからCMSへプロキシします。
- _contents/: Pages CMS時代の移行元。移行後の編集内容はEmDashのDBに保存されます。

## 初回起動

Node.js 24以上とpnpm 9.3を使います。リポジトリのルートで実行してください。

~~~sh
pnpm install --frozen-lockfile
npm --prefix cms ci
~~~

ルートに .env.local を作成します（.env.example が見本です）。

~~~dotenv
EMDASH_URL=http://127.0.0.1:4321
~~~

CMSの暗号鍵を生成します。一度生成した鍵はDBと一緒にバックアップしてください。

~~~sh
cd cms
npx emdash secrets generate --write .env
cd ..
~~~

cms/.env に、管理画面を開く公開URLも追記します。

~~~dotenv
EMDASH_SITE_URL=http://localhost:3112
~~~

既存の記事・下書き・著者・タグ・画像をインポートします。

~~~sh
npm --prefix cms run migrate
~~~

このコマンドは移行元MDXを読み取り、cms/.emdash/ にシードと画像を準備し、cms/data.db と cms/uploads/ へ取り込みます。元ファイルを変更しません。同じコマンドを再実行しても既存の編集内容を上書きしません。

別々のターミナルで起動します。

~~~sh
npm --prefix cms run dev
~~~

~~~sh
pnpm dev
~~~

http://localhost:3112/_emdash/admin を開き、初回ウィザードで管理者アカウントとパスキーを作成してください。ブログは http://localhost:3112 です。

## 記事の編集

「記事」でタイトル・本文・画像・日時・著者・タグを編集し、公開します。下書き保存だけではブログに反映されません。公開を取り消すと、トップの一覧と記事URLの両方から外れます。

記事URLのスラッグは移行前と同じです。新しい記事はEmDashで指定したスラッグをそのまま使います。既存の非公開記事も下書きで移行します。

本文はEmDashのリッチテキスト形式です。MDXのJavaScriptは実行しません。既存の tips ディレクティブは引用、br ディレクティブは空行へ変換します。コードとファイル名、表、画像を取り込みます。MDX固有の行ハイライト指定は移行しません。新しい独自JSXコンポーネントや実行スクリプトを本文に追加する運用には対応しません。

著者名・アイコンは従来どおり記事ごとに保持します。「著者」はプロフィールの保管先で、プロフィールを変更しても過去記事の著者情報は自動変更されません。

## 本番への切り替え

Next.jsは従来のホストを継続できます。CMS用にNode.js 24以上の永続ディスクがあるサーバーを用意してください。SQLiteとアップロード画像を、一時的なサーバーレス領域に保存しないでください。

1. 上記のインストール・暗号鍵生成・移行をCMSサーバーで実行します。
2. CMSの環境変数 EMDASH_SITE_URL をブログの公開オリジン（例: https://rikusen.dev）に設定します。
3. cms/data.db、cms/uploads/、暗号鍵を永続化・バックアップします。保存先は EMDASH_DATABASE_URL と EMDASH_UPLOADS_DIR でも指定できます。初回移行CLIの保存先は cms/data.db と cms/uploads/ です。別の保存先を使う場合は初回移行後、起動前にこの2つを移してください。
4. CMSをビルドして常駐させます。以下はリポジトリのルートで実行します。

~~~sh
npm --prefix cms run build
npm --prefix cms start
~~~

5. Next.jsのビルド時と実行時の両方に EMDASH_URL を設定します。値はNext.jsサーバーから到達できるCMSのオリジンです（例: https://cms.example.com）。末尾にパスを付けないでください。
6. Next.jsをビルド・デプロイします。

~~~sh
pnpm build
pnpm start
~~~

管理画面とメディアの /_emdash/、CMSの /_astro/ はNext.js経由で配信します。リバースプロキシを使う場合もこの2つのパスを通してください。CMSのDB接続先を変更しても、記事の公開URLは変わりません。

設定漏れやCMS障害時はエラーとして扱います。古いMDXへの自動フォールバックは行いません。切り替え前にCMSを起動して既存3記事・画像・下書きの非公開状態を確認してください。Pages CMSのGitHub Appは、切り替え後に不要であればGitHubの設定から接続解除できます。

## 検証

~~~sh
node --test tests/emdash-client.test.mjs
npm --prefix cms test
npm --prefix cms run typecheck
npm --prefix cms run build
pnpm build
node scripts/smoke-emdash.mjs
~~~

最後のスモークテストは移行済みDBの一時コピーと両アプリのビルドを使い、ローカルの4321・3112ポートで起動して一覧・記事・画像・非公開記事の404・管理画面プロキシを確認します。起動後の記事作成・公開・下書きの非公開・更新・公開取り消しも確認し、元のDBは変更しません。実行前に同じポートの開発サーバーを停止してください。GitHub Actionsでも同じ確認を行います。
