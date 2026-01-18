/**
 * EyeContactAnalyzer - Multi-Class Posture Analysis
 *
 * Handles the logic for detecting posture state based on model probability.
 * Features:
 * - Multi-class tracking (good_posture, looking_away, looking_down, slouching, fidgeting)
 * - Smoothing: Majority vote over the last N frames
 * - Hysteresis: Time-based state locking
 * - Detailed statistics per class
 */
export class EyeContactAnalyzer {
  constructor(options = {}) {
    // Configuration
    this.historySize = options.historySize || 5;
    this.notContactThreshold = options.notContactThreshold || 2000;
    this.sampleRate = options.sampleRate || 100;
    this.contactLabel = options.contactLabel || 'good_posture';
    
    // All possible classes (3-class model)
    this.allClasses = [
      'good_posture',
      'looking_away',
      'looking_down'
    ];

    // State
    this.historyQueue = [];
    this.currentStatus = this.contactLabel;
    this.lastStatusChangeTimestamp = Date.now();
    this.isWarningActive = false;

    // Statistics
    this.startTime = Date.now();
    this.totalDuration = 0;
    this.notContactDuration = 0;
    this.notContactCount = 0;
    
    // Per-class duration tracking
    this.classDurations = {};
    this.allClasses.forEach(cls => {
      this.classDurations[cls] = 0;
    });
    
    // Internal tracking
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

    // 3. Update class duration
    if (this.classDurations[smoothedClass] !== undefined) {
      this.classDurations[smoothedClass] += dt;
    }

    // 4. State Logic
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

    // Update not-contact duration
    if (!isContactNow) {
      this.notContactDuration += dt;
    }

    // Warning logic
    if (isContactNow) {
      this.isWarningActive = false;
    } else {
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
    return maxClass || this.contactLabel;
  }

  getStats() {
    const ratio = this.totalDuration > 0 
      ? (this.notContactDuration / this.totalDuration) * 100 
      : 0;

    // Calculate percentage for each class
    const classPercentages = {};
    this.allClasses.forEach(cls => {
      const duration = this.classDurations[cls] || 0;
      const percentage = this.totalDuration > 0 
        ? (duration / this.totalDuration) * 100 
        : 0;
      classPercentages[cls] = percentage.toFixed(1);
    });

    return {
      notContactCount: this.notContactCount,
      notContactDurationSec: (this.notContactDuration / 1000).toFixed(1),
      notContactRatio: ratio.toFixed(1),
      classPercentages: classPercentages,
      classDurations: this.classDurations
    };
  }
  
  reset() {
    this.historyQueue = [];
    this.lastProcessTimestamp = Date.now();
    this.allClasses.forEach(cls => {
      this.classDurations[cls] = 0;
    });
  }
}
