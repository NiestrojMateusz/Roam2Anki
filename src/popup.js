const DEFAULT_TAG = 'Box1';
const button = document.getElementById('generateCSV');
const tagInput = document.getElementById('question-tag');
const errorSection = document.getElementById('error-section');
const errorMessageEl = document.querySelector('.error-message');
const errorTipEl = document.querySelector('.error-tip');

const downloadCSV = (csv) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url, // The object URL can be used as download URL,
    filename: 'roam2AnkiCsv',
  });
};

button.addEventListener('click', function () {
  // alert('działa czy nie');
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      {
        message: 'clicked_browser_action',
        tag: tagInput && tagInput.value ? tagInput.value : DEFAULT_TAG,
      },
      (csv) => {
        if (csv && typeof csv === 'string') {
          downloadCSV(csv);
        }
      }
    );
  });
});

chrome.runtime.onMessage.addListener(function (request) {
  const { type, data } = request;
  const { message, tip } = data;

  if (type === 'no_answer_error') {
    errorTipEl.innerText = tip;
    errorMessageEl.innerText = message;

    errorSection.style.display = 'block';
  }
});
