<template>
  <div class="qte-focus">
    <p class="qte-focus__title">
      Appuyer sur espace
    </p>

    <div class="qte-focus__indicator">
      <div
        :style="{ width: valuePercent }"
        :class="{isFinish: isFinish}"
      />
    </div>
  </div>
</template>

<script setup>
import RAFManager from '~~/webgl/Utils/RAFManager';

const props = defineProps({
	duration: {
		type: Number,
		default: 2000,
	}
})

const emit = defineEmits(['updated', 'onKeydown', 'onKeyup', 'onFinish', 'onInit', 'onEnd'])

const value = ref(0)
const valuePercent = computed(() => (value.value / props.duration) * 100 + '%')
const isFinish = ref(false)

//
// events
//
let keydown = 0
const onKeyDown = (ev) => {
	if (ev.code === 'Space') {
		keydown = 1
		emit('onKeydown')
	}
}
const onKeyUp = (ev) => {
	if (ev.code === 'Space') {
		keydown = -1
		emit('onKeyup')
	}
}

onMounted(() => {
	document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)

	// init raf
	RAFManager.add('QteFocus', (time, deltaTime) => {
		value.value += deltaTime * keydown
		value.value = Math.min(props.duration, Math.max(0, value.value))

		emit('updated', value.value)

		if (value.value === props.duration) {
			destroyedEvents()
			isFinish.value = true
			emit('onFinish')
		}
	})

	emit('onInit')
})

//
// on unmount
//
const destroyedEvents = () => {
	RAFManager.remove('QteBalance')
	document.removeEventListener('keydown', onKeyDown)
	document.removeEventListener('keyup', onKeyUp)
}
onUnmounted(() => {
	destroyedEvents()

	emit('onEnd')
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

			&.isFinish {
				background-color: green;
			}
		}
	}
}
</style>
