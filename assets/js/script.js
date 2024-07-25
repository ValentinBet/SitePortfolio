let count = 0;

const BASE_LANG = 'en-GB';
let currentLang = BASE_LANG;


function setLanguageButton(language) {
	currentLang = language;
	updateLanguage();
}


function updateLanguage() {
	const urlParams = createNewUrlParamsWithLang();
	history.replaceState({}, null, window.location.origin + window.location.pathname + "?" + urlParams.toString());

	UpdateLinkLang(urlParams)
	UpdateLangButtons();
	
	// Loop through each element with the class "lang"
	const langElements = document.querySelectorAll('.lang');
	langElements.forEach((element) => {
		// Update the text of the element with the translation
		const key = element.getAttribute('key');
		element.textContent = arrLang[currentLang][key];
	});
}

function createNewUrlParamsWithLang() {
	let urlParams = new URLSearchParams(window.location.search);
	urlParams.set('lang', currentLang);
	return urlParams;
}


function UpdateLinkLang(urlParams) {
	const links = document.querySelectorAll('a');

	links.forEach(link => {
		if (urlParams.toString()) {
			const url = new URL(link.href, window.location.origin);
			url.search = urlParams.toString();
			link.href = url.toString();
		}
	});
}

function UpdateLangButtons() {
	const langButtons = document.querySelectorAll('.langButton');

	langButtons.forEach((element) => {
		// Update the text of the element with the translation
		if (element.getAttribute('id') != "button_" +  currentLang) {
			element.classList.remove('hide');
		} else {
			element.classList.add('hide');
		}

		// lock button for 0.3s to prevent double click
		element.classList.add('disabled');
		setTimeout(function () {
			element.classList.remove('disabled');
		}, 100);
	});
}

function LoadLang(filePath) {

	// Get the json file
	fetch(filePath)
		.then((response) => {
			// Return the json file
			return response.json();
		})
		.then((data) => {
			// Set the json data to the array
			arrLang = data;
			// Update the language on the page
			updateLanguage();
		});
}

function tryGetLangInURLParam() {
	let urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('lang')) {
		currentLang = urlParams.get('lang');
	}
	else {
		urlParams = createNewUrlParamsWithLang();
		currentLang = BASE_LANG;
	}
}

// OnPageLoad get lang json
window.addEventListener('DOMContentLoaded', function () {

	// Load the menu then the language
	fetch('menu.html')
	.then(response => response.text())
	.then(data => {
		document.getElementById('menu-container').innerHTML = data;
		LoadLang('assets/lang.json');
	});

});

document.body.classList.add("loading");
window.addEventListener("load", function () {
  document.body.classList.remove("loading");
});