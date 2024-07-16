const trackContainer = document.querySelector('.picture__slider');
const carouselImage = document.querySelectorAll('.MCImageContainer');
const btnPrev = document.querySelector('.MCBtnPrev');
const btnNext = document.querySelector('.MCBtnNext');
const titles = document.querySelectorAll('.MCSlideContent');
const titleAnimationClass = 'MCTextAnim';
let amountToMove = carouselImage[0].offsetWidth;

let count = 0;

const BASE_LANG = 'en-GB';
let currentLang = BASE_LANG;

function handleResize() {
	amountToMove = carouselImage[0].offsetWidth;
	trackContainer.style.transition = 'none';
	trackContainer.style.transform = `translateX(-${amountToMove * count}px)`;
}

function handleClickNext() {
	if (count >= carouselImage.length - 1) {
		return;
	}
	count++;
	trackContainer.style.transition = 'transform 0.5s ease-in-out';
	trackContainer.style.transform = `translateX(-${amountToMove * count}px)`;
	btnShowHide(count);
	startVideo(count);
	animateCarouselTitle(count);
}

function handleClickPrev() {
	if (count === 0) {
		return;
	}
	count--;
	trackContainer.style.transition = 'transform 0.5s ease-in-out';
	trackContainer.style.transform = `translateX(-${amountToMove * count}px)`;
	btnShowHide(count);
	startVideo(count);
	animateCarouselTitle(count);
}

function startVideo(count) {
	const videoElement = trackContainer.children[count].lastElementChild;
	videoElement.play();
}

function animateCarouselTitle(count) {
	resetTitleAnimations();
	titles[count].classList.add(titleAnimationClass);
}

function resetTitleAnimations() {
	titles.forEach((title) => {
		title.classList.remove(titleAnimationClass);
	});
}

function isElementVisible(el) {
	const rect = el.getBoundingClientRect();
	const windowHeight = window.innerHeight || document.documentElement.clientHeight;
	const windowWidth = window.innerWidth || document.documentElement.clientWidth;
	return rect.top >= 0 && rect.left >= 0 && rect.top + 150 <= windowHeight && rect.right <= windowWidth;
}

function handleVisibilityCheck() {

	const mcElement = document.getElementById('MC');

	// Vérifier si l'élément est visible
	if (isElementVisible(mcElement)) {
		// Ajouter la classe MCTextAnim si elle n'est pas déjà présente
		if (!titles[count].classList.contains(titleAnimationClass)) {
			titles[count].classList.add(titleAnimationClass);
			titles[count].classList.remove('hide');
		}
	}
}

function btnShowHide(count) {
	if (count === 0) {
		btnPrev.classList.add('hide');
		btnNext.classList.remove('hide');
	} else if (count === carouselImage.length - 1) {
		btnPrev.classList.remove('hide');
		btnNext.classList.add('hide');
	} else {
		btnPrev.classList.remove('hide');
		btnNext.classList.remove('hide');
	}
}


// Function to update the language of the page
function updateLanguage() {
	// Loop through each element with the class "lang"
	const langElements = document.querySelectorAll('.lang');
	langElements.forEach((element) => {
		// Update the text of the element with the translation
		const key = element.getAttribute('key');
		element.textContent = arrLang[currentLang][key];
	});
}
function setLanguage(language) {
	currentLang = language;

	const urlParams = new URLSearchParams(window.location.search);
	urlParams.set('lang', currentLang);
	history.replaceState({}, null, window.location.origin + window.location.pathname + "?" + urlParams.toString());

	const langButtons = document.querySelectorAll('.langButton');

	langButtons.forEach((element) => {
		// Update the text of the element with the translation
		if (element.getAttribute('id') != "button_" +  currentLang) {
			element.classList.remove('hide');
		} else {
			element.classList.add('hide');
		}

		// lock button <a> for 0.3s to prevent double click
		element.classList.add('disabled');
		setTimeout(function () {
			element.classList.remove('disabled');
		}, 100);
	});

	updateLanguage();
}

function readJsonFile(filePath) {

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

function loadLang() {
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('lang'))
		currentLang = urlParams.get('lang');
}

// Ajouter des écouteurs d'événements pour le redimensionnement et le clic sur les boutons "précédent" et "suivant"
window.addEventListener('resize', handleResize);
btnNext.addEventListener('click', handleClickNext);
btnPrev.addEventListener('click', handleClickPrev);

// Ajouter un écouteur d'événement pour la vérification de visibilité en temps réel
window.addEventListener('scroll', handleVisibilityCheck);
window.addEventListener('resize', handleVisibilityCheck);

// OnPageLoad get lang json
window.addEventListener('DOMContentLoaded', function () {
	loadLang();
	readJsonFile('assets/lang.json');
});

document.body.classList.add("loading");
window.addEventListener("load", function () {
  document.body.classList.remove("loading");
});