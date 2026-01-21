import React, { useEffect, useRef, useState } from 'react';
import '@tensorflow/tfjs';
import * as tmPose from '@teachablemachine/pose';
import { useCamera } from './hooks/useCamera';
import { EyeContactAnalyzer } from './logic/EyeContactAnalyzer';
import classNames from 'classnames';
import { FaEye, FaEyeSlash, FaVideo, FaCog, FaChartBar } from 'react-icons/fa';
import './App.css';

// Constants
const MODEL_URL = '/model/'; // Path to model files in public/
const WARNING_DELAY = 0; // ms - Immediate response to bad posture

function App() {
  const { videoRef, stream, isLoading: isCameraLoading } = useCamera();
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [status, setStatus] = useState('camera_eye_contact');
  const [isContact, setIsContact] = useState(true); // NEW state
  const [isWarning, setIsWarning] = useState(false);
  const [stats, setStats] = useState({ notContactCount: 0, notContactDurationSec: 0, notContactRatio: 0 });
  
  // Settings
  const [isWarningEnabled, setIsWarningEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(true);
  
  // Check if opened in auto mode (from Meet detection)
  const [isAutoMode, setIsAutoMode] = useState(false);

  // Analyzer instance
  const analyzerRef = useRef(new EyeContactAnalyzer({ notContactThreshold: WARNING_DELAY }));
  const reqIdRef = useRef(null);

  // Detect auto mode from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const auto = urlParams.get('auto');
    if (auto === 'true') {
      setIsAutoMode(true);
      console.log('Auto mode enabled - minimal UI');
    }
  }, []);

  // Load Model
  useEffect(() => {
    async function loadModel() {
      try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        const m = await tmPose.load(modelURL, metadataURL);
        setModel(m);
        setIsModelLoading(false);
      } catch (err) {
        console.error("Failed to load model:", err);
      }
    }
    loadModel();
  }, []);

  // Auto-reset analyzer on mount (for fresh session)
  useEffect(() => {
    analyzerRef.current = new EyeContactAnalyzer({ notContactThreshold: WARNING_DELAY });
    console.log('Analyzer reset for new session');
  }, []);

  // Inference Loop - using setInterval instead of requestAnimationFrame
  // to ensure it continues running even when window is minimized
  useEffect(() => {
    if (!model || !videoRef.current || isCameraLoading) return;

    const loop = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          // Estimate pose via Teachable Machine standard method
          const { posenetOutput } = await model.estimatePose(videoRef.current, flipHorizontal);
          
          // Prediction
          const prediction = await model.predict(posenetOutput);

          // Analyze
          const result = analyzerRef.current.process(prediction);
          
          setStatus(result.status);
          setIsContact(result.isContact); 
          setIsWarning(result.isWarning);
          setStats(result.stats);

          // Debug info
          if (debugMode) {
            const best = prediction.reduce((p, c) => p.probability > c.probability ? p : c);
            setDebugInfo({ 
              rawClass: best.className, 
              confidence: (best.probability * 100).toFixed(1) + "%",
              all: prediction
            });
          }
        } catch (error) {
          console.error('Inference error:', error);
        }
      }
    };

    // Run inference every 100ms (10 FPS)
    const intervalId = setInterval(loop, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [model, isCameraLoading, debugMode, flipHorizontal]);

  // Share analysis results with Chrome Extension
  // Supports both standalone mode (external messaging) and extension mode (chrome.storage)
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime) return;
    
    const data = {
      isContact,
      status,
      isWarning,
      stats,
      timestamp: Date.now()
    };
    
    // Check if running inside extension (chrome.storage available)
    if (chrome.storage && chrome.storage.local) {
      // Extension mode: Use chrome.storage
      chrome.storage.local.set({ eyeContactStatus: data }, () => {
        if (chrome.runtime.lastError) {
          console.warn('Failed to write to chrome.storage:', chrome.runtime.lastError);
        } else if (debugMode) {
          console.log('✓ Shared via chrome.storage:', data);
        }
      });
    } else {
      // Standalone mode: Use external messaging
      const EXTENSION_ID = 'onecikddnejbkoapfekjghbkgeajebeb';
      chrome.runtime.sendMessage(EXTENSION_ID, {
        type: 'EYE_CONTACT_UPDATE',
        data: data
      }, (response) => {
        if (chrome.runtime.lastError) {
          if (debugMode) {
            console.log('Extension not available:', chrome.runtime.lastError.message);
          }
        } else if (debugMode) {
          console.log('✓ Shared via external messaging:', data);
        }
      });
    }
  }, [isContact, status, isWarning, stats, debugMode]);

  // Listen for reset signal from Chrome Extension (when meeting ends)
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) return;
    
    const handleStorageChange = (changes, area) => {
      if (area === 'local' && changes.resetStats && changes.resetStats.newValue === true) {
        console.log('Received reset signal from Chrome extension');
        handleReset();
        // Clear the reset flag
        chrome.storage.local.set({ resetStats: false });
      }
    };
    
    chrome.storage.onChanged.addListener(handleStorageChange);
    
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);


  const [debugInfo, setDebugInfo] = useState(null);

  // Handle Reset
  const handleReset = () => {
    analyzerRef.current.reset();
    setStats({ notContactCount: 0, notContactDurationSec: 0, notContactRatio: 0 });
    setIsWarning(false);
  };

  // Auto-minimize when ready in auto mode
  useEffect(() => {
    if (isAutoMode && !isCameraLoading && !isModelLoading) {
      // Wait 1 second to show "Ready" message, then minimize
      const timer = setTimeout(() => {
        // Minimize the window by moving it off-screen
        chrome.windows.getCurrent((win) => {
          chrome.windows.update(win.id, {
            state: 'minimized'
          });
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAutoMode, isCameraLoading, isModelLoading]);

  // Minimal UI for auto mode
  if (isAutoMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-6">
        {/* Hidden video for inference */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          style={{ display: 'none' }}
        />
        
        <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 backdrop-blur-sm max-w-sm w-full">
          <div className="text-center">
            {isCameraLoading && (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-3"></div>
                <p className="text-slate-300 font-medium">Starting camera...</p>
              </div>
            )}
            
            {!isCameraLoading && isModelLoading && (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-3"></div>
                <p className="text-slate-300 font-medium">Loading model...</p>
              </div>
            )}
            
            {!isCameraLoading && !isModelLoading && (
              <div>
                <div className="text-green-500 text-5xl mb-2">✓</div>
                <p className="text-green-400 font-semibold text-lg">Ready!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-5xl flex justify-between items-center mb-8 bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
          <FaVideo className="text-indigo-500" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Eye Contact Coach</span>
        </h1>
        <div className="flex items-center gap-4">
           {debugMode && (
             <label className="flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg text-sm transition-all font-medium select-none shadow-sm text-yellow-300 border-yellow-500/30">
              <input 
                type="checkbox" 
                checked={flipHorizontal} 
                onChange={(e) => setFlipHorizontal(e.target.checked)}
                className="accent-yellow-500 w-4 h-4"
              />
              Flip Input
            </label>
           )}

           <label className="flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg text-sm transition-all font-medium select-none shadow-sm">
            <input 
              type="checkbox" 
              checked={debugMode} 
              onChange={(e) => setDebugMode(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
            Debug
          </label>          
           <label className="flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg text-sm transition-all font-medium select-none shadow-sm">
            <input 
              type="checkbox" 
              checked={isWarningEnabled} 
              onChange={(e) => setIsWarningEnabled(e.target.checked)}
              className="accent-indigo-500 w-4 h-4"
            />
            Real-time Warning
          </label>
           <button 
             onClick={handleReset}
             className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg text-sm transition-all font-medium shadow-sm active:translate-y-0.5"
           >
             Reset Stats
           </button>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Helper Panel (Stats) */}
        <section className="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 h-fit lg:col-span-1 order-2 lg:order-1 flex flex-col gap-6">
          <h2 className="text-xl font-bold mb-2 text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-4">
             <FaChartBar className="text-indigo-400" /> Live Statistics
          </h2>
          
          <div className="space-y-4">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 shadow-inner">
              <span className="text-sm font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Looking Away</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-mono font-bold text-white">{stats.notContactCount}</span>
                <span className="text-sm text-slate-500 font-medium">times</span>
              </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 shadow-inner">
              <span className="text-sm font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Total Duration</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-mono font-bold text-white">{stats.notContactDurationSec}</span>
                <span className="text-sm text-slate-500 font-medium">seconds</span>
              </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 shadow-inner">
              <span className="text-sm font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Distraction Ratio</span>
              <div className="flex items-end gap-2 mb-2">
                 <span className={classNames("text-4xl font-mono font-bold transition-colors duration-300", {
                   "text-emerald-400": stats.notContactRatio < 10,
                   "text-amber-400": stats.notContactRatio >= 10 && stats.notContactRatio < 30,
                   "text-rose-400": stats.notContactRatio >= 30,
                 })}>
                   {stats.notContactRatio}%
                 </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={classNames("h-full rounded-full transition-all duration-500 ease-out", {
                    "bg-emerald-500": stats.notContactRatio < 10,
                    "bg-amber-500": stats.notContactRatio >= 10 && stats.notContactRatio < 30,
                    "bg-rose-500": stats.notContactRatio >= 30,
                  })}
                  style={{ width: `${Math.min(stats.notContactRatio, 100)}%` }} 
                />
              </div>
            </div>
            
            {debugMode && debugInfo && (
              <div className="bg-black/50 p-4 rounded-xl border border-indigo-500/50 text-xs font-mono">
                <p className="mb-2 font-bold text-indigo-300">DEBUG INFO</p>
                <p>Status: <span className="text-white">{status}</span></p>
                <p>Top Class: <span className="text-yellow-300">{debugInfo.rawClass}</span></p>
                <p>Confidence: <span className="text-yellow-300">{debugInfo.confidence}</span></p>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  {debugInfo.all.map(p => (
                    <div key={p.className} className="flex justify-between">
                      <span>{p.className}</span>
                      <span>{(p.probability * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Video Area */}
        <section className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video lg:col-span-2 order-1 lg:order-2 group ring-1 ring-slate-800">
          {/* Video Element */}
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover transform scale-x-[-1]" 
            muted 
            playsInline
          />

          {/* Loading State */}
          {(isCameraLoading || isModelLoading) && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
               <div className="flex flex-col items-center">
                 <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-indigo-300 font-medium">
                   {isCameraLoading ? "Starting Camera..." : "Loading Model..."}
                 </p>
               </div>
             </div>
          )}

          {/* Status Overlay */}
          <div className={classNames(
            "absolute top-4 left-4 px-4 py-2 rounded-lg backdrop-blur-md border shadow-lg transition-all duration-300 z-10 flex items-center gap-3",
            {
               "bg-emerald-500/20 border-emerald-500/50 text-emerald-200": isContact,
               "bg-rose-500/20 border-rose-500/50 text-rose-100": !isContact
            }
          )}>
            {isContact ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            <span className="font-semibold tracking-wide text-sm">
              {isContact ? "GOOD EYE CONTACT" : "LOOKING AWAY"}
            </span>
          </div>

          {/* Warning Overlay (Big Border) */}
          {isWarning && isWarningEnabled && (
            <div className="absolute inset-0 border-8 border-rose-500/60 z-10 pointer-events-none animate-pulse flex items-center justify-center">
               <div className="bg-rose-600 text-white px-6 py-3 rounded-full font-bold shadow-xl translate-y-[150px]">
                 ⚠️ Please look at the camera
               </div>
            </div>
          )}

        </section>

      </main>

       {/* Footer / Debug Info */}
       <footer className="mt-8 text-slate-500 text-xs text-center border-t border-slate-800 pt-4 w-full max-w-5xl">
         <p>Eye Contact Coach v0.1.0 • Powered by TensorFlow.js & Teachable Machine</p>
         {debugMode && <p>Raw Status: {status} | Warning: {String(isWarning)}</p>}
       </footer>
    </div>
  );
}

export default App;
