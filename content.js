// variables
const DIRECT_LINK_BASE_URL = 'https://drive.google.com/uc?export=download&id=';
const DRIVE_GET_ID_RGX = /(?<=\/d\/)(.*)(?=\/view)/g;
let directURLsArr = [];
let selectedWorksArr = [];

chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
	const works = document.querySelectorAll('.tfGBod');

	if (request.tracking !== null) {
		if (request.tracking) {
			works.forEach((workEl) => {
				workEl.addEventListener('click', handleWorkClick);
			});
		} else {
			works.forEach((workEl) => {
				workEl.removeEventListener('click', handleWorkClick);
			});
		}
	}
}

function handleWorkClick({ currentTarget }) {
	chrome.storage.local.get(['directURLs'], (res) => {
		directURLsArr = typeof res.directURLs === 'undefined' ? [] : Array.from(res.directURLs);
	});
	chrome.storage.local.get(['selectedWorks'], (res) => {
		selectedWorksArr = typeof res.selectedWorks === 'undefined' ? [] : Array.from(res.selectedWorks);
	});

	setTimeout(() => {
		const currentWorkTitle = currentTarget.querySelector('.UzbjTd').innerText;
		selectedWorksArr.push(currentWorkTitle);

		const allAnchors = [...currentTarget.querySelectorAll('.maXJsd')];
		const allLinks = allAnchors.map((anchor) => anchor.href);

		const fileIDs = allLinks.map((link) => link.match(DRIVE_GET_ID_RGX)[0]);

		fileIDs.forEach((id) => {
			const url = `${DIRECT_LINK_BASE_URL}${id}`;
			directURLsArr.push(url);
		});

		const directURLs = Array.from(new Set(directURLsArr));
		const selectedWorks = Array.from(new Set(selectedWorksArr));

		console.log(selectedWorks);

		chrome.storage.local.set({ directURLs, selectedWorks });
	}, 1000);
}
