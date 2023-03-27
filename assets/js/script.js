const trackContainer = document.querySelector('.picture__slider');
const carouselImage = document.querySelectorAll('.MCImageContainer');
const btnPrev = document.querySelector('.MCBtnPrev');
const btnNext = document.querySelector('.MCBtnNext');
const titles = document.querySelectorAll('.MCSlideContent');
const titleAnimationClass = 'MCTextAnim';
let amountToMove = carouselImage[0].offsetWidth;

let count = 0;

// base lang is FR
let lang = 'fr-FR';

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
		element.textContent = arrLang[lang][key];
	});
}

// Update the language on page load
document.addEventListener('DOMContentLoaded', () => {
	updateLanguage();
});

function setLanguage(language) {
	lang = language;

	const langButtons = document.querySelectorAll('.langButton');
	const button = document.getElementById('button_'+lang);
	
	langButtons.forEach((element) => {
		// Update the text of the element with the translation
		if(element.getAttribute('id') != "button_"+lang) {
			element.classList.remove('hide');
		} else {
			element.classList.add('hide');
		}

	});

	updateLanguage();	
}

// function parallax() {
// 	var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
// 	var background = document.querySelector('.background');
// 	background.style.backgroundPositionY = -scrollTop + 'px';
// }
// window.addEventListener('scroll', parallax);

// Ajouter des écouteurs d'événements pour le redimensionnement et le clic sur les boutons "précédent" et "suivant"
window.addEventListener('resize', handleResize);
btnNext.addEventListener('click', handleClickNext);
btnPrev.addEventListener('click', handleClickPrev);

// Ajouter un écouteur d'événement pour la vérification de visibilité en temps réel
window.addEventListener('scroll', handleVisibilityCheck);
window.addEventListener('resize', handleVisibilityCheck);


document.body.classList.add("loading");
window.addEventListener("load", function () {
  document.body.classList.remove("loading");
});

var arrLang = {
	"en-GB": {
		"HELLO": "Hello !",
	},
	"fr-FR": {
		"HELLO": "Bonjour !",
		"PRES_1": "Je suis diplômé de Rubika Valenciennes et actuellement programmeur gameplay sur "+ 
		"Dead Cells sur Bordeaux à Evil Empire.",
		"PRES_2": "Mon expertise se situe dans la conception de jeux en réseau, mais je suis particulièrement "+  
		"attiré par le gameplay et c'est sur Dead Cells que j'ai pu mettre en pratique mes compétences dans "+ 
		"ce domaine.",
		"PRES_3": "J'aime donner de l'impact à chaque coup d'épée, itérer sur des idées et surtout m'assurer que chaque "+
		"partie est plus amusante que la précédente. Vous pourrez trouver sur ce portfolio des exemples de mon "+
		"travail et de mes réalisations, ainsi que des informations sur mon parcours professionnel.",
		"PRES_4": " Bonne visite de mon portfolio ! "
	}
};