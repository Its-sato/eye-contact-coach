import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChrome, FaGithub, FaVideo, FaChartBar, FaCog, FaDownload, FaTimes, FaCheck, FaStar } from 'react-icons/fa';
import ScreenshotCarousel from '../components/ScreenshotCarousel';

function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Version Selection Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <div className="text-center pt-4 pb-3 px-4 border-b border-slate-800">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                使い方を選択
              </h2>
            </div>

            {/* Comparison Grid */}
            <div className="grid md:grid-cols-2 gap-3 p-4">
              {/* Chrome Extension - RECOMMENDED */}
              <div className="relative group">
                {/* Recommended Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    <FaStar className="text-yellow-300" />
                    おすすめ
                  </div>
                </div>


                <div className="bg-slate-950 rounded-xl border-2 border-indigo-500/50 p-4 h-full flex flex-col hover:border-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
                  {/* Icon & Title */}
                  <div className="text-center mb-2">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <FaChrome className="text-2xl text-indigo-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">Chrome拡張機能版</h3>
                  </div>

                  {/* Pros */}
                  <div className="mb-2 flex-grow">
                    <ul className="space-y-0.5 text-xs text-slate-300">
                      <li>✓ Meet自動統合・オーバーレイ</li>
                      <li>✓ 自動レポート・統計保存</li>
                      <li className="text-slate-500 text-[10px] mt-1">※インストール3分/Chrome限定</li>
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/install"
                    onClick={() => setShowModal(false)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-4 rounded-xl font-bold text-center transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    インストール方法を見る
                  </Link>
                </div>
              </div>

              {/* Web Version */}
              <div className="relative">
                <div className="bg-slate-950 rounded-xl border border-slate-700 p-4 h-full flex flex-col hover:border-slate-600 transition-all">
                  {/* Icon & Title */}
                  <div className="text-center mb-2">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <FaVideo className="text-2xl text-cyan-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">Web版</h3>
                  </div>

                  {/* Pros */}
                  <div className="mb-2 flex-grow">
                    <ul className="space-y-0.5 text-xs text-slate-300">
                      <li>✓ インストール不要</li>
                      <li>✓ 基本機能を体験</li>
                      <li className="text-slate-500 text-[10px] mt-1">※Meet連携・自動保存なし</li>
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/demo"
                    onClick={() => setShowModal(false)}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                  >
                    <FaVideo />
                    Web版を試す
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="px-4 pb-3 text-center">
              <p className="text-xs text-slate-500">
                💡 本格利用は<strong className="text-indigo-400">Chrome拡張機能版</strong>推奨
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-indigo-400 transition">
            <FaVideo className="text-indigo-400" />
            <span>Eye Contact Coach</span>
          </Link>
          <div className="hidden md:flex gap-8 text-slate-300 text-sm font-medium">
            <a href="#features" className="hover:text-indigo-400 transition">機能</a>
            <a href="#demo" className="hover:text-indigo-400 transition">デモ画面</a>
            <a href="#installation" className="hover:text-indigo-400 transition">インストール</a>
            <a href="#usage" className="hover:text-indigo-400 transition">使い方</a>
          </div>
          <Link
            to="/demo"
            className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-indigo-500/20"
          >
            Web版で試す
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-center pt-32 pb-24 bg-slate-950 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[2px]" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v1.0.1 Now Available
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-cyan-400 mb-8 tracking-tight leading-tight">
            Eye Contact Coach
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            ビデオ会議の印象を、AIが変える。<br />
            リアルタイムの姿勢分析で、あなたのコミュニケーションをサポート。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setShowModal(true)}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.8)] shadow-2xl"
            >
              <FaDownload className="group-hover:scale-110 transition-transform" /> 
              <span>使ってみる</span>
            </button>
            <a 
              href="https://github.com/Its-sato/eye-contact-coach" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 text-slate-300 hover:text-white px-6 py-3 rounded-full font-medium text-lg transition-all hover:bg-slate-800/50 backdrop-blur-sm"
            >
              <FaGithub /> 
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative py-24 bg-slate-900 scroll-mt-20 border-y border-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider mb-4 uppercase">
              Demo Preview
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              実際の画面
            </h2>
            <p className="text-slate-400 text-lg">シンプルなオーバーレイで、会議の邪魔をしません</p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <ScreenshotCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-950 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider mb-4 uppercase">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">主な機能</h2>
            <p className="text-slate-400 text-lg">AI技術を活用した高度な分析機能</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="text-xl font-bold mb-4 text-slate-100">リアルタイム分析</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  ブラウザ上で動作する軽量AIモデルが、あなたの姿勢と視線をリアルタイムで解析。プライバシーを守りながら、即座にフィードバックを提供します。
                </p>
              </div>
            </div>
            
            <div className="group bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-xl font-bold mb-4 text-slate-100">詳細な統計レポート</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  会議終了後に、アイコンタクトの頻度や姿勢の変化をグラフで可視化。自分の癖を客観的なデータとして振り返ることができます。
                </p>
              </div>
            </div>
            
            <div className="group bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">⚙️</div>
                <h3 className="text-xl font-bold mb-4 text-slate-100">完全なカスタマイズ</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  通知の感度、表示位置、警告のタイミングなどを自由に設定可能。あなたの作業環境に合わせて最適化できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section id="installation" className="py-24 bg-slate-900 scroll-mt-20 border-y border-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-wider mb-4 uppercase">
                Getting Started
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">インストール手順</h2>
              <p className="text-slate-400 text-lg">わずか3ステップで利用開始できます</p>
            </div>
            
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-[28px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-cyan-500 to-slate-800 md:left-1/2 md:-ml-px hidden md:block"></div>

              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  <div className="flex-1 md:text-right">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-indigo-500/30 transition-colors">
                      <h3 className="text-lg font-bold mb-2 text-indigo-400">Step 1</h3>
                      <h4 className="text-xl font-bold mb-3">拡張機能をダウンロード</h4>
                      <p className="text-slate-400 text-sm mb-4">
                        GitHubのリリースページから最新の<br/><code className="bg-slate-800 px-2 py-1 rounded text-xs mx-1 text-slate-300">chrome-extension.zip</code>をダウンロードし、解凍します。
                      </p>
                      <a href="https://github.com/Its-sato/eye-contact-coach/releases/latest" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm">
                        <FaGithub /> GitHubリリースページ <span className="text-xs">↗</span>
                      </a>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 z-10 w-14 h-14 bg-slate-900 border-4 border-indigo-500 rounded-full flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)]">1</div>
                  <div className="flex-1 hidden md:block"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  <div className="flex-1 hidden md:block"></div>
                  <div className="relative flex-shrink-0 z-10 w-14 h-14 bg-slate-900 border-4 border-cyan-500 rounded-full flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)]">2</div>
                  <div className="flex-1">
                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-cyan-500/30 transition-colors">
                      <h3 className="text-lg font-bold mb-2 text-cyan-400">Step 2</h3>
                      <h4 className="text-xl font-bold mb-3">拡張機能ページを開く</h4>
                      <p className="text-slate-400 text-sm">
                        Chromeのアドレスバーに<br/><code className="bg-slate-800 px-2 py-1 rounded text-xs mx-1 text-slate-300">chrome://extensions</code>と入力して開きます。
                        <br /><span className="text-xs opacity-60 mt-2 block">（または メニュー &gt; 拡張機能 &gt; 拡張機能を管理）</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  <div className="flex-1 md:text-right">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-purple-500/30 transition-colors">
                      <h3 className="text-lg font-bold mb-2 text-purple-400">Step 3</h3>
                      <h4 className="text-xl font-bold mb-3">読み込みと有効化</h4>
                      <p className="text-slate-400 text-sm">
                        右上の「デベロッパーモード」をONにし、「パッケージ化されていない拡張機能を読み込む」から、解凍したフォルダを選択します。
                      </p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0 z-10 w-14 h-14 bg-slate-900 border-4 border-purple-500 rounded-full flex items-center justify-center text-xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)]">3</div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              </div>
              
              <div className="mt-16 text-center">
                <div className="inline-flex items-center gap-3 bg-green-500/10 text-green-400 px-8 py-4 rounded-full border border-green-500/20 shadow-lg shadow-green-500/10">
                  <span className="text-2xl">🎉</span>
                  <div className="text-left">
                    <div className="font-bold">準備完了！</div>
                    <div className="text-sm opacity-80">Google Meetを開くと自動的に起動します</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="usage" className="py-24 bg-slate-950 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-wider mb-4 uppercase">
                Usage
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">使い方</h2>
              <p className="text-slate-400 text-lg">特別な操作は必要ありません</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex gap-5 hover:bg-slate-900/80 transition-colors">
                <div className="text-4xl p-3 bg-slate-950 rounded-2xl h-fit">🚀</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">自動起動</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Google MeetやZoomに参加すると、自動で機能がONになります。設定で手動への切り替えも可能です。</p>
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex gap-5 hover:bg-slate-900/80 transition-colors">
                <div className="text-4xl p-3 bg-slate-950 rounded-2xl h-fit">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">リアルタイム警告</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">姿勢が悪くなったり、カメラから目を離すと優しく通知します。通知のタイミングは調整可能です。</p>
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex gap-5 hover:bg-slate-900/80 transition-colors">
                <div className="text-4xl p-3 bg-slate-950 rounded-2xl h-fit">📈</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">分析レポート</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">会議終了後、あなたのパフォーマンスを分析したレポートが表示されます。日々の改善に役立てましょう。</p>
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 flex gap-5 hover:bg-slate-900/80 transition-colors">
                <div className="text-4xl p-3 bg-slate-950 rounded-2xl h-fit">🔒</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-100">プライバシー重視</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">映像データは全てユーザーのブラウザ内で処理され、外部サーバーには一切送信されません。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-950 border-t border-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="relative max-w-4xl mx-auto text-center overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 p-12 md:p-20 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">
                あなたのオンライン会議を、<br/>もっと魅力的に。
              </h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                Eye Contact Coachはオープンソースで開発されています。<br/>
                今すぐ無料でダウンロードして、違いを体験してください。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://github.com/Its-sato/eye-contact-coach/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-indigo-900 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105"
                >
                  <FaDownload />
                  今すぐダウンロード
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl mb-6 text-slate-200">
            <FaVideo className="text-indigo-500" />
            <span>Eye Contact Coach</span>
          </div>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            より良いオンラインコミュニケーションのためのオープンソースプロジェクト
          </p>
          <div className="flex justify-center gap-8 mb-8">
            <a href="https://github.com/Its-sato/eye-contact-coach" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition transform hover:scale-110">
              <FaGithub className="text-3xl" />
            </a>
          </div>
          <div className="text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} Eye Contact Coach. MIT License.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
