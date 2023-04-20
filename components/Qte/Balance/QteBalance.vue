<template>
  <div class="qte-balance">
    <div
      class="qte-balance__indicator"
      :style="{ transform: `translateX(${value * 250}px)` }"
    />
  </div>
</template>

<script setup>
import RAFManager from '~~/webgl/Utils/RAFManager';

const props = defineProps({
  duration: {
	type: Number,
	default: 20000,
  },
  delayChange: {
	type: Number,
	default: 2500,
  },
  maxSameValue: {
	type: Number,
	default: 5,
  },
})

const emit = defineEmits(['updated', 'onKeydown', 'onKeyup', 'onInit', 'onEnd'])

let targetValue = 0
let value = ref(0)


//
// events
//
let keydown = 0
const onKeyDown = (ev) => {
	if (['ArrowLeft', 'KeyA'].includes(ev.code)) {
		keydown = -1
		emit('onKeydown')
	} else if (['ArrowRight', 'KeyD'].includes(ev.code)) {
		keydown = 1
		emit('onKeydown')
	}
}
const onKeyUp = (ev) => {
	if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(ev.code)) {
		keydown = 0
		emit('onKeyup')
	}
}

onMounted(() => {
	document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)

	// init raf
	RAFManager.add('QteBalance', (time, deltaTime) => {
		value.value += deltaTime * 0.0003 * targetValue + deltaTime * 0.0005 * keydown
		value.value = Math.min(1, Math.max(-1, value.value))

		emit('updated', value.value)
	})

	emit('onInit')
})


// random value -1 or 1
let sameValue = 0
const randomValue = () => {
	if (Math.abs(value.value) > 0.5) return targetValue

	const r = Math.random() < 0.5 ? -1 : 1
	if (r === targetValue) {
		sameValue++

		if (sameValue >= props.maxSameValue) {
			sameValue = 0
			return r * -1
		}
	}
	return r
}

//
// Change each delay
//
const interval = setInterval(() => {
	targetValue = randomValue()
}, props.delayChange);


//
// on unmount
//
onUnmounted(() => {
	RAFManager.remove('QteBalance')
	document.removeEventListener('keydown', onKeyDown)
	document.removeEventListener('keyup', onKeyUp)
	clearInterval(interval)

	emit('onEnd')
})
</script>

<style scoped lang="scss">
$indicator: 10px;

.qte-balance {
	position: absolute;
	top: 85vh;
	left: 50vw;
	transform: translate3d(-50%, 0, 0);

	width: 500px;
	height: $indicator;

	display: flex;
	align-items: center;
	justify-content: center;

	border: 1px solid black;

	background: rgb(255, 0, 0);
	background: linear-gradient(90deg, rgba(255, 0, 0, 1) 0%, rgba(255, 161, 0, 1) 30%, rgba(20, 255, 0, 1) 50%, rgba(255, 161, 0, 1) 70%, rgba(255, 0, 0, 1) 100%);

	&__indicator {
		width: $indicator;
		height: $indicator;

		background-color: white;
		border: 1px solid black;
		border-radius: 50%;
	}
}
</style>
