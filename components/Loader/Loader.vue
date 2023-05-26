<template>
  <div id="loader">
    <div />
  </div>
</template>

<script setup></script>

<style lang="scss">
#loader {
	position: fixed;
	z-index: 3;

	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	background-color: colors(white);

	div {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);

		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 4px solid colors(f_pink);
		clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 0 100%, 0 70%, 50% 50%);

		animation: loader 3s infinite ease(ease_in-out-cubic);

		@keyframes loader {
			0% {
				transform: translate3d(-50%, -50%, 0) rotate(0deg);
				border-color: colors(f_pink);
			}

			33.33% {
				transform: translate3d(-50%, -50%, 0) rotate(360deg);
				border-color: colors(f_purple);
			}

			66.66% {
				transform: translate3d(-50%, -50%, 0) rotate(720deg);
				border-color: colors(f_green);
			}

			100% {
				transform: translate3d(-50%, -50%, 0) rotate(1080deg);
				border-color: colors(f_pink);
			}
		}
	}
}
</style>
