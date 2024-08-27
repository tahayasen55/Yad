import { useState, useEffect } from 'react'; // Removed React import since it's not directly used
import './App.css'; // Import custom styles

/* global chrome */ // Inform ESLint that 'chrome' is a global variable

const App = () => {
  const [interval, setInterval] = useState('every4h'); // Default to 'every4h'
  const [language, setLanguage] = useState('en'); // Language state
  const [focusMode, setFocusMode] = useState(false); // Focus mode state

  // Load saved settings from Chrome storage
  useEffect(() => {
    chrome.storage.sync.get(['interval', 'language', 'focusMode'], (result) => {
      if (result.interval) setInterval(result.interval);
      if (result.language) setLanguage(result.language);
      if (result.focusMode !== undefined) setFocusMode(result.focusMode);
    });
  }, []);

  // Save settings to Chrome storage
  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    chrome.storage.sync.set({ interval: newInterval });
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    chrome.storage.sync.set({ language: newLanguage }, () => {
      // Inform popup.js about the language change
      chrome.runtime.sendMessage({ action: 'updateLanguage', language: newLanguage });
    });
  };
  

  const handleFocusModeChange = () => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    chrome.storage.sync.set({ focusMode: newFocusMode });
  };

  // Translation dictionary
  const translations = {
    en: {
      title: 'Select Notification Interval',
      intervalLabel: 'Set how often you want to receive notifications.',
      languageLabel: 'Select notification language.',
      focusModeLabel: 'Focus Mode',
      saveSettings: 'Save Settings',
      every3s: 'Every 3 seconds',
      every4h: 'Every 4 hours',
      every8h: 'Every 8 hours',
      every12h: 'Every 12 hours',
      every16h: 'Every 16 hours',
      every20h: 'Every 20 hours',
      every24h: 'Every 24 hours',
    },
    ku: {
      title: 'دیاری کردنی ماوەی ئاگاداری',
      intervalLabel: 'دیاری بکە چەند جار دەتەوێت ئاگاداریدانەکان وەرگرن.',
      languageLabel: 'زمانی ئاگاداریدانەکان دیاری بکە.',
      focusModeLabel: 'دۆخی سەرجەم',
      saveSettings: 'پاشەکەوتکردنی ڕێکخستنەکان',
      every3s: 'هەموو ٣ چرکە',
      every4h: 'هەموو ٤ کاتژمێر',
      every8h: 'هەموو ٨ کاتژمێر',
      every12h: 'هەموو ١٢ کاتژمێر',
      every16h: 'هەموو ١٦ کاتژمێر',
      every20h: 'هەموو ٢٠ کاتژمێر',
      every24h: 'هەموو ٢٤ کاتژمێر',
    },
    ar: {
      title: 'اختر فترة الإخطار',
      intervalLabel: 'حدد كم مرة تريد تلقي الإشعارات.',
      languageLabel: 'اختر لغة الإشعارات.',
      focusModeLabel: 'وضع التركيز',
      saveSettings: 'حفظ الإعدادات',
      every3s: 'كل ٣ ثواني',
      every4h: 'كل ٤ ساعات',
      every8h: 'كل ٨ ساعات',
      every12h: 'كل ١٢ ساعة',
      every16h: 'كل ١٦ ساعة',
      every20h: 'كل ٢٠ ساعة',
      every24h: 'كل ٢٤ ساعة',
    },
  };

  return (
    <div className="app-container">
      <div className="content">
        <h2>{translations[language].title}</h2>
        <p>{translations[language].intervalLabel}</p>
        <div className="interval-options">
          {['every3s', 'every4h', 'every8h', 'every12h', 'every16h', 'every20h', 'every24h'].map((option) => (
            <button
              key={option}
              className={`interval-button ${interval === option ? 'selected' : ''}`}
              onClick={() => handleIntervalChange(option)}
            >
              {translations[language][option]}
            </button>
          ))}
        </div>

        <p>{translations[language].languageLabel}</p>
        <div className="language-options">
          <button
            className={`language-button ${language === 'ar' ? 'selected' : ''}`}
            onClick={() => handleLanguageChange('ar')}
          >
            العربية
          </button>
          <button
            className={`language-button ${language === 'en' ? 'selected' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
          <button
            className={`language-button ${language === 'ku' ? 'selected' : ''}`}
            onClick={() => handleLanguageChange('ku')}
          >
            کوردی
          </button>
        </div>

        <p>{translations[language].focusModeLabel}</p>
        <div className="focus-mode-switch">
          <label className="switch">
            <input type="checkbox" checked={focusMode} onChange={handleFocusModeChange} />
            <span className="slider round"></span>
          </label>
        </div>

        <button className="save-button">
          {translations[language].saveSettings}
        </button>
      </div>
    </div>
  );
};

export default App;
