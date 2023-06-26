<template>
  <div
    ref="container"
    :class="{
      'reward-item': true,
      'is-visible': isVisible,
    }"
  >
    <div class="reward-item__sticker">
      <div
        :class="`shine score-${score}`"
        :style="`--mask: url('${src}')`"
      />
      <img :src="src">
    </div>

    <p class="reward-item__text">
      {{ CONTENT_STICKERS[sport][score - 1] }}
    </p>

    <CtaUnderline
      class="reward-item__btn"
      text="Suivant"
      @click="next"
    />
  </div>
</template>

<script setup>
import CONTENT_STICKERS from '~~/content/stickers.json'
import CtaUnderline from '~~/components/Common/CtaUnderline.vue';

const props = defineProps({
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
const src = computed(() => `/stickers/${props.score}-${props.sport}.png`)

function next() {
	emit('next')
}

onMounted(() => {
	// add add event on click
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

			.shine {
				animation: shineOp 1.5s ease-in-out 0.5s forwards;

				@keyframes shineOp {
					0% {
						opacity: 0;
						background-position: center, 0% var(--background-y), var(--background-x) var(--background-y), var(--background-x) var(--background-y);
					}

					50% {
						opacity: 0.4;
						background-position: center, 0% 0%, 0% 0%, 0% 0%;
					}

					100% {
						opacity: 0;
						background-position: center, 0% var(--background-y), var(--background-x) var(--background-y), var(--background-x) var(--background-y);
					}
				}
			}
		}

		.reward-item__text,
		.reward-item__btn {
			transition-delay: 1s;
			transition-duration: 0.25s;
			opacity: 1 !important;
		}
	}

	&__sticker {
		--angle: 20deg;

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate3d(0, 0, 0, 0deg) scale(0);

		width: 50%;
		height: 50%;
		object-fit: contain;
		max-width: 500px;
		max-height: 300px;

		perspective: 500px;
		perspective-origin: center center;

		transition: all 0.75s ease(ease_out-cubic);

		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			max-height: 100%;
			max-width: 100%;
		}

		.shine {
			--pointer-x: 50%;
			--pointer-y: 50%;
			--background-x: 30%;
			--background-y: 30%;

			--sunpillar-1: hsl(2, 100%, 73%);
			--sunpillar-2: hsl(53, 100%, 69%);
			--sunpillar-3: hsl(93, 100%, 69%);
			--sunpillar-4: hsl(176, 100%, 76%);
			--sunpillar-5: hsl(228, 100%, 74%);
			--sunpillar-6: hsl(283, 100%, 73%);

			&.score-2,
			&.score-3 {
				--sunpillar-1: hsl(2, 47%, 68%);
				--sunpillar-2: hsl(53, 59%, 66%);
				--sunpillar-3: hsl(93, 47%, 67%);
				--sunpillar-4: hsl(176, 41%, 64%);
				--sunpillar-5: hsl(228, 35%, 67%);
				--sunpillar-6: hsl(283, 29%, 65%);
			}

			--sunpillar-clr-1: var(--sunpillar-1);
			--sunpillar-clr-2: var(--sunpillar-2);
			--sunpillar-clr-3: var(--sunpillar-3);
			--sunpillar-clr-4: var(--sunpillar-4);
			--sunpillar-clr-5: var(--sunpillar-5);
			--sunpillar-clr-6: var(--sunpillar-6);

			--grain: url("https://poke-holo.simey.me/img/grain.webp");
			--space: 20%;

			// own style
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			transform: translateZ(1px);
			overflow: hidden;
			z-index: 3;
			background: transparent;
			filter: brightness(.85) contrast(2.75) saturate(.65);
			mix-blend-mode: color-dodge;
			opacity: var(--card-opacity);

			will-change: transform,
			opacity,
			background-image,
			background-size,
			background-position,
			background-blend-mode,
			filter;

			mask-image: var(--mask);
			mask-size: contain;
			mask-position: center center;
			mask-repeat: no-repeat;

			--space: 5%;
			--imgsize: 500px;
			background-image: var(--grain),
			repeating-linear-gradient(0deg, var(--sunpillar-clr-1) calc(var(--space)*1), var(--sunpillar-clr-2) calc(var(--space)*2), var(--sunpillar-clr-3) calc(var(--space)*3), var(--sunpillar-clr-4) calc(var(--space)*4), var(--sunpillar-clr-5) calc(var(--space)*5), var(--sunpillar-clr-6) calc(var(--space)*6), var(--sunpillar-clr-1) calc(var(--space)*7)),
			repeating-linear-gradient(var(--angle), #0e152e 0%, hsl(180, 10%, 60%) 3.8%, hsl(180, 29%, 66%) 4.5%, hsl(180, 10%, 60%) 5.2%, #0e152e 10%, #0e152e 12%),
			radial-gradient(farthest-corner circle at var(--pointer-x) var(--pointer-y), hsla(0, 0%, 0%, 0.1) 12%, hsla(0, 0%, 0%, 0.15) 20%, hsla(0, 0%, 0%, 0.25) 120%);
			background-blend-mode: screen,
			hue,
			hard-light;
			background-size: var(--imgsize) 100%,
			200% 700%,
			300% 100%,
			200% 100%;
			background-position: center,
			0% var(--background-y),
			var(--background-x) var(--background-y),
			var(--background-x) var(--background-y);
			filter: brightness(.8) contrast(2.95) saturate(.65);
		}

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
