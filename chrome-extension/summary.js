// summary.js - Session summary page logic with pie chart

// Load session data from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const sessionData = {
  duration: parseInt(urlParams.get('duration')) || 0,
  ratio: parseInt(urlParams.get('ratio')) || 0,
  count: parseInt(urlParams.get('count')) || 0,
  totalDistracted: parseInt(urlParams.get('totalDistracted')) || 0,
  endTime: urlParams.get('endTime') || new Date().toLocaleTimeString(),
  // Class percentages (3-class model)
  classPercentages: {
    good_posture: parseFloat(urlParams.get('good_posture')) || 0,
    looking_away: parseFloat(urlParams.get('looking_away')) || 0,
    looking_down: parseFloat(urlParams.get('looking_down')) || 0
  }
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

// Create pie chart
function createPostureChart() {
  const ctx = document.getElementById('postureChart').getContext('2d');
  
  // Debug: Log session data
  console.log('Session Data:', sessionData);
  console.log('Class Percentages:', sessionData.classPercentages);
  
  const labels = {
    good_posture: 'Good Posture',
    looking_away: 'Looking Away',
    looking_down: 'Looking Down'
  };
  
  const colors = {
    good_posture: '#4ade80',
    looking_away: '#f87171',
    looking_down: '#fbbf24'
  };
  
  const data = [];
  const backgroundColors = [];
  const chartLabels = [];
  
  // Only include classes with non-zero percentages
  Object.keys(sessionData.classPercentages).forEach(key => {
    const percentage = sessionData.classPercentages[key];
    console.log(`Class ${key}: ${percentage}%`);
    if (percentage > 0) {
      data.push(percentage);
      backgroundColors.push(colors[key]);
      chartLabels.push(labels[key]);
    }
  });
  
  console.log('Chart Data:', data);
  console.log('Chart Labels:', chartLabels);
  
  // If no data, show a message
  if (data.length === 0) {
    console.warn('No posture data available for chart');
    document.querySelector('.chart-container').innerHTML = 
      '<h3 class="chart-title">Posture Distribution</h3><p style="text-align: center; color: #94a3b8;">No data available</p>';
    return;
  }
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: chartLabels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(15, 23, 42, 0.8)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#cbd5e1',
            font: {
              size: 13,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            },
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed.toFixed(1) + '%';
            }
          },
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#e2e8f0',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: true
        }
      }
    }
  });
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
  
  // Create pie chart
  createPostureChart();
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
