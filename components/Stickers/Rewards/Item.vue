<template>
  <div
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
      class="reward-item__btn"
      @click="next"
    >
      Suivant ->
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

const emit = defineEmits(['next'])

function next() {
	emit('next')
}
</script>

<style lang="scss" scoped>
$bottom: 80px;
$right: 70px;

.reward-item {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	opacity: 0;
	pointer-events: none;
	transition: opacity 1s ease-in-out;

	&.is-visible {
		transition-delay: 1s;

		pointer-events: initial;
		opacity: 1;
	}

	&__sticker {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		width: 50%;
		height: 50%;
		object-fit: contain;
		max-width: 500px;
		max-height: 300px;
	}

	&__text {
		position: absolute;
		bottom: $bottom;
		left: 50%;

		transform: translateX(-50%);

		color: colors(white);
	}

	&__btn {
		position: absolute;
		bottom: $bottom;
		right: $right;
	}
}
</style>
