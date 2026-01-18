// offscreen.js

let model;
let webcam;
let analyzer;
let isRunning = false;
let intervalId = null;

const MODEL_URL = chrome.runtime.getURL("model/");

async function init() {
  if (isRunning) return;

  try {
    console.log("Eye Contact Coach: Starting initialization...");
    
    // 0. Setup Backend - Use CPU backend
    console.log("Eye Contact Coach: Setting CPU backend...");
    await tf.setBackend("cpu");
    await tf.ready();
    console.log("Eye Contact Coach: Backend ready:", tf.getBackend());

    // 1. Load Model
    console.log("Eye Contact Coach: Loading model...");
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmPose.load(modelURL, metadataURL);
    console.log("Eye Contact Coach: Model loaded successfully");
    
    // 2. Setup Camera
    console.log("Eye Contact Coach: Setting up camera...");
    const flip = true;
    webcam = new tmPose.Webcam(640, 480, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    console.log("Eye Contact Coach: Camera started");
    
    // 3. Setup Analyzer
    analyzer = new EyeContactAnalyzer({ notContactThreshold: 2000 });
    
    isRunning = true;
    // Use setInterval instead of requestAnimationFrame for offscreen documents
    intervalId = setInterval(loop, 1000 / 30); // 30 FPS
    
    console.log("Eye Contact Coach: Initialization complete, starting analysis loop");
  } catch (err) {
    console.error("Eye Contact Coach Error:", err);
    chrome.runtime.sendMessage({
      type: 'STATUS_UPDATE',
      data: {
        error: err.toString()
      }
    });
  }
}

async function loop() {
  if (!isRunning) {
    console.log("Eye Contact Coach: Loop stopped (isRunning = false)");
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    return;
  }
  
  try {
    webcam.update(); // update the webcam frame
    
    // Predict
    const { posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    // Analyze
    const result = analyzer.process(prediction); // { status, isWarning, stats }
    
    // Send result to background -> content script
    chrome.runtime.sendMessage({
      type: 'STATUS_UPDATE',
      data: result
    });
    
    // Log every 30 frames (~1 second) to avoid console spam
    if (Math.random() < 0.033) {
      console.log("Eye Contact Coach: Sending update -", result.isContact ? "Good Contact" : "Looking Away");
    }
  } catch (error) {
    console.error("Eye Contact Coach: Error in loop:", error);
  }
}

// Handle messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'START_ANALYSIS') {
    init();
  } else if (message.type === 'STOP_ANALYSIS') {
    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (webcam) webcam.stop();
  }
});

// Auto-start for now (or wait for signal)
init();
