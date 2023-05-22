<template>
  <div class="qte-focus">
    <p class="qte-focus__title">
      Maintiens la touche espace
    </p>

    <div class="qte-focus__indicator">
      <div
        :style="{ width: valuePercent }"
        :class="{isMax: valuePercent === '100%'}"
      />
    </div>
  </div>
</template>

<script setup>
import useStore from '~~/stores';
import WebGL from '~~/webgl';
import RAFManager from '~~/webgl/Utils/RAFManager';
import NoEventKeyboard from '../NoEvent.js';
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
const valuePercent = computed(() => (value.value / props.duration) * 100 + '%')

let score = 0
let scoreMax = 0

//
// events
//
const noEvent = new NoEventKeyboard({ delay:  props.duration * 0.75 })
let keydown = 0
const onKeyDown = (ev) => {
	if (ev.code === 'Space') {
		keydown = 1
		emit('onKeydown')
		noEvent.action()
	}
}
const onKeyUp = (ev) => {
	if (ev.code === 'Space') {
		keydown = -0.5
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

		background-color: white;
		border: 1px solid black;
		border-radius: $indicator;

		&>div {
			height: 100%;
			background-color: black;

			&.isMax {
				background-color: green;
			}
		}
	}
}
</style>
