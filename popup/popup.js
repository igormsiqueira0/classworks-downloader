const trackerBtn = document.querySelector('.tracker');
const resetBtn = document.querySelector('.reset');
const downloadBtn = document.querySelector('.download');
const ul = document.querySelector('ul');
let tracking = localStorage.getItem('tracking') === null ? false : JSON.parse(localStorage.getItem('tracking'));
let directURLs = [];
let selectedWorks = [];

function stylesButton() {
	if (tracking) {
		trackerBtn.classList.add('tracking');
		trackerBtn.innerText = 'Stop tracking';
	} else {
		trackerBtn.classList.remove('tracking');
		trackerBtn.innerText = 'Start tracking';
	}
}

function renderList(selectedWorksArr) {
	if (selectedWorksArr && selectedWorksArr.length) {
		ul.innerHTML = '';

		selectedWorksArr.forEach((work) => {
			const newLi = document.createElement('li');
			newLi.innerText = work;
			ul.appendChild(newLi);
		});
	} else {
		ul.innerHTML = 'No classwork has been selected';
	}
}

function getStorage() {
	chrome.storage.local.get(['directURLs'], (res) => {
		directURLs = res.directURLs;
	});

	chrome.storage.local.get(['selectedWorks'], (res) => {
		selectedWorks = res.selectedWorks;
	});
}

function handleTracker() {
	tracking = !tracking;
	localStorage.setItem('tracking', tracking);

	// send message
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { tracking });
	});

	// styles button
	stylesButton();
	getStorage();
	renderList(selectedWorks);
}

function handleReset() {
	chrome.storage.local.clear();
	directURLs = [];
	selectedWorks = [];
	renderList([]);
}

function handleDownload() {
	directURLs.forEach((url) => {
		window.open(url, '_blank');
	});
}

trackerBtn.addEventListener('click', handleTracker);
resetBtn.addEventListener('click', handleReset);
downloadBtn.addEventListener('click', handleDownload);

window.addEventListener('beforeunload', () => {
	localStorage.removeItem('tracking');
});

window.addEventListener('load', () => {
	stylesButton();
});

setInterval(() => {
	getStorage();
	renderList(selectedWorks);
}, 1000);
