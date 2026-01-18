// settings.js - Settings page logic

// Default settings
const DEFAULT_SETTINGS = {
  warningThreshold: 2000,
  overlayPosition: 'top-right',
  showStats: true,
  enableWarnings: true
};

// Load settings from chrome.storage
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], (result) => {
      resolve(result.settings || DEFAULT_SETTINGS);
    });
  });
}

// Save settings to chrome.storage
async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ settings }, () => {
      resolve();
    });
  });
}

// Initialize UI with current settings
async function initializeUI() {
  const settings = await loadSettings();
  
  document.getElementById('warningThreshold').value = settings.warningThreshold;
  document.getElementById('thresholdValue').textContent = (settings.warningThreshold / 1000).toFixed(1);
  document.getElementById('overlayPosition').value = settings.overlayPosition;
  document.getElementById('showStats').checked = settings.showStats;
  document.getElementById('enableWarnings').checked = settings.enableWarnings;
}

// Update threshold value display
document.getElementById('warningThreshold').addEventListener('input', (e) => {
  const value = parseInt(e.target.value);
  document.getElementById('thresholdValue').textContent = (value / 1000).toFixed(1);
});

// Save button handler
document.getElementById('saveButton').addEventListener('click', async () => {
  const settings = {
    warningThreshold: parseInt(document.getElementById('warningThreshold').value),
    overlayPosition: document.getElementById('overlayPosition').value,
    showStats: document.getElementById('showStats').checked,
    enableWarnings: document.getElementById('enableWarnings').checked
  };
  
  await saveSettings(settings);
  
  // Show success message
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = '✓ Settings saved successfully!';
  statusMessage.className = 'status-message success show';
  
  setTimeout(() => {
    statusMessage.classList.remove('show');
  }, 3000);
});

// Initialize on load
initializeUI();
