<template>
  <Transition name="qte-figures">
    <div
      ref="key"
      class="key"
    >
      <div
        ref="border"
        class="border"
      />
      <slot />
      {{ props.validKey }}
    </div>
  </Transition>
</template>

<script setup>

const key = ref()
const border = ref()

const props = defineProps({
	validKey: {
		type: String,
		default: 'ArrowRight'
	},
	keyboardKey: {
		type: String,
		default: ''
	},
	duration: {
		type: Number,
		default: 1000
	},
	delay: {
		type: Number,
		default: 1000
	}
})

onMounted(()=> {
	key.value.style.setProperty('--duration', `${props.duration}ms`)

	border.value.addEventListener('transitionend', enableClick)
})

onUnmounted(()=> {
	border.value.removeEventListener('transitionend', enableClick)
})

function enableClick() {
	emit('isClickable', )
}

const emit = defineEmits(['isClickable'])

</script>

<style lang="scss" scoped>
.key {
	background-color: #fff;
	width: 50px;
	height: 50px;
	z-index: 1;
	display: block;
	margin: 20px;
	position: relative;
	opacity: 0;
	transition: opacity .3s ease-in-out;

	&.is-visible {
		opacity: 1;
	}

	&.is-animated {
		.border {
			transform: scale(1);
		}
	}

	&.is-clickable {
		background-color: #00FF00;

		.border {
			border: 1px solid #00ff00;
		}
	}

}

.border {
	width: 100%;
	height: 100%;
	position: absolute;
	content: "";
	border: 1px solid red;
	top: 0;
	left: 0;
	z-index: -1;
	transform: scale(2);
	transition: transform var(--duration);
}
</style>
