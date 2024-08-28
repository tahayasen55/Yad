/* global chrome */ // Inform ESLint that 'chrome' is a global variable

if (chrome && chrome.alarms && chrome.notifications) {
  function getIntervalInSeconds(interval) {
    switch (interval) {
      case 'every3s': return 3; 
      case 'every1h': return 3600; 
      case 'every2h': return 7200; 
      case 'every4h': return 14400; 
      case 'every8h': return 28800; 
      case 'every12h': return 43200; 
      case 'every16h': return 57600; 
      case 'every20h': return 72000; 
      case 'every24h': return 86400; 
      default:
        console.error('Invalid interval:', interval);
        return null; 
    }
  }

  function scheduleNotification(intervalInSeconds) {
    if (!intervalInSeconds || intervalInSeconds <= 0) {
      console.error('Invalid intervalInSeconds:', intervalInSeconds);
      return; 
    }

    const intervalInMinutes = intervalInSeconds / 60; 

    chrome.alarms.clearAll();
    chrome.alarms.create('supplicationNotification', {
      delayInMinutes: intervalInMinutes,
      periodInMinutes: intervalInMinutes
    });
  }

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'supplicationNotification') {
      chrome.storage.sync.get(['focusMode'], (result) => {
        if (!result.focusMode) {
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
      if (!response.ok) {
        console.warn('API fetch failed; using local JSON.');
        return await fetchLocalSupplication();
      }
      const data = await response.json();
      if (data && data.text) {
        return data;
      } else {
        console.warn('Invalid data from API; using local JSON.');
        return await fetchLocalSupplication();
      }
    } catch (error) {
      console.warn('Error fetching from API, using local JSON:', error);
      return await fetchLocalSupplication();
    }
  }

  async function fetchLocalSupplication() {
    try {
      const response = await fetch(chrome.runtime.getURL('supplications.json')); // Ensure local JSON is correctly referenced
      const data = await response.json();
      if (data && data.supplications.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.supplications.length);
        return data.supplications[randomIndex];
      } else {
        console.error('Local supplications data is not structured properly:', data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching supplication from local JSON:', error);
      return null;
    }
  }
  

  async function showNotification() {
    const supplication = await fetchRandomSupplication();
    if (!supplication) {
      console.error('No supplication available to show.');
      return;
    }

    const options = {
      type: 'basic',
      iconUrl: './icons/icon.png',
      title: 'یاد - أذكار',
      message: supplication.text,
      requireInteraction: true 
    };

    chrome.notifications.create('supplicationNotification', options);
  }

  chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId === 'supplicationNotification') {
      chrome.storage.local.get(['lastSupplication'], function(result) {
        openPopup(result.lastSupplication);
      });
    }
  });

  function openPopup() {
    const width = 700;
    const height = 600;

    chrome.system.display.getInfo(function (displays) {
      const display = displays[0];
      const left = Math.round((display.bounds.width - width) / 2);
      const top = Math.round((display.bounds.height - height) / 2);

      chrome.windows.create({
        url: 'popup.html', // Ensure correct path for popup
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top
      });
    });
  }

  chrome.runtime.onInstalled.addListener(() => {
    const interval = 'every3s'; 
    const intervalInSeconds = getIntervalInSeconds(interval);
    scheduleNotification(intervalInSeconds);
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.interval) {
      const newInterval = changes.interval.newValue;
      const intervalInSeconds = getIntervalInSeconds(newInterval);
      if (intervalInSeconds !== null) {
        scheduleNotification(intervalInSeconds);
      }
    }

    if (changes.focusMode) {
      const isFocusModeEnabled = changes.focusMode.newValue;
      if (isFocusModeEnabled) {
        chrome.alarms.clearAll();
        console.log('Focus Mode enabled, notifications paused.');
      } else {
        chrome.storage.sync.get(['interval'], (result) => {
          const newInterval = result.interval || 'every4h';
          const intervalInSeconds = getIntervalInSeconds(newInterval);
          if (intervalInSeconds !== null) {
            scheduleNotification(intervalInSeconds);
            console.log('Focus Mode disabled, notifications resumed.');
          }
        });
      }
    }
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSupplication') {
      fetchRandomSupplication().then(supplication => {
        if (supplication) {
          console.log('Sending supplication data to popup:', supplication); // Log data
          sendResponse({ supplication });
        } else {
          sendResponse({ error: 'Failed to fetch supplication' });
        }
      }).catch(error => {
        console.error('Error fetching supplication for popup:', error);
        sendResponse({ error: 'Failed to fetch supplication' });
      });
      return true; // Required to keep the messaging channel open for asynchronous responses
    }
  });
  
} else {
  console.error('Chrome alarms or notifications API is not available.');
}
