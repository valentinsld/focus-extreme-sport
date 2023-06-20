<template>
  <div
    ref="container"
    :class="{
      'reward-item': true,
      'is-visible': isVisible,
    }"
  >
    <img
      class="reward-item__sticker"
      :src="`/stickers/${score}-${sport}.png`"
    >

    <p class="reward-item__text">
      {{ text }}
    </p>

    <button
      class="reward-item__btn  btn-underline"
      @click="next"
    >
      <span>
        Suivant
      </span>
    </button>
  </div>
</template>

<script setup>
defineProps({
	score: {
		type: Number,
		required: true,
	},
	sport: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	isVisible: {
		type: Boolean,
		default: false,
	},
})

const container = ref(null)
const emit = defineEmits(['next'])

function next() {
	emit('next')
}

onMounted(() => {
	// add add event on click
	console.log(container.value)
	container.value.addEventListener('click', next)
})
</script>

<style lang="scss">
$bottom: 40px;
$right: 70px;

.reward-item {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	pointer-events: none;

	&.is-visible {
		z-index: 1;
		pointer-events: initial;

		.reward-item__sticker {
			transition-delay: 0.52s;
			transition-duration: 1s;
			transition-timing-function: ease(out-bounce);
			transform: translate(-50%, -50%) rotate3d(0.5, 1, 0, 360deg) scale(1);
		}

		.reward-item__text,
		.reward-item__btn {
			transition-delay: 1s;
			transition-duration: 0.25s;
			opacity: 1 !important;
		}
	}

	&__sticker {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate3d(0, 0, 0, 0deg) scale(0);

		width: 50%;
		height: 50%;
		object-fit: contain;
		max-width: 500px;
		max-height: 300px;

		perspective: 10px;
		perspective-origin: center center;

		transition: transform 0.5s ease(ease_out-cubic);
	}

	&__text,
	&__btn {
		opacity: 0;
		transition: opacity 0.3s ease(ease_out-cubic);
	}

	&__text {
		position: absolute;
		bottom: $bottom;
		left: 50%;
		transform: translateX(-50%);
		max-width: 400px;

		text-align: center;
		font-size: 2rem;
		font-weight: 400;
		color: colors(white);
	}

	&__btn {
		position: absolute !important;
		bottom: $bottom;
		right: $right;

		color: colors(white);
	}
}
</style>
