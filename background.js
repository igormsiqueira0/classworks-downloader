chrome.runtime.onInstalled.addListener(function () {
	chrome.tabs.onActivated.addListener(async (info) => {
		const tab = await chrome.tabs.get(info.tabId);

		const isClassroom = tab.url.startsWith('https://classroom.google.com/');
		isClassroom ? chrome.action.enable(tab.tabId) : chrome.action.disable(tab.tabId);
	});
});
