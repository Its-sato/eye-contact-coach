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
    const wasMeetingUrl = activeSessions.get(tabId);
    
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
      activeSessions.set(tabId, tab.url);
      // Store session start time
      chrome.storage.local.set({
        [`session_${tabId}_start`]: Date.now()
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
  // Get final stats
  const result = await chrome.storage.local.get(['eyeContactStatus', `session_${tabId}_start`]);
  const stats = result.eyeContactStatus?.stats;
  const startTime = result[`session_${tabId}_start`];
  
  if (stats && startTime) {
    const duration = Math.floor((Date.now() - startTime) / 1000); // seconds
    const endTime = new Date().toLocaleTimeString();
    
    // Open summary page with stats
    const summaryUrl = chrome.runtime.getURL(
      `summary.html?duration=${duration}&ratio=${stats.notContactRatio}&count=${stats.notContactCount}&totalDistracted=${stats.notContactDurationSec}&endTime=${encodeURIComponent(endTime)}`
    );
    
    chrome.tabs.create({ url: summaryUrl });
    
    // Clean up session data
    chrome.storage.local.remove([`session_${tabId}_start`]);
  }
}

// Handle messages from summary page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_MAIN_APP') {
    chrome.action.openPopup();
  }
});

console.log("Background: Initialization complete");
