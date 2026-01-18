/**
 * EyeContactAnalyzer
 *
 * Handles the logic for detecting eye contact state based on model probability.
 * Features:
 * - Smoothing: Majority vote over the last N frames.
 * - Hysteresis: Time-based state locking (requires continuous bad state to trigger warning).
 * - Statistics: Tracks counts, durations, and rates.
 */
class EyeContactAnalyzer {
  constructor(options = {}) {
    // Configuration
    this.historySize = options.historySize || 5; // Frames for majority vote
    this.notContactThreshold = options.notContactThreshold || 2000; // ms to trigger warning
    this.sampleRate = options.sampleRate || 100; // Expected ms between checks (approximation)
    this.contactLabel = options.contactLabel || 'good_posture'; // The label representing good behavior

    // State
    this.historyQueue = []; // Ring buffer for recent classifications
    this.currentStatus = this.contactLabel; 
    this.lastStatusChangeTimestamp = Date.now();
    this.isWarningActive = false;

    // Statistics
    this.startTime = Date.now();
    this.totalDuration = 0;
    this.notContactDuration = 0;
    this.notContactCount = 0;
    
    // Internal tracking for duration calculation during active non-contact
    this.lastProcessTimestamp = Date.now();
  }

  /**
   * Process a new prediction result.
   * @param {Array<{className: string, probability: number}>} predictions 
   * @param {number} timestamp - Current timestamp
   * @returns {Object} Current analysis result
   */
  process(predictions, timestamp = Date.now()) {
    const dt = timestamp - this.lastProcessTimestamp;
    this.lastProcessTimestamp = timestamp;
    this.totalDuration += dt;

    // 1. Get raw classification
    const bestPrediction = predictions.reduce((prev, current) => 
      (prev.probability > current.probability) ? prev : current
    );
    const rawClass = bestPrediction.className;

    // 2. Smoothing
    this.historyQueue.push(rawClass);
    if (this.historyQueue.length > this.historySize) {
      this.historyQueue.shift();
    }
    const smoothedClass = this._getMajorityClass();

    // 3. State Logic
    const isContactNow = (smoothedClass === this.contactLabel);
    const wasContactBefore = (this.currentStatus === this.contactLabel);

    if (smoothedClass !== this.currentStatus) {
      this.currentStatus = smoothedClass;
      this.lastStatusChangeTimestamp = timestamp;
      
      // Transition: Good -> Bad
      if (wasContactBefore && !isContactNow) {
        this.notContactCount++;
      }
    }

    // ROBUSTNESS: Always clear warning if we are in contact state
    if (isContactNow) {
      this.isWarningActive = false;
    } 
    // Otherwise, check if we need to trigger warning
    else {
        this.notContactDuration += dt;
        
        // Only check duration if we are not already warning
        if (!this.isWarningActive) {
            const durationInState = timestamp - this.lastStatusChangeTimestamp;
            if (durationInState >= this.notContactThreshold) {
                this.isWarningActive = true;
            }
        }
    }

    return {
      status: this.currentStatus, 
      isContact: isContactNow, 
      isWarning: this.isWarningActive,
      stats: this.getStats()
    };
  }

  _getMajorityClass() {
    const counts = {};
    let maxClass = null;
    let maxCount = 0;

    for (const cls of this.historyQueue) {
      counts[cls] = (counts[cls] || 0) + 1;
      if (counts[cls] > maxCount) {
        maxCount = counts[cls];
        maxClass = cls;
      }
    }
    // If empty or tie, default to contact to be safe, or just raw
    return maxClass || this.contactLabel; 
  }

  getStats() {
    const ratio = this.totalDuration > 0 
      ? (this.notContactDuration / this.totalDuration) * 100 
      : 0;

    return {
      notContactCount: this.notContactCount,
      notContactDurationSec: (this.notContactDuration / 1000).toFixed(1),
      notContactRatio: ratio.toFixed(1)
    };
  }
  
  reset() {
    this.historyQueue = [];
    this.lastProcessTimestamp = Date.now();
  }
}
