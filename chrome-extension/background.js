// background.js - Simplified version that reads from chrome.storage

console.log("Eye Contact Coach: Background script loaded");

// Listen for changes in chrome.storage and forward to content scripts
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.eyeContactStatus) {
    const newStatus = changes.eyeContactStatus.newValue;
    
    console.log("Background: Received status update from web app:", newStatus);
    
    // Forward to all Google Meet tabs
    chrome.tabs.query({url: "*://meet.google.com/*"}, (tabs) => {
      console.log(`Background: Found ${tabs.length} Meet tabs`);
      
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'STATUS_UPDATE',
          data: newStatus
        }).catch(err => {
          console.warn(`Background: Failed to send to tab ${tab.id}:`, err);
        });
      });
    });
  }
});

// Initial setup - send current status to newly opened Meet tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('meet.google.com')) {
    // Read current status from storage and send to tab
    chrome.storage.local.get(['eyeContactStatus'], (result) => {
      if (result.eyeContactStatus) {
        console.log("Background: Sending initial status to new Meet tab");
        chrome.tabs.sendMessage(tabId, {
          type: 'STATUS_UPDATE',
          data: result.eyeContactStatus
        }).catch(err => {
          console.warn("Background: Failed to send initial status:", err);
        });
      }
    });
  }
});

// Listen for external messages from web app
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log("Background: Received external message from:", sender.url);
  
  if (message.type === 'EYE_CONTACT_UPDATE') {
    console.log("Background: Eye contact update:", message.data);
    
    // Forward to all Google Meet tabs
    chrome.tabs.query({url: "*://meet.google.com/*"}, (tabs) => {
      console.log(`Background: Found ${tabs.length} Meet tabs`);
      
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'STATUS_UPDATE',
          data: message.data
        }, (response) => {
          if (chrome.runtime.lastError) {
            // Content script not ready yet - this is normal
            console.log(`Background: Tab ${tab.id} not ready:`, chrome.runtime.lastError.message);
          } else {
            console.log(`Background: Successfully sent to tab ${tab.id}`);
          }
        });
      });
    });
    
    // Send response to web app
    sendResponse({success: true});
  }
  
  return true; // Keep message channel open for async response
});

// Track active meeting sessions
const activeSessions = new Map();

// Detect when user navigates away from meeting or closes tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if tab was previously in a meeting
  if (activeSessions.has(tabId)) {
    const sessionData = activeSessions.get(tabId);
    // sessionData is now an object: { url, startTime, popupWindowId }
    
    // Check if still in a meeting (not landing page or other site)
    const isMeetingUrl = tab.url && (
      (tab.url.includes('meet.google.com') && !tab.url.includes('/landing')) ||
      tab.url.includes('zoom.us/j/')
    );
    
    // Meeting ended (navigated away, to landing page, or URL changed)
    if (!isMeetingUrl && changeInfo.url) {
      console.log(`Background: Meeting ended for tab ${tabId}`);
      handleMeetingEnd(tabId);
      activeSessions.delete(tabId);
    }
  } else {
    // Check if user just joined a meeting (not landing page)
    const isMeetingUrl = tab.url && (
      (tab.url.includes('meet.google.com') && !tab.url.includes('/landing')) ||
      tab.url.includes('zoom.us/j/')
    );
    
    if (isMeetingUrl && changeInfo.status === 'complete') {
      console.log(`Background: Meeting started for tab ${tabId}`);
      
      // Auto-open the popup to start camera and model
      console.log("Background: Auto-starting camera for meeting");
      chrome.windows.create({
        url: chrome.runtime.getURL('webapp/index.html?auto=true'),
        type: 'popup',
        width: 400,
        height: 300
      }, (window) => {
        // Store session data including popup window ID
        activeSessions.set(tabId, {
          url: tab.url,
          startTime: Date.now(),
          popupWindowId: window ? window.id : null
        });
        
        // Store session start time in storage as backup
        chrome.storage.local.set({
          [`session_${tabId}_start`]: Date.now()
        });
      });
    }
  }
});

// Detect when meeting tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (activeSessions.has(tabId)) {
    console.log(`Background: Meeting tab ${tabId} closed`);
    handleMeetingEnd(tabId);
    activeSessions.delete(tabId);
  }
});

// Handle meeting end - show summary
async function handleMeetingEnd(tabId) {
  // Get session data from memory
  const sessionData = activeSessions.get(tabId);
  
  // Close the popup window if it exists
  if (sessionData && sessionData.popupWindowId) {
    console.log(`Background: Closing popup window ${sessionData.popupWindowId}`);
    try {
      chrome.windows.remove(sessionData.popupWindowId);
    } catch (e) {
      console.log("Background: Popup window already closed or invalid");
    }
  }

  // Get final stats from storage
  const result = await chrome.storage.local.get(['eyeContactStatus', `session_${tabId}_start`]);
  const stats = result.eyeContactStatus?.stats;
  // Use memory start time if available, otherwise storage
  const startTime = sessionData ? sessionData.startTime : result[`session_${tabId}_start`];
  
  if (stats && startTime) {
    const duration = Math.max(0, Math.floor((Date.now() - startTime) / 1000)); // seconds
    const endTime = new Date().toLocaleTimeString();
    
    // Build URL with class percentages
    const classParams = stats.classPercentages ? 
      Object.entries(stats.classPercentages)
        .map(([key, value]) => `${key}=${value}`)
        .join('&') : '';
    
    // Open summary page with stats
    const summaryUrl = chrome.runtime.getURL(
      `summary.html?duration=${duration}&ratio=${stats.notContactRatio}&count=${stats.notContactCount}&totalDistracted=${stats.notContactDurationSec}&endTime=${encodeURIComponent(endTime)}&${classParams}`
    );
    
    chrome.tabs.create({ url: summaryUrl });
    
    // Clean up session data
    chrome.storage.local.remove([`session_${tabId}_start`]);
    
    // Send reset signal to web app to clear statistics
    chrome.storage.local.set({ 
      resetStats: true,
      eyeContactStatus: {
        isContact: true,
        status: 'good_posture',
        isWarning: false,
        stats: {
          notContactCount: 0,
          notContactDurationSec: '0.0',
          notContactRatio: '0.0',
          classPercentages: {},
          classDurations: {}
        },
        timestamp: Date.now()
      }
    });
  }
}

// Handle messages from summary page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_MAIN_APP') {
    chrome.action.openPopup();
  }
});

console.log("Background: Initialization complete");
