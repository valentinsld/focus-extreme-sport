<template>
  <button
    class="btn-underline"
  >
    <span>
      {{ props.text }}
    </span>
  </button>
</template>

<script setup>

const props = defineProps({
  text: {
	type: String,
	required: true
  }
})

</script>

<style lang="scss" scoped>
.btn-underline {
	position: relative;
	border: none;
	background-color: transparent;
	pointer-events: all;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	opacity: 0;
	transition: opacity .3s ease(out-swift);

	&.is-visible {
		opacity: 1;
	}

	&:hover {
		span {
			&::after {
				transform: scaleX(1);
			}
		}
	}

	span {
		display: block;
		position: relative;
		font-family: const(font-akira);
		font-weight: 900;
		font-size: 2.5rem;

		&::after {
			content: "";
			position: absolute;
			display: block;
			width: 100%;
			height: 1px;
			background-color: currentColor;
			bottom: -5%;
			transform-origin: center center;
			transform: scaleX(0);
			transition: transform .35s ease(out-swift);
		}
	}
}
</style>
