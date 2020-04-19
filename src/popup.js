const button = document.getElementById('generateCSV');

const downloadCSV = (csv) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url, // The object URL can be used as download URL
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
      },
      (csv) => {
        downloadCSV(csv);
      }
    );
  });
});
