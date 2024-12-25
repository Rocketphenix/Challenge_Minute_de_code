<template>
	<div class="formulaire">
		<div class="progressBar">
			<div class="bar" v-for="(value, index) in stepNeeded" :key="index" :style="barStyle(value, index)"></div>
		</div>

		<form @submit.prevent="validateForm" v-if="step == 0" class="form">
			<label>prenom: </label>
			<input type="text" v-model="partOne.firstName" />

			<label>nom: </label>
			<input type="text" v-model="partOne.lastName" />

			<div class="zoneBtn">
				<div></div>
				<input type="submit" value="Valider" class="btn valid" />
			</div>
		</form>

		<form @submit.prevent="validateForm" v-if="step == 1" class="form">
			<label>Comment se passe votre journée (optionnel)</label>
			<textarea id="story" name="story" rows="5" cols="33" v-model="histoire"></textarea>
			<div class="zoneBtn">
				<button @click="stepBack" type="button" class="btn btnReturn">retour</button>
				<input type="submit" value="Valider" class="btn valid" />
			</div>
		</form>

		<form @submit.prevent="validateForm" v-if="step == 2" class="form">
			<label class="mid">Combien donnez-vous à ce formulaire ?</label>
			<div class="radio-input">
				<input type="radio" value="5" v-model="appreciation" class="star s1" />
				<input type="radio" value="4" v-model="appreciation" class="star s2" />
				<input type="radio" value="3" v-model="appreciation" class="star s3" />
				<input type="radio" value="2" v-model="appreciation" class="star s4" />
				<input type="radio" value="1" v-model="appreciation" class="star s5" />
			</div>
			<div class="zoneBtn">
				<button @click="stepBack" type="button" class="btn btnReturn">retour</button>
				<input type="submit" value="Valider" class="btn valid" />
			</div>
		</form>

		<p v-if="errorMessage" class="error">{{ errorMessage }}</p>

		<div v-if="step == 3" class="form">
			<h2>Merci d'avoir rempli ce formulaire {{ partOne.firstName }}</h2>
			<img src="/public/img/Yippee.jpg" alt="Yippee" />

			<div class="zoneBtn">
				<button @click="stepBack" type="button" class="btn btnReturn">retour</button>
				<button @click="restart" type="button" class="btn valid">recommencer</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			step: 0,
			errorMessage: "",

			partOne: {
				lastName: "",
				firstName: "",
			},
			histoire: "",
			appreciation: "",
			stepNeeded: [1, 2, 3], // Tableau des seuils des étapes
		};
	},

	methods: {
		barStyle(valueNeeded, index) {
			const nbrBars = this.stepNeeded.length; // Nombre total de barres
			return {
				zIndex: nbrBars - index, // Placer chaque bar sous la suivant
				backgroundColor: this.step >= valueNeeded ? "#e1b2f3" : "#f9fafc",
			};
		},

		validateForm() {
			switch (this.step) {
				case 0:
					const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/; // Lettres et tirets autorisés
					if (!namePattern.test(this.partOne.firstName) || !namePattern.test(this.partOne.lastName)) {
						this.errorMessage = "Veuillez entrer un prénom et un nom valides (lettres uniquement).";
					} else {
						this.errorMessage = "";
						this.step++;
					}
					break;

				case 1:
					const trimmedMessage = this.histoire.trim();
					if (trimmedMessage.length > 500) {
						this.errorMessage = "Votre message ne doit pas dépasser 500 caractères.";
					} else if (/<\/?[a-z][\s\S]*>/i.test(this.histoire)) {
						this.errorMessage = "Le contenu ne doit pas contenir de balises HTML.";
					} else {
						this.errorMessage = "";
						this.step++;
					}
					break;

				case 2:
					if (this.appreciation != "") {
						this.errorMessage = "";
						this.step++;
					} else {
						this.errorMessage = "Choisissez une option.";
					}
					break;
			}
		},

		stepBack() {
			this.step--;
		},
		restart() {
			this.step = 0;
			this.errorMessage = "";
			this.partOne = {
				lastName: "",
				firstName: "",
			};
			this.histoire = "";
			this.appreciation = "";
		},
	},
};
</script>
