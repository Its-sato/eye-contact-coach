// summary.js - Session summary page logic

// Load session data from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const sessionData = {
  duration: parseInt(urlParams.get('duration')) || 0,
  ratio: parseInt(urlParams.get('ratio')) || 0,
  count: parseInt(urlParams.get('count')) || 0,
  totalDistracted: parseInt(urlParams.get('totalDistracted')) || 0,
  endTime: urlParams.get('endTime') || new Date().toLocaleTimeString()
};

// Calculate performance level
function getPerformanceLevel(ratio) {
  if (ratio < 10) return 'excellent';
  if (ratio < 20) return 'good';
  if (ratio < 35) return 'needs-improvement';
  return 'poor';
}

// Get performance message
function getPerformanceMessage(level) {
  const messages = {
    excellent: 'Excellent! You maintained great eye contact throughout the session. Keep it up! 🎉',
    good: 'Good job! Your eye contact was solid. A little more focus and you\'ll be perfect! 👍',
    'needs-improvement': 'Not bad, but there\'s room for improvement. Try to stay more focused next time. 💪',
    poor: 'You got distracted quite a bit. Remember to look at the camera more often! 📹'
  };
  return messages[level];
}

// Get performance badge text
function getPerformanceBadgeText(level) {
  const badges = {
    excellent: 'Excellent! 🎉',
    good: 'Good Job! 👍',
    'needs-improvement': 'Keep Trying! 💪',
    poor: 'Needs Work 📚'
  };
  return badges[level];
}

// Update UI with session data
function updateUI() {
  const level = getPerformanceLevel(sessionData.ratio);
  
  // Update performance badge
  const badge = document.getElementById('performanceBadge');
  badge.textContent = getPerformanceBadgeText(level);
  badge.className = `performance-badge ${level}`;
  
  // Update stats
  document.getElementById('sessionDuration').innerHTML = 
    `${Math.floor(sessionData.duration / 60)}<span class="stat-unit">min</span>`;
  
  const ratioElement = document.getElementById('distractionRatio');
  ratioElement.innerHTML = `${sessionData.ratio}<span class="stat-unit">%</span>`;
  ratioElement.className = 'stat-value';
  if (sessionData.ratio < 10) ratioElement.classList.add('good');
  else if (sessionData.ratio < 30) ratioElement.classList.add('warning');
  else ratioElement.classList.add('danger');
  
  document.getElementById('timesDistracted').textContent = sessionData.count;
  document.getElementById('totalDistracted').innerHTML = 
    `${sessionData.totalDistracted}<span class="stat-unit">s</span>`;
  
  // Update message
  document.getElementById('message').textContent = getPerformanceMessage(level);
  
  // Update end time
  document.getElementById('endTime').textContent = sessionData.endTime;
}

// Button handlers
document.getElementById('closeBtn').addEventListener('click', () => {
  window.close();
});

document.getElementById('newSessionBtn').addEventListener('click', () => {
  // Open the main app
  chrome.runtime.sendMessage({ type: 'OPEN_MAIN_APP' });
  window.close();
});

// Initialize
updateUI();
