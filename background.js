chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        console.log('Page loaded:');
        console.log('Title:', tab.title);
        console.log('URL:', tab.url);
    }
});


chrome.tabs.onCreated.addListener(function (tab) {
    chrome.storage.local.set({ capture: true });
});
