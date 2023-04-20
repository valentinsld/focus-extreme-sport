<template>
  <div
    class="qte-figure"
  >
    <QteFigureChild
      v-for="i in 3"
      :key="i"
      ref="figures"
      :keyboard-key="keyPressed"
      :valid-key="dataChildren[i - 1].validKey"
      :class="{
        'is-visible': dataChildren[i - 1].isVisible,
        'is-animated': dataChildren[i - 1].isAnimated,
        'is-clickable': dataChildren[i - 1].isClickable
      }"
      :duration="dataChildren[i - 1].duration"
      :delay="dataChildren[i - 1].delay"
      @is-clickable="enableClick(i)"
    >
      <span>{{ i }}</span>
    </QteFigureChild>
  </div>
</template>

<script setup>

const figures = ref()
const keyPressed = ref()

const dataChildren = reactive([
	{
		validKey: 'ArrowRight',
		isVisible: false,
		isAnimated: false,
		isClickable: false,
		delay: 3000,
		duration: 2000
	},
	{
		validKey: 'ArrowUp',
		isVisible: false,
		isAnimated: false,
		isClickable: false,
		delay: 5000,
		duration: 2000
	},
	{
		validKey: 'ArrowLeft',
		isVisible: false,
		isAnimated: false,
		isClickable: false,
		delay: 7000,
		duration: 2000
	}
])


onMounted(()=> {
	window.addEventListener('keyup', keyPress)

	for (let i = 0; i < figures.value.length; i++) {
		setTimeout(()=> {
			dataChildren.value[i].isVisible = true
			dataChildren.value[i].isAnimated = true
		}, dataChildren.value[i].delay)
	}
})

onUnmounted(()=> {
	window.removeEventListener('keyup', keyPress)
	for (let i = 0; i < figures.value.length; i++) {
		dataChildren.value[i].isVisible = false
		dataChildren.value[i].isAnimated = false
		dataChildren.value[i].isClickable = false
	}
})

const keyPress = (e) => {
	keyPressed.value = e.key;
		checkKey()
}


function checkKey() {
	for (let i = 0; i < figures.value.length; i++) {
		const element = figures.value[i];

		if(dataChildren.value[i].isClickable) {
			if(keyPressed.value === dataChildren.value[i].validKey) {
				element.$el.classList.remove('is-visible')
			}
		}
	}
}

function enableClick(index) {
	dataChildren.value[index - 1].isClickable = true
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
