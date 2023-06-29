<template>
  <div
    v-if="isNotAvailable"
    class="not-available"
  >
    <img src="/logo.png">
    <p>
      {{ texte }}<br>
      Mais rassure-toi ça arrive bientôt !
    </p>

    <img src="/Star.svg">
  </div>
</template>

<script setup>
const isNotAvailable = ref(false);
const texte = ref('')

onMounted(() => {
	testIsAvailable()

	window.addEventListener('resize', testIsAvailable)
})

function testIsAvailable() {
	if (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0)) {
		isNotAvailable.value = true
		texte.value = 'L’expérience n’est pas disponible sur écran tactile.'
	} else if (window.innerWidth < 1200) {
		isNotAvailable.value = true
		texte.value = 'Ton écran est trop petit pour accéder à l’expérience.'
	} else {
		isNotAvailable.value = false
	}
}
</script>

<style lang="scss" scoped>
.not-available {
	position: absolute;
	z-index: 100;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	padding: 10%;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 2rem;

	font-size: 2rem;
	color: colors(black);
	background-color: colors(white);
	background-image: url('/Fond.png');
	background-size: cover;
	background-repeat: no-repeat;


	&>img {
		max-width: 320px;
	}

	&>p {
		text-align: center;
		max-width: 550px;

		line-height: 2;

		font-weight: 325;
	}
}
</style>
