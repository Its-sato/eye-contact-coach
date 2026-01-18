// content.js

let overlayContainer = null;
let statusBadge = null;
let statusElement = null;
let iconElement = null;
let warningElement = null;
let statsPanel = null;
let settings = null;

// Default settings
const DEFAULT_SETTINGS = {
  warningThreshold: 2000,
  overlayPosition: 'top-right',
  showStats: true,
  enableWarnings: true
};

// Load settings
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], (result) => {
      resolve(result.settings || DEFAULT_SETTINGS);
    });
  });
}

// Apply overlay position
function applyOverlayPosition(position) {
  if (!overlayContainer) return;
  
  // Reset all positions
  overlayContainer.style.top = '';
  overlayContainer.style.bottom = '';
  overlayContainer.style.left = '';
  overlayContainer.style.right = '';
  
  // Apply new position
  switch (position) {
    case 'top-left':
      overlayContainer.style.top = '20px';
      overlayContainer.style.left = '20px';
      break;
    case 'top-right':
      overlayContainer.style.top = '20px';
      overlayContainer.style.right = '20px';
      break;
    case 'bottom-left':
      overlayContainer.style.bottom = '20px';
      overlayContainer.style.left = '20px';
      break;
    case 'bottom-right':
      overlayContainer.style.bottom = '20px';
      overlayContainer.style.right = '20px';
      break;
  }
}

async function createOverlay() {
  if (overlayContainer) return;

  // Only show overlay on meeting pages
  const currentUrl = window.location.href;
  const isMeetingPage = (
    (currentUrl.includes('meet.google.com') && !currentUrl.includes('/landing')) ||
    currentUrl.includes('zoom.us/j/')
  );
  
  if (!isMeetingPage) {
    console.log("Content Script: Not a meeting page, skipping overlay");
    return;
  }

  // Load settings first
  settings = await loadSettings();

  console.log("Content Script: Creating overlay container");
  overlayContainer = document.createElement('div');
  overlayContainer.id = 'eye-contact-coach-overlay';
  
  const innerHTML = `
    <div class="ecc-status-badge ecc-status-loading" style="display: none;">
      <span id="ecc-icon">⏳</span>
      <span id="ecc-text">Loading...</span>
    </div>
    <div id="ecc-warning" class="ecc-warning-box" style="display: none;">
      ⚠️ Look at Camera
    </div>
    <div class="ecc-stats-panel" style="display: ${settings.showStats ? 'block' : 'none'};">
      <div class="ecc-stat-row">
        <span class="ecc-stat-label">Session Time</span>
        <span id="ecc-stat-session-time" class="ecc-stat-value">0:00</span>
      </div>
      <div class="ecc-stat-row">
        <span class="ecc-stat-label">Distracted</span>
        <span id="ecc-stat-ratio" class="ecc-stat-value">0%</span>
      </div>
      <div class="ecc-stat-row">
        <span class="ecc-stat-label">Times</span>
        <span id="ecc-stat-count" class="ecc-stat-value">0</span>
      </div>
      <div class="ecc-stat-row">
        <span class="ecc-stat-label">Duration</span>
        <span id="ecc-stat-duration" class="ecc-stat-value">0s</span>
      </div>
    </div>
  `;
  
  overlayContainer.innerHTML = innerHTML;
  document.body.appendChild(overlayContainer);
  
  // Get references
  statusBadge = overlayContainer.querySelector('.ecc-status-badge');
  statusElement = overlayContainer.querySelector('#ecc-text');
  iconElement = overlayContainer.querySelector('#ecc-icon');
  warningElement = overlayContainer.querySelector('#ecc-warning');
  statsPanel = overlayContainer.querySelector('.ecc-stats-panel');
  
  // Apply position
  applyOverlayPosition(settings.overlayPosition);
  
  console.log("Content Script: Overlay created and appended to body");
  
  // Start session timer
  startSessionTimer();
}

// Session timer
let sessionStartTime = null;
let sessionTimerInterval = null;

function startSessionTimer() {
  sessionStartTime = Date.now();
  
  // Update timer every second
  sessionTimerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const sessionTimeElement = document.getElementById('ecc-stat-session-time');
    if (sessionTimeElement) {
      sessionTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function stopSessionTimer() {
  if (sessionTimerInterval) {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = null;
  }
}

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) {
    settings = changes.settings.newValue;
    
    // Apply new settings
    if (overlayContainer) {
      applyOverlayPosition(settings.overlayPosition);
      if (statsPanel) {
        statsPanel.style.display = settings.showStats ? 'block' : 'none';
      }
    }
  }
});

// Listen for updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'STATUS_UPDATE') {
    if (!overlayContainer) {
      createOverlay();
    }
    
    console.log("Content Script: Updating UI with:", message.data);
    updateUI(message.data);
  }
});

function updateUI(data) {
  console.log("Content Script: updateUI called with data:", data);
  
  // Handle Initialization Error
  if (data.error) {
    console.error("Content Script: Displaying error:", data.error);
    statusElement.textContent = "Error";
    iconElement.textContent = "⚠️";
    statusBadge.className = "ecc-status-badge ecc-status-away";
    return;
  }

  const { isContact, isWarning, stats } = data;
  
  // Update status badge
  if (isContact) {
    statusElement.textContent = "Good Eye Contact";
    iconElement.textContent = "👁️";
    statusBadge.className = "ecc-status-badge ecc-status-good";
  } else {
    statusElement.textContent = "Looking Away";
    iconElement.textContent = "👀";
    statusBadge.className = "ecc-status-badge ecc-status-away";
  }

  // Notification timer for auto-hide
  let notificationTimer = null;
  let lastNotificationStatus = null;

  // Update Warning - show immediately on bad posture, auto-hide after 3 seconds
  if (!isContact && settings && settings.enableWarnings) {
    // Show warning immediately when bad posture is detected
    warningElement.style.display = "block";
    
    // Only reset timer if this is a new bad posture detection
    if (lastNotificationStatus !== data.status) {
      lastNotificationStatus = data.status;
      
      // Clear existing timer
      if (notificationTimer) {
        clearTimeout(notificationTimer);
      }
      
      // Auto-hide after 3 seconds
      notificationTimer = setTimeout(() => {
        warningElement.style.display = "none";
      }, 3000);
    }
  } else {
    // Hide warning when good posture
    warningElement.style.display = "none";
    lastNotificationStatus = null;
    if (notificationTimer) {
      clearTimeout(notificationTimer);
      notificationTimer = null;
    }
  }

  // Update Stats with color coding
  if (stats) {
    const ratioElement = overlayContainer.querySelector('#ecc-stat-ratio');
    const countElement = overlayContainer.querySelector('#ecc-stat-count');
    const durationElement = overlayContainer.querySelector('#ecc-stat-duration');
    
    // Distraction ratio with color
    ratioElement.textContent = `${stats.notContactRatio}%`;
    ratioElement.className = 'ecc-stat-value';
    if (stats.notContactRatio < 10) {
      ratioElement.classList.add('good');
    } else if (stats.notContactRatio < 30) {
      ratioElement.classList.add('warning');
    } else {
      ratioElement.classList.add('danger');
    }
    
    // Times
    countElement.textContent = stats.notContactCount;
    
    // Duration
    durationElement.textContent = `${stats.notContactDurationSec}s`;
  }
}

// Initial creation
createOverlay();
