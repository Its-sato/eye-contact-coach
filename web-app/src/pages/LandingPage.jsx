import React from 'react';
import { Link } from 'react-router-dom';
import { FaChrome, FaGithub, FaVideo, FaChartBar, FaCog, FaDownload } from 'react-icons/fa';
import ScreenshotCarousel from '../components/ScreenshotCarousel';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-center py-24 bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/featured/1600x900?technology')" }}>
  <div className="absolute inset-0 bg-black/50" />
  <div className="relative z-10 max-w-3xl mx-auto px-4">
    <FaVideo className="text-6xl text-indigo-400 mx-auto mb-6" />
    <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 mb-6">
      Eye Contact Coach
    </h1>
    <p className="text-xl md:text-2xl text-slate-300 mb-8">
      ビデオ会議中のアイコンタクトを改善するChrome拡張機能
    </p>
    <p className="text-lg text-slate-400 mb-12">
      AIがリアルタイムで姿勢を分析し、快適なコミュニケーションをサポートします
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="https://github.com/Its-sato/eye-contact-coach/releases/latest" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
        <FaDownload /> 拡張機能をダウンロード
      </a>
      <Link to="/demo" className="inline-flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all">
        <FaVideo /> Webアプリで試す
      </Link>
    </div>
  </div>
</section>

<section className="container mx-auto px-6 py-12">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">デモ画面</h2>
  <ScreenshotCarousel />
</section>

          <div className="flex justify-center mb-6">
            <FaVideo className="text-6xl text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">
            Eye Contact Coach
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            ビデオ会議中のアイコンタクトを改善するChrome拡張機能
          </p>
          <p className="text-lg text-slate-400 mb-12">
            AIがリアルタイムであなたの姿勢を分析し、より良いコミュニケーションをサポートします
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/Its-sato/eye-contact-coach/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FaDownload />
              拡張機能をダウンロード
            </a>
            <Link
              to="/demo"
              className="inline-flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              <FaVideo />
              Webアプリで試す
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">主な機能</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
            <div className="text-4xl mb-4 text-indigo-400">🎯</div>
            <h3 className="text-xl font-bold mb-3">リアルタイム分析</h3>
            <p className="text-slate-400">
              AIがカメラ映像から姿勢を分析し、即座にフィードバックを提供します
            </p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
            <div className="text-4xl mb-4 text-cyan-400">📊</div>
            <h3 className="text-xl font-bold mb-3">詳細な統計</h3>
            <p className="text-slate-400">
              セッション時間、気が散った回数、姿勢の分布を円グラフで可視化
            </p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
            <div className="text-4xl mb-4 text-purple-400">⚙️</div>
            <h3 className="text-xl font-bold mb-3">カスタマイズ可能</h3>
            <p className="text-slate-400">
              警告のしきい値、オーバーレイの位置、表示項目を自由に設定
            </p>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">インストール方法</h2>
          
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">拡張機能をダウンロード</h3>
                  <p className="text-slate-400 mb-3">
                    GitHubのリリースページから最新版の<code className="bg-slate-800 px-2 py-1 rounded">chrome-extension.zip</code>をダウンロードします。
                  </p>
                  <a
                    href="https://github.com/Its-sato/eye-contact-coach/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                  >
                    <FaGithub />
                    GitHubリリースページ →
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ZIPファイルを解凍</h3>
                  <p className="text-slate-400">
                    ダウンロードしたZIPファイルを任意の場所に解凍します。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Chrome拡張機能ページを開く</h3>
                  <p className="text-slate-400 mb-2">
                    Chromeで<code className="bg-slate-800 px-2 py-1 rounded">chrome://extensions</code>を開きます。
                  </p>
                  <p className="text-slate-400">
                    または、メニュー → その他のツール → 拡張機能
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">デベロッパーモードをON</h3>
                  <p className="text-slate-400">
                    右上の「デベロッパーモード」トグルをONにします。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">拡張機能を読み込む</h3>
                  <p className="text-slate-400 mb-2">
                    「パッケージ化されていない拡張機能を読み込む」をクリックします。
                  </p>
                  <p className="text-slate-400">
                    解凍したフォルダを選択してください。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">完了！</h3>
                  <p className="text-slate-400">
                    Google Meetを開くと、自動的に分析が開始されます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">使い方</h2>
          
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                自動起動
              </h3>
              <p className="text-slate-400">
                Google MeetやZoomの会議に参加すると、自動的にカメラとAIモデルが起動します。
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                リアルタイム分析
              </h3>
              <p className="text-slate-400">
                画面右上（設定で変更可能）にオーバーレイが表示され、統計情報がリアルタイムで更新されます。
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                即座の通知
              </h3>
              <p className="text-slate-400">
                カメラから目を離すと、即座に警告が表示されます（3秒後に自動的に消えます）。
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                セッションサマリー
              </h3>
              <p className="text-slate-400">
                会議終了後、自動的に詳細な統計サマリーが表示されます。姿勢の分布を円グラフで確認できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-indigo-900/50 to-cyan-900/50 backdrop-blur-sm p-12 rounded-2xl border border-indigo-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            今すぐ始めましょう
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            まずはWebアプリ版で試してみて、気に入ったら拡張機能をインストールしてください
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <FaVideo />
              Webアプリで試す
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-6 text-center text-slate-400">
          <p>Eye Contact Coach - ビデオ会議のコミュニケーションを改善</p>
          <div className="flex justify-center gap-6 mt-4">
            <a
              href="https://github.com/Its-sato/eye-contact-coach"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition"
            >
              <FaGithub className="text-2xl" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
