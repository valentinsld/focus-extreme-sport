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
        'is-clickable': objectStates[i - 1].isClickable
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

const figures = ref()
const keyPressed = ref()
const objectStates = reactive([])

const props = defineProps({
	dataChildren: {
		type: Array,
		default: () => []
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
		isClickable: false
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
})

onUnmounted(()=> {
	window.removeEventListener('keyup', keyPress)

	for (let i = 0; i < figures.value.length; i++) {
		objectStates[i].isVisible = false
		objectStates[i].isAnimated = false
		objectStates[i].isClickable = false
	}
})

const keyPress = (e) => {
	keyPressed.value = e.key;
	checkKey()
}

function checkKey() {
	for (let i = 0; i < figures.value.length; i++) {
		const element = figures.value[i];

		if(objectStates[i].isClickable) {
			if(keyPressed.value === props.dataChildren[i].validKey) {
				element.$el.classList.remove('is-visible')
			}
		}
	}
}

function enableClick(index) {
	objectStates[index].isClickable = true
}

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
