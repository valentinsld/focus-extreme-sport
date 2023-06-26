<template>
  <div
    v-if="isNotAvailable"
    class="not-available"
  >
    <h2 v-html="texte" />
    <p>Veuillez changer d'appareil</p>
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
		texte.value = 'L\'Experience <b>Focus</b> n\'est pas encore disponible sur mobile.'
	} else if (window.innerWidth < 1200) {
		isNotAvailable.value = true
		texte.value = 'L\'Experience <b>Focus</b> n\'est pas encore disponible sur un écran de moins de 1200px de large.'
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

	font-size: 2rem;
	color: colors(black);
	background-color: colors(white);

	&>h2 {
		text-align: center;
		max-width: 550px;

		line-height: 1.25;
		margin-bottom: 1.5rem;

		&>b {
			color: colors(f_purple);
		}
	}
}
</style>
