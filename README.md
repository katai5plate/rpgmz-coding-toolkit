# rpgmz-coding-toolkit

ツクール MZ 専用プログラミングツールキット

## 使用準備

0. Node.js をインストールする
1. `./game` ディレクトリにゲームプロジェクトを入れる。`.gitkeep` ファイルと同じ階層に `index.html` がある状態にする。
2. `npm install` を実行
3. `npm run analyze` を実行。すると`./analyze`が生成される。
4. `npm run separate` を実行。すると`./separate`が生成される。

## コマンド一覧

### `npm run analyze`

- コアスクリプトのクラス構造を解析した JSON データを生成する。
- 生成時の挙動:
  - ポート 3030 でゲームが起動
  - Chromium が立ち上がる
  - Chromium 経由で各クラスを解析
  - 解析を終えると Chromium を終了
  - ポート 3030 を開放

### `npm run separate`

- コアスクリプトを各クラスごとに分割した JS ファイルを生成する。
