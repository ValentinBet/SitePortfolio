
// CAROUSEL >>

const trackContainer = document.querySelector('.picture__slider');
const carouselImage = document.querySelectorAll('.MCImageContainer');
const btnPrev = document.querySelector('.MCBtnPrev');
const btnNext = document.querySelector('.MCBtnNext');
const titles = document.querySelectorAll('.MCSlideContent');
let amountToMove = carouselImage[0].offsetWidth;

window.addEventListener('resize',() => {
	amountToMove = carouselImage[0].offsetWidth;
})

let count = 0;
btnNext.addEventListener('click', function() {
	if(count >= carouselImage.length-1 ) return;
	count++;

	trackContainer.style.transition = "transform 0.5s ease-in-out"
	trackContainer.style.transform = 'translateX(-' + amountToMove * count + 'px)';
	btnShowHide(count);
	startVideo(count);
	animateCarousleTitle(count);
});

window.addEventListener('resize',() => {
	const widthGallery = document.querySelector('.MC').offsetWidth;
	trackContainer.style.transition = "none"
	trackContainer.style.transform = 'translateX(-' + amountToMove * count + 'px)';
	/*if(count === carouselImage.length-1) {
		trackContainer.style.transform = 'translateX(-' + amountToMove * count + 'px)';
	}*/
});

btnPrev.addEventListener('click', function() {
	if(count === 0 ) return;
	count--;
	animateCarousleTitle(count);
	trackContainer.style.transition = "transform 0.5s ease-in-out"
	trackContainer.style.transform = 'translateX(-' + amountToMove * count + 'px)';
	btnShowHide(count);
	startVideo(count);
});

function startVideo(count) {
	trackContainer.children[count].lastElementChild.play();
}

function animateCarousleTitle(count) {
	resetTitleAnims();
	titles[count].classList.add('MCTextAnim');
	console.log(count);
}

function resetTitleAnims() {
	titles.forEach(t => {
		t.classList.remove('MCTextAnim');
	});
}


function btnShowHide(count) {
	if(count === 0) {
		btnPrev.classList.add('hide');
		btnNext.classList.remove('hide');
	}
	else if(count === carouselImage.length-1) {
		btnPrev.classList.remove('hide');
		btnNext.classList.add('hide');
	}
	else {
		btnPrev.classList.remove('hide');
		btnNext.classList.remove('hide');
	}
}


// <<