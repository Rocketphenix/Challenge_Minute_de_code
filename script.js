// Pré-initialisation des variables
var btnRight = null;
var btnLeft = null;
var slider = null;
var dotter = null;
var imgs = null; // Récupère chaque image
var recupImg = null;
var slide = 0; // À quelle slide le slider est
var isDragging = false; // Permet de vérifier si le slider doit suivre ou non la souris
var startX = 0; // La position de la souris
var currentSlide = 0;
var previousSlide = 0;

// Tableau pour stocker les positions cumulées des slides
var tabImgWidth = [];

document.addEventListener("DOMContentLoaded", function () {
	btnRight = document.getElementById("btnRight");
	btnLeft = document.getElementById("btnLeft");
	slider = document.getElementById("slider");
	dotter = document.getElementById("dotter");
	imgs = document.querySelectorAll(".img");
	recupImg = document.getElementById("recupImg");

	// Calculer les positions cumulées des slides
	let cumulativeWidth = 0;
	imgs.forEach((img) => {
		tabImgWidth.push(cumulativeWidth); // Ajouter la position cumulée
		cumulativeWidth += img.offsetWidth; // Ajouter la largeur de l'image à la position

		// Rajouter les ronds pour chaque
		let dot = document.createElement("div");
		dot.classList.add("dot");

		dotter.appendChild(dot);
	});
	updateDot();

	// Ajouter les événements de clic sur les boutons
	btnRight.addEventListener("click", slidingRight);
	btnLeft.addEventListener("click", slidingLeft);
	// Ajouter les événements pour le déplacement à la souris
	slider.addEventListener("mousedown", startDrag);
	slider.addEventListener("mousemove", drag);
	slider.addEventListener("mouseup", stopDrag);
	slider.addEventListener("mouseleave", stopDrag);
	// et les événements pour le déplacement au doigt
	slider.addEventListener("touchstart", startDrag);
	slider.addEventListener("touchmove", drag);
	slider.addEventListener("touchend", stopDrag);

	recupImg.addEventListener("submit", function (e) {
		e.preventDefault(); // Empêche le rechargement de la page
		addImg();
	});
});

// Sur appui de la flèche de droite, le slider passe à l'image suivante
function slidingRight() {
	if (slide < imgs.length - 1) {
		slide++;
	} else {
		slide = 0; // Retour à la première slide
	}
	updateSliderPosition();
}
// Sur appui de la flèche de gauche, le slider passe à l'image précédente
function slidingLeft() {
	if (slide > 0) {
		slide--;
	} else {
		slide = imgs.length - 1; // Retour à la dernière slide
	}
	updateSliderPosition();
}

// Met à jour la position du slider en fonction de la slide actuelle
function updateSliderPosition() {
	// Calculer la nouvelle position du slider
	currentSlide = -tabImgWidth[slide];
	previousSlide = currentSlide;

	// Appliquer la propriété 'margin-left' pour déplacer le slider
	slider.style.marginLeft = `${currentSlide}px`;

	// Mettre à jour l'état des dots
	updateDot();
}

// Lorsque la souris est appuyée, commence à suivre la souris
function startDrag(event) {
	event.preventDefault();
	isDragging = true;
	startX = event.type.includes("touch") ? event.touches[0].clientX : event.clientX;
	slider.classList.add("grabbing");
}

// Pendant le glissement, met à jour la position du slider
function drag(event) {
	if (!isDragging) return;

	const currentX = event.type.includes("touch") ? event.touches[0].clientX : event.clientX;
	const deltaX = currentX - startX;
	currentSlide = previousSlide + deltaX;

	// Déplacer le slider en modifiant la propriété 'margin-left'
	slider.style.marginLeft = `${currentSlide}px`;
}

// Lorsque la souris est relâchée, ajuste à la slide la plus proche
function stopDrag() {
	if (!isDragging) return;
	isDragging = false;
	slider.classList.remove("grabbing");

	// Trouver la slide la plus proche
	let closestSlideIndex = 0;
	let minDistance = Infinity;

	tabImgWidth.forEach((pos, index) => {
		const distance = Math.abs(currentSlide + pos);
		if (distance < minDistance) {
			minDistance = distance;
			closestSlideIndex = index;
		}
	});

	// Mettre à jour l'index de la slide et la position du slider
	slide = closestSlideIndex;
	updateSliderPosition();
}

function addImg() {
	const fileInput = document.getElementById("newImage");
	const file = fileInput.files[0]; // Récupère le fichier envoyé par l'utilisateur

	// Vérifie qu'il y est une image
	if (!file) {
		alert("Veuillez sélectionner un fichier.");
		return;
	}
	// Vérifie que le fichier est bien une image
	if (!file.type.startsWith("image/")) {
		alert("Le fichier sélectionné n'est pas une image.");
		return;
	}

	// Utilise FileReader pour lire l'image
	const reader = new FileReader();
	reader.onload = function (event) {
		const imageSrc = event.target.result; // Contenu de l'image en base64

		// Crée l'image et l'ajoute au slider
		const newImg = document.createElement("img");
		newImg.setAttribute("src", imageSrc);
		newImg.setAttribute("alt", "Image inserer par l'utilisateur");
		const divImg = document.createElement("div");
		divImg.classList.add("img");

		divImg.appendChild(newImg);
		document.getElementById("slider").appendChild(divImg);

		// Met à jour la liste des images et les positions des slides
		imgs = document.querySelectorAll(".img");

		// Recalculer les positions cumulées
		tabImgWidth = [];
		let cumulativeWidth = 0;
		imgs.forEach((img) => {
			tabImgWidth.push(cumulativeWidth); // Ajouter la position cumulée
			cumulativeWidth += img.offsetWidth; // Ajouter la largeur de l'image à la position
		});

		// Rajout du nouveau rond
		let dot = document.createElement("div");
		dot.classList.add("dot");
		dotter.appendChild(dot);
		updateDot();
	};

	reader.onerror = function () {
		alert("Erreur lors de la lecture du fichier.");
	};
	reader.readAsDataURL(file); // Lit le fichier et déclenche 'onload'
	fileInput.value = "";
}

// Mettre le rond actif plus gros
function updateDot() {
	let dots = document.querySelectorAll(".dot");

	console.log(dots);

	for (let i = 0; i < dots.length; i++) {
		if (i === slide) {
			dots[i].classList.add("actif");
		} else {
			dots[i].classList.remove("actif");
		}
	}

	// Ajouter un événement de clic à chaque dot
	dots.forEach((dot, index) => {
		dot.addEventListener("click", function () {
			teleportSlide(index); // Aller à la slide correspondant au dot cliqué
		});
	});
}

function teleportSlide(index) {
	// Mettre à jour l'index de la slide
	slide = index;

	updateSliderPosition();
}
