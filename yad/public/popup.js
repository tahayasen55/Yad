/* global chrome */ // Inform ESLint that 'chrome' is a global variable

document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.sendMessage({ action: 'getSupplication' }, function (response) {
    if (response && response.supplication) {
      const { text, type, description } = response.supplication;

      chrome.storage.sync.get(['language'], (result) => {
        const language = result.language || 'kurdish';

        // Update the text and type in the popup
        document.getElementById('supplication-text').textContent = text;
        updateTypeDisplay(type, language);

        // Update the descriptions in the respective tabs
        document.getElementById('description-kurdish').textContent = description.kurdish || 'No Kurdish description available.';
        document.getElementById('description-arabic').textContent = description.arabic || 'No Arabic description available.';
        document.getElementById('description-english').textContent = description.english || 'No English description available.';

        // Set the active tab based on the selected language
        setActiveTab(language);

        // Update the title based on the selected language
        updateTitle(language);
      });
    } else {
      document.getElementById('supplication-text').textContent = 'Error loading supplication.';
      console.error('Error fetching supplication:', response.error);
    }
  });

  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelector('.tab.active').classList.remove('active');
      document.querySelector('.tab-content.active').classList.remove('active');

      tab.classList.add('active');
      document.getElementById(`description-${tab.getAttribute('data-lang')}`).classList.add('active');
    });
  });
});

function updateTypeDisplay(type, language) {
  const typeTranslations = {
    en: {
      zikr: 'Supplication',
      hadith: 'Hadith',
      aya: 'Verse',
    },
    ku: {
      zikr: 'زیکر',
      hadith: 'حدیث',
      aya: 'ئایە',
    },
    ar: {
      zikr: 'ذكر',
      hadith: 'حديث',
      aya: 'آية',
    },
  };

  const translatedType = typeTranslations[language][type] || type;
  document.getElementById('supplication-type').textContent = translatedType;
}

function setActiveTab(language) {
  const langMap = {
    en: 'english',
    ku: 'kurdish',
    ar: 'arabic'
  };

  const activeTab = langMap[language] || 'kurdish';
  document.querySelector('.tab.active').classList.remove('active');
  document.querySelector('.tab-content.active').classList.remove('active');

  document.querySelector(`.tab[data-lang="${activeTab}"]`).classList.add('active');
  document.getElementById(`description-${activeTab}`).classList.add('active');
}

function updateTitle(language) {
  const titleTranslations = {
    en: 'Islamic Supplication',
    ku: 'دووایەتی ئیسلامی',
    ar: 'الدعاء الإسلامي',
  };

  const translatedTitle = titleTranslations[language] || titleTranslations.ku;
  document.getElementById('title').textContent = translatedTitle;
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateLanguage') {
    setActiveTab(request.language);
    updateTitle(request.language);
  }
});
