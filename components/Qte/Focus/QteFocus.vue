<template>
  <div class="qte-focus">
    <p class="qte-focus__title">
      Maintiens la touche espace
    </p>

    <div
      class="qte-focus__indicator"
      :style="{
        '--green-percent': 100 - gradientMove * 10 + '%',
        '--blue-percent': 100 - gradientMove * 7 + '%',
        '--purple-percent': 100 - gradientMove * 2 + '%',
      }"
    >
      <div
        :style="{ width: valuePercent }"
        :class="[
          {isMax: valuePercent === '100%'},
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
import { clamp } from '~~/webgl/Utils/Math';
const SCORE_MAX = 25
const START_SPEED = 3

const store = useStore()

const props = defineProps({
	duration: {
		type: Number,
		default: 3000,
	}
})

const emit = defineEmits(['updated', 'onKeydown', 'onKeyup', 'onFinish'])

const value = ref(0)
const gradientMove = ref(0)
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

		const speedLine = START_SPEED + (value.value * 10 / props.duration)
		webgl.camera.speedLine.setSpeed(speedLine)

		score += deltaTime * Math.max(keydown, 0)
		scoreMax += deltaTime

		disto = (value.value / props.duration)

		if(value.value === 3000 && keyPressed.value) {
			gradientMove.value += deltaTime
			gradientMove.value =clamp(gradientMove.value, 0, 100)
		} else if(!keyPressed.value) {
			gradientMove.value += deltaTime * keydown
			gradientMove.value = clamp(gradientMove.value, 0, 100)
		}

		if(webgl.fxComposer.isUpdatable) {
			webgl.fxComposer.postProcessingPass.uniforms.uK0.value.x = -(disto * .3) // (disto * .1) * 3
			webgl.fxComposer.postProcessingPass.uniforms.uK0.value.y = -(disto * .3) // (disto * .1) * 3
			webgl.fxComposer.postProcessingPass.uniforms.uAmount.value = (disto * 0.0075)
			webgl.fxComposer.postProcessingPass.uniforms.uDarkness.value = (disto * 0.35)
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

	gradientMove.value = 0
	RAFManager.remove('QteFocus')
	webgl.camera.speedLine.setSpeed()
	webgl.fxComposer.resetEffect()
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

	&__indicator {
		width: 100%;
		height: $indicator;

		background-color: rgba(colors(white), .5);
		// border-radius: $indicator;
		clip-path: url(#focusBar);

		&>div {
			height: 100%;
			background-color: colors(white);
			transition: background .3s ease(out-swift);

			&.isMax {
				// background-color: colors(f_green);
				background: linear-gradient(270deg, #C4FE1F var(--green-percent), #1FF1FE var(--blue-percent), #A7A6F0 var(--purple-percent));
				animation: gradient .5s linear backwards infinite;
			}

			&.isFlashing {}
		}
	}
}
</style>
