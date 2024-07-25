const trackContainer = document.querySelector('.picture__slider');
const carouselImage = document.querySelectorAll('.MCImageContainer');
const btnPrev = document.querySelector('.MCBtnPrev');
const btnNext = document.querySelector('.MCBtnNext');
const titles = document.querySelectorAll('.MCSlideContent');
const titleAnimationClass = 'MCTextAnim';

let amountToMove = carouselImage[0].offsetWidth;

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

// Ajouter des écouteurs d'événements pour le redimensionnement et le clic sur les boutons "précédent" et "suivant"
window.addEventListener('resize', handleResize);
btnNext.addEventListener('click', handleClickNext);
btnPrev.addEventListener('click', handleClickPrev);

// Ajouter un écouteur d'événement pour la vérification de visibilité en temps réel
window.addEventListener('scroll', handleVisibilityCheck);
window.addEventListener('resize', handleVisibilityCheck);

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = trackContainer.children[count].lastElementChild;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                videoElement.play();
                observer.unobserve(videoElement);
            } else {
                videoElement.pause();
            }
        });
    }, observerOptions);

    observer.observe(videoElement);
});