<template>
  <div
    class="qte-figure"
  >
    <QteFigureChild
      v-for="i in props.dataChildren.length"
      :key="i"
      ref="figures"
      :keyboard-key="keyPressed"
      :valid-key="props.dataChildren[i - 1].validKey"
      :class="{
        'is-visible': objectStates[i - 1].isVisible,
        'is-animated': objectStates[i - 1].isAnimated,
        'is-clickable': objectStates[i - 1].isClickable,
        'is-wrong': objectStates[i - 1].isWrong,
      }"
      :duration="props.dataChildren[i - 1].duration"
      :delay="props.dataChildren[i - 1].delay"
      @is-clickable="enableClick(i - 1)"
    >
      <span>{{ i }}</span>
    </QteFigureChild>
  </div>props.
</template>

<script setup>
import RAFManager from '~~/webgl/Utils/RAFManager';

const figures = ref()
const currentFigure = ref(0)
const keyPressed = ref()
const objectStates = reactive([])

const props = defineProps({
	dataChildren: {
		type: Array,
		default: () => []
	},
	delayWrong: {
		type: Number,
		default: 1500
	}
	// To use it in parent, create a reactive const
	// with value of the key, the delay before appear,
	// and the duration before click is enable (also the time of the anime)

	// const dataChildren = reactive([
	// 	{
	// 		validKey: 'ArrowRight',
	// 		delay: 3000,
	// 		duration: 2000
	// 	},
	// ])
})

for (let i = 0; i < props.dataChildren.length; i++) {

	const state = {
		isVisible: false,
		isAnimated: false,
		isClickable: false,
		isWrong: false,
		hasBeenClicked: false
	}
	objectStates.push(state)

}

onMounted(()=> {
	window.addEventListener('keyup', keyPress)

	for (let i = 0; i < figures.value.length; i++) {
		setTimeout(()=> {
			objectStates[i].isVisible = true
			objectStates[i].isAnimated = true
		}, props.dataChildren[i].delay)
	}

	// enable slowMode
	RAFManager.setSpeed(0.1);
})

onUnmounted(()=> {
	window.removeEventListener('keyup', keyPress)

	for (let i = 0; i < figures.value.length; i++) {
		objectStates[i].isVisible = false
		objectStates[i].isAnimated = false
		objectStates[i].isClickable = false
	}

	// disable slowMode
	RAFManager.setSpeed(1);
})

const keyPress = (e) => {
	keyPressed.value = e.key;
	checkKey()
}

function checkKey() {
	const currentObject = objectStates[currentFigure.value]
	if (!currentObject.isClickable) return
	if (keyPressed.value === props.dataChildren[currentFigure.value].validKey) {
		figures.value[currentFigure.value].$el.classList.remove('is-visible')
		objectStates[currentFigure.value].hasBeenClicked = true
	} else {
		currentObject.isWrong = true
	}
	currentFigure.value++
	checkFinish()
}

function checkFinish() {
	if(currentFigure.value === figures.value.length) {
		const isSucess = objectStates.every((objectState) => objectState.hasBeenClicked)
		setFinish(isSucess)
	}
}

function enableClick(index) {
	objectStates[index].isClickable = true

	setTimeout(()=> {
		if (objectStates[index].hasBeenClicked || objectStates[index].isWrong) return
		objectStates[index].isWrong = true
		currentFigure.value++
		checkFinish()
	}, props.delayWrong)
}

function setFinish(isSucess) {
	window.removeEventListener('keyup', keyPress)
	emit('isFinished', isSucess);
}

const emit = defineEmits(['isFinished'])

</script>

<style lang="scss" scoped>
.qte-figure {
	width: 50px;
	height: 50px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
