import React from 'react';
import { Link } from 'react-router-dom';
import { FaDownload, FaChrome, FaCheckCircle, FaArrowRight, FaHome } from 'react-icons/fa';

function InstallationGuide() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold hover:text-indigo-400 transition">
            <FaHome />
            <span>ホームに戻る</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Chrome拡張機能のインストール方法
          </h1>
          <p className="text-slate-400 text-lg">
            3つの簡単なステップで始められます
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-indigo-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-indigo-400">拡張機能をダウンロード</h2>
                <p className="text-slate-300 mb-4">
                  GitHubから最新版の拡張機能ファイルをダウンロードします。
                </p>
                <a
                  href="https://github.com/Its-sato/eye-contact-coach/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  <FaDownload />
                  GitHubからダウンロード
                </a>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400">
                    💡 <strong>ヒント:</strong> ダウンロードしたZIPファイルを解凍してください。<br/>
                    解凍すると「chrome-extension」というフォルダができます。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-cyan-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Chrome拡張機能ページを開く</h2>
                <p className="text-slate-300 mb-4">
                  Chromeブラウザで拡張機能の管理ページを開きます。
                </p>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm font-bold text-white mb-2">方法1: アドレスバーから</p>
                    <code className="block bg-slate-950 px-4 py-2 rounded text-indigo-300 font-mono">
                      chrome://extensions
                    </code>
                    <p className="text-xs text-slate-500 mt-2">
                      ↑ これをコピーしてアドレスバーに貼り付けてEnter
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm font-bold text-white mb-2">方法2: メニューから</p>
                    <p className="text-sm text-slate-400">
                      Chrome右上の「⋮」→「拡張機能」→「拡張機能を管理」
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-purple-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">拡張機能を読み込む</h2>
                <p className="text-slate-300 mb-4">
                  解凍したフォルダを読み込んで、拡張機能を有効化します。
                </p>
                <ol className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>右上の「デベロッパーモード」をONにする</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>「パッケージ化されていない拡張機能を読み込む」をクリック</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>解凍した「chrome-extension」フォルダを選択</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Success */}
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-8 border border-green-500/30">
            <div className="flex items-center gap-4 mb-4">
              <FaCheckCircle className="text-4xl text-green-400" />
              <h2 className="text-2xl font-bold text-green-400">インストール完了!</h2>
            </div>
            <p className="text-slate-300 mb-4">
              これでGoogle Meetを開くと、自動的にEye Contact Coachが起動します。
            </p>
            <div className="flex gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                <FaHome />
                ホームに戻る
              </Link>
              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                Google Meetで試す
                <FaArrowRight />
              </a>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-12 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold mb-3 text-slate-200">うまくいかない場合</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• ZIPファイルを解凍したか確認してください</li>
            <li>• 「デベロッパーモード」がONになっているか確認してください</li>
            <li>• Chromeブラウザを使用しているか確認してください（Edge、Braveでも動作します）</li>
            <li>• 問題が解決しない場合は、<a href="https://github.com/Its-sato/eye-contact-coach/issues" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">GitHubのIssue</a>で報告してください</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default InstallationGuide;
