<template>
  <div class="qte-focus">
    <p class="qte-focus__title">
      Entre dans la zone de flow avec
      <span class="space-container">
        <span class="space-wrapper">
          <svg
            viewBox="0 0 916 127"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.727.82h914.438s-21.28 38.207-21.28 62.688 21.28 62.688 21.28 62.688H.727S17.98 86.552 17.98 62.07C17.98 37.59.727.82.727.82Z"
              stroke="#fff"
              stroke-width="5"
            />
          </svg>
          <span>espace</span>
        </span>
      </span>
    </p>

    <div
      class="qte-focus__indicator"
      :style="`--zone-1: ${ZONE[0]}; --zone-2: ${ZONE[1]}`"
    >
      <div
        :style="{ width: valuePercent }"
        :class="[
          {isFocus: isFocus},
          {isFlashing: valuePercent === '100%' && score >= 4}
        ]"
      />
    </div>
    <svg
      width="0"
      height="0"
    >
      <defs>
        <clipPath id="focusBar">
          <path
            d="M0 8h628a7.545 7.545 0 0 1 0-8H0a11.392 11.392 0 0 1 0 8Z"
            fill="#C4FE1F"
          />
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import useStore from '~~/stores';
import WebGL from '~~/webgl';
import RAFManager from '~~/webgl/Utils/RAFManager';
import NoEventKeyboard from '../NoEvent.js';
// import { clamp } from '~~/webgl/Utils/Math';

const SCORE_MAX = 25
const START_SPEED = 3
const ZONE = [0.7, 0.85]
const ZONE_MIDDLE = (ZONE[1] - ZONE[0]) / 2 + ZONE[0]

const store = useStore()

const props = defineProps({
	duration: {
		type: Number,
		default: 3000,
	}
})

const emit = defineEmits(['updated', 'onKeydown', 'onKeyup', 'onFinish'])

const value = ref(0)
const isFocus = ref(false)
const keyPressed = ref(false)
const valuePercent = computed(() => (value.value / props.duration) * 100 + '%')

let score = 0
let scoreMax = 0
let disto = 0

//
// events
//
const noEvent = new NoEventKeyboard({ delay:  props.duration * 0.75 })
let keydown = 0
const onKeyDown = (ev) => {
	if (ev.code === 'Space') {
		keydown = 1
		keyPressed.value = true
		emit('onKeydown')
		noEvent.action()
	}
}
const onKeyUp = (ev) => {
	if (ev.code === 'Space') {
		keydown = -0.5
		keyPressed.value = false
		emit('onKeyup')
	}
}

onMounted(() => {
	const webgl = new WebGL()

	noEvent.action()
	document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)

	// init raf
	RAFManager.add('QteFocus', (time, d, deltaTime) => {
		value.value += deltaTime * keydown * 1000
		value.value = Math.min(props.duration, Math.max(0, value.value))

		// calculate is focus ifvalue is between 0.7 & 0.9
		isFocus.value = value.value / props.duration > ZONE[0] && value.value / props.duration <  ZONE[1]

		const speedLine = START_SPEED + (value.value * 10 / props.duration)
		webgl.camera.speedLine.setSpeed(speedLine)

		score += deltaTime * Math.max(keydown, isFocus.value ? 1 : 0 , 0)
		scoreMax += deltaTime

		// disto = (value.value / props.duration)
		disto = Math.min(value.value / props.duration / ZONE_MIDDLE, 1) - Math.max((value.value / props.duration / ZONE_MIDDLE) - 1, 0) * 2

		if(webgl.fxComposer.isUpdatable) {
			webgl.fxComposer.postProcessingPass.uniforms.uK0.value.x = -(disto * .3) // (disto * .1) * 3
			webgl.fxComposer.postProcessingPass.uniforms.uK0.value.y = -(disto * .3) // (disto * .1) * 3
			webgl.fxComposer.postProcessingPass.uniforms.uAmount.value = (disto * 0.0075)
			webgl.fxComposer.postProcessingPass.uniforms.uDarkness.value = (disto * 0.35)

			if(store.state.gamestate === 'ski') {
				webgl.fxComposer.postProcessingPass.uniforms.uK0.value.x = -(disto * .25) // (disto * .1) * 3
				webgl.fxComposer.postProcessingPass.uniforms.uK0.value.y = -(disto * .25) // (disto * .1) * 3
			}
		}

		emit('updated', value.value)
	})
})

function setScore() {
	store.state.altimetre.scores[store.state.gamestate] += score / scoreMax * SCORE_MAX
}

//
// on unmount
//
const destroyedEvents = () => {
	const webgl = new WebGL()

	RAFManager.remove('QteFocus')
	webgl.camera.speedLine.setSpeed()
	// webgl.fxComposer.resetEffect()
	document.removeEventListener('keydown', onKeyDown)
	document.removeEventListener('keyup', onKeyUp)
	noEvent.destroy()

	setScore()
}
onUnmounted(() => {
	destroyedEvents()
})
</script>

<style scoped lang="scss">
$indicator: 10px;

.qte-focus {
	position: absolute;
	top: 85vh;
	left: 50vw;
	transform: translate3d(-50%, 0, 0);

	width: 500px;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	&__title {
		font-size: 1.8rem;
		font-family: const(font-gotham);
		font-weight: 400;
		// text-transform: uppercase;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;

		white-space: nowrap;

		.space-container {
			position: relative;
			margin-left: 1rem;
		}

		.space-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			width: 15rem;

			svg {
				width: 100%;
			}

			span {
				position: absolute;
				color: colors(white);
				font-size: 1.2rem;
				font-family: const(font-akira);
				font-weight: 900;
			}
		}
	}

	&__indicator {
		width: 100%;
		height: $indicator;

		$white: rgba(255, 255, 255, 0.5);
		$zone: #c3fe1f;

		background: linear-gradient(to right,
				$white 0%,
				$white calc(var(--zone-1, 0.7) * 100% - 1px),
				$zone calc(var(--zone-1, 0.7) * 100%),
				$zone calc(var(--zone-2, 0.85) * 100%),
				$white calc(var(--zone-2, 0.85) * 100% + 1px),
				$white 100%);

		// border-radius: $indicator;
		clip-path: url(#focusBar);

		&>div {
			height: 100%;
			background-color: colors(white);
			transition: background .3s ease(out-swift);

			&.isFocus {
				background: linear-gradient(-45deg, #C4FE1F, #1FF1FE, #A7A6F0, #C4FE1F);
				background-size: 400% 400%;
				animation: gradient 5s linear backwards infinite;
			}

			&.isFlashing {}
		}
	}
}
</style>
