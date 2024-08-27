/* global chrome */ // Inform ESLint that 'chrome' is a global variable

if (chrome && chrome.alarms && chrome.notifications) {
  // Function to map interval strings to seconds
  function getIntervalInSeconds(interval) {
    switch (interval) {
      case 'every3s':
        return 3; // 3 seconds
      case 'every1h':
        return 1 * 60 * 60; // 1 hour
      case 'every2h':
        return 2 * 60 * 60; // 2 hours
      case 'every4h':
        return 4 * 60 * 60; // 4 hours
      case 'every8h':
        return 8 * 60 * 60; // 8 hours
      case 'every12h':
        return 12 * 60 * 60; // 12 hours
      case 'every16h':
        return 16 * 60 * 60; // 16 hours
      case 'every20h':
        return 20 * 60 * 60; // 20 hours
      case 'every24h':
        return 24 * 60 * 60; // 24 hours
      default:
        console.error('Invalid interval:', interval);
        return null; // Return null if the interval is invalid
    }
  }

  function scheduleNotification(intervalInSeconds) {
    if (intervalInSeconds === null || isNaN(intervalInSeconds) || !isFinite(intervalInSeconds) || intervalInSeconds <= 0) {
      console.error('Invalid intervalInSeconds:', intervalInSeconds);
      return; // Exit the function if the interval is invalid
    }

    const intervalInMilliseconds = intervalInSeconds * 1000; // Convert seconds to milliseconds

    chrome.alarms.clearAll();
    chrome.alarms.create('supplicationNotification', {
      delayInMinutes: intervalInMilliseconds / (60 * 1000),  // Convert to minutes
      periodInMinutes: intervalInMilliseconds / (60 * 1000)  // Repeat every 'intervalInMilliseconds'
    });
  }

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'supplicationNotification') {
      // Check if Focus Mode is active before showing the notification
      chrome.storage.sync.get(['focusMode'], (result) => {
        if (!result.focusMode) {  // Only show notifications if Focus Mode is NOT enabled
          showNotification();
        } else {
          console.log('Focus Mode is enabled, notification suppressed.');
        }
      });
    }
  });

  async function fetchRandomSupplication() {
    try {
      const response = await fetch('http://localhost:5000/api/supplications/random');
      const data = await response.json();
      if (response.ok && data.text) {
        return data;
      } else {
        console.error('Failed to fetch supplication:', data.message || 'Unknown error');
        return null;
      }
    } catch (error) {
      console.error('Error fetching supplication:', error);
      return null;
    }
  }

  async function showNotification() {
    const supplication = await fetchRandomSupplication();
    if (!supplication) return;  // Exit if fetching failed

    const options = {
      type: 'basic',
      iconUrl: './icons/icon.png',
      title: 'یاد - أذكار',
      message: supplication.text,
      requireInteraction: true  // Keeps the notification until the user interacts
    };

    if (chrome.notifications.create) {
      chrome.notifications.create('supplicationNotification', options);
    } else {
      console.error('chrome.notifications API is not available.');
    }
  }

  // Add listener for notification click event
  chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId === 'supplicationNotification') {
      openPopup();
    }
  });

  function openPopup() {
    const width = 700;
    const height = 600;
  
    chrome.system.display.getInfo(function(displays) {
      // Use the first display's bounds
      const display = displays[0];
      const left = Math.round((display.bounds.width - width) / 2);
      const top = Math.round((display.bounds.height - height) / 2);
  
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top
      });
    });
  }

  chrome.runtime.onInstalled.addListener(() => {
    const interval = 'every3s'; // Default interval for testing
    const intervalInSeconds = getIntervalInSeconds(interval);
    scheduleNotification(intervalInSeconds);
  });

  chrome.storage.onChanged.addListener((changes) => { // Removed 'namespace' to resolve unused var error
    if (changes.interval) {
      const newInterval = changes.interval.newValue;
      const intervalInSeconds = getIntervalInSeconds(newInterval);
      if (intervalInSeconds !== null) {
        scheduleNotification(intervalInSeconds);
      }
    }

    // Check for changes in focus mode status
    if (changes.focusMode) {
      const isFocusModeEnabled = changes.focusMode.newValue;
      if (isFocusModeEnabled) {
        chrome.alarms.clearAll(); // Clear all alarms when Focus Mode is enabled
        console.log('Focus Mode enabled, notifications paused.');
      } else {
        // Reschedule notifications when Focus Mode is disabled
        chrome.storage.sync.get(['interval'], (result) => {
          const newInterval = result.interval || 'every4h'; // Fallback to default 'every4h' if not set
          const intervalInSeconds = getIntervalInSeconds(newInterval);
          if (intervalInSeconds !== null) {
            scheduleNotification(intervalInSeconds);
            console.log('Focus Mode disabled, notifications resumed.');
          }
        });
      }
    }
  });

  // Handle messages from popup or other parts of the extension
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSupplication') {
      fetchRandomSupplication().then(supplication => {
        sendResponse({ supplication });
      }).catch(error => {
        console.error('Error fetching supplication for popup:', error);
        sendResponse({ error: 'Failed to fetch supplication' });
      });
      return true; // Indicate that the response is asynchronous
    }
  });
} else {
  console.error('Chrome alarms or notifications API is not available.');
}
