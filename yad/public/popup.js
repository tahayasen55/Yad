/* global chrome */ 

document.addEventListener('DOMContentLoaded', function () {
  console.log('Popup DOM fully loaded and parsed.');

  chrome.runtime.sendMessage({ action: 'getSupplication' }, function (response) {
    if (response && response.supplication) {
      const { text, type, description } = response.supplication;

      console.log('Supplication data received:', response.supplication);

      // Ensure elements exist before attempting to update them
      const supplicationTextElement = document.getElementById('supplication-text');
      const supplicationTypeElement = document.getElementById('supplication-type');
      
      if (supplicationTextElement && supplicationTypeElement) {
        supplicationTextElement.textContent = text || 'No supplication text available.';
        updateTypeDisplay(type, 'ku');  // Assuming 'ku' for Kurdish; adjust based on default language

        // Update the description fields
        document.getElementById('description-kurdish').textContent = description?.kurdish || 'No Kurdish description available.';
        document.getElementById('description-arabic').textContent = description?.arabic || 'No Arabic description available.';
        document.getElementById('description-english').textContent = description?.english || 'No English description available.';

        setActiveTab('ku');  // Default to Kurdish
        updateTitle('ku');
      } else {
        console.error('Required elements not found in the DOM.');
      }

    } else {
      console.error('Error fetching supplication:', response?.error || 'No response from background script');
      document.getElementById('supplication-text').textContent = 'Error loading supplication.';
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
      fiqh: 'Jurisprudence',
    },
    ku: {
      zikr: 'زیکر',
      hadith: 'حدیث',
      aya: 'ئایە',
      fiqh: 'فیقهی',
    },
    ar: {
      zikr: 'ذكر',
      hadith: 'حديث',
      aya: 'آية',
      fiqh: 'الفقه',
    },
  };

  const translatedType = typeTranslations[language]?.[type] || type || 'Unknown';
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
    en: 'And whoever turns away from My remembrance will have a miserable life.',
    ku: 'وە ھەرکەسێک ڕوو وەرگێرێت لەیادی من ئەوە گوزەرانێکی تەنگی دەبێت',
    ar: 'وَمَنْ أَعْرَضَ عَن ذِكْرِي فَإِنَّ لَهُ مَعِيشَةً ضَنكًا',
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
