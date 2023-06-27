<template>
  <div
    id="loader"
    class="loader"
  >
    <svg
      class="loader__star"
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.001 41.9998C17.6783 32.0957 9.90517 24.3226 0.00106891 20.9999C9.90517 17.6772 17.6783 9.9041 21.001 0C24.3237 9.9041 32.0968 17.6772 42.0009 20.9999C32.0968 24.3226 24.3237 32.0957 21.001 41.9998Z"
        fill="black"
      />
    </svg>

    <p class="loader__text">
      L'adrénaline monte... <br>Prépare-toi pour l’expérience FOCUS !
    </p>

    <div
      class="loader__percent"
      :style="`--percent: ${percent}%`"
    />
  </div>
</template>

<script setup>
import WebGL from '~~/webgl';

const percent = ref(0);

onMounted(() => {
	requestAnimationFrame(getLoaderData);
});

function getLoaderData() {
	const WEBGL = new WebGL();

	WEBGL.assets.on('ressourceLoad', (p) => {
		if (!p) return;
		percent.value = p;
	})
}
</script>

<style lang="scss">
.loader {
	position: fixed;
	z-index: 3;

	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	background-color: colors(white);

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	&__star {
		margin: auto;

		animation: rotationStar 2s infinite cubic-bezier(.42, 0, .44, 1);

		@keyframes rotationStar {
			0% {
				transform: rotate(0deg);
			}

			60%,
			100% {
				transform: rotate(540deg);
			}
		}
	}

	&__text {
		text-align: center;

		margin-bottom: 6rem;
		margin-top: -6rem;

		font-size: 1.8rem;
		font-family: const(font-gotham);
		line-height: 1.5;
		font-weight: 400;

		color: colors(black);
		opacity: 0.3;
	}

	&__percent {
		position: relative;

		height: 5px;
		width: 100%;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;

			background-color: colors(f_green);

			transition: transform 500ms ease-in-out;

			transform-origin: left center;
			transform: scaleX(var(--percent));
		}
	}
}
</style>
