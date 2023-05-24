<template>
  <!-- <div class="qte-balance">
    <div
      class="qte-balance__indicator"
      :style="{ transform: `translateX(${value * 250}px)` }"
    />
  </div> -->

  <div
    ref="balance"
    class="balance"
  >
    <div class="gauge">
      <svg
        viewBox="0 0 2092 483"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      ><path
        d="M1046 0C627.409 0 252.601 187.457.945 483 138.13 337.167 539.198 68.5 1046 68.5c506.8 0 907.87 268.667 1045.05 414.5C1839.4 187.457 1464.59 0 1046 0Z"
        fill="#A5A5A5"
      /></svg>
      <div
        class="cursor"
        :style="{ transform: `translateY(-35%) rotate(${value * 35}deg)` }"
      >
        <svg
          viewBox="0 0 184 184"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="cursor-icon"
        >
          <path
            d="M183.142 91.57a145.346 145.346 0 0 0-91.57 91.572A145.347 145.347 0 0 0 0 91.57 145.347 145.347 0 0 0 91.571 0a145.347 145.347 0 0 0 91.571 91.57Z"
            fill="#C4FE1F"
          />
        </svg>
      </div>
    </div>
    <div class="arrows">
      <div class="left">
        <svg
          viewBox="0 0 202 202"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M201.182.657A225.8 225.8 0 0 1-.001.657 225.8 225.8 0 0 1 0 201.84a225.797 225.797 0 0 1 201.183 0 225.796 225.796 0 0 1 0-201.183ZM72.986 64.19h34.366l29.75 37.482-29.75 37.483H72.986l29.75-37.483-29.75-37.482Z"
            fill="#fff"
          />
        </svg>
      </div>
      <div class="right">
        <svg
          viewBox="0 0 202 202"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M201.182.657A225.8 225.8 0 0 1-.001.657 225.8 225.8 0 0 1 0 201.84a225.797 225.797 0 0 1 201.183 0 225.796 225.796 0 0 1 0-201.183ZM72.986 64.19h34.366l29.75 37.482-29.75 37.483H72.986l29.75-37.483-29.75-37.482Z"
            fill="#fff"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import useStore from '~~/stores';
import WebGL from '~~/webgl';
import RAFManager from '~~/webgl/Utils/RAFManager';
import NoEventKeyboard from '../NoEvent.js';
const SCORE_MAX = 50

const store = useStore()

const props = defineProps({
  delayChange: {
	type: Number,
	default: 2500,
  },
  maxSameValue: {
	type: Number,
	default: 5,
  },
})

const emit = defineEmits(['updated', 'onKeydown', 'onKeyup'])

let targetValue = 0
let value = ref(0)

let score = 0
let scoreMax = 0

const balance = ref()

const cursorGradient = [
	'#C4FE1F',
	'#FFE500',
	'#FD2B90'
]

//
// events
//
const noEvent = new NoEventKeyboard({})
let keydown = 0
const onKeyDown = (ev) => {
	if (['ArrowLeft', 'KeyA'].includes(ev.code)) {
		keydown = -1
		emit('onKeydown')
		noEvent.action()
	} else if (['ArrowRight', 'KeyD'].includes(ev.code)) {
		keydown = 1
		emit('onKeydown')
		noEvent.action()
	}
}
const onKeyUp = (ev) => {
	if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(ev.code)) {
		keydown = 0
		emit('onKeyup')
	}
}

onMounted(() => {
	const webgl = new WebGL()

	targetValue = randomValue()

	noEvent.action()
	document.addEventListener('keydown', onKeyDown)
	document.addEventListener('keyup', onKeyUp)

	// init raf
	RAFManager.add('QteBalance', (time, d, deltaTime) => {
		value.value += deltaTime * 0.25 * targetValue + deltaTime * 0.6 * keydown
		value.value = Math.min(1, Math.max(-1, value.value))

		RAFManager.setSpeed(Math.max(1 - Math.abs(value.value) * 1.5, 0))
		webgl.camera.speedLine.setSpeed(3 + (0.8 - Math.min(Math.abs(value.value), 0.8)) * 6)

		score += deltaTime * Math.max(Math.abs(keydown), Math.round(1 - value.value * 0.625))
		scoreMax += deltaTime

		// console.log(Math.round(Math.abs(value.value) * (cursorGradient.length - 1)));

		balance.value.style.setProperty('--cursor-color', cursorGradient[Math.round(Math.abs(value.value) * (cursorGradient.length - 1))])

		emit('updated', value.value)
	})
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

function setScore() {
	store.state.altimetre.scores[store.state.gamestate] += score / scoreMax * SCORE_MAX
}

//
// on unmount
//
onUnmounted(() => {
	RAFManager.remove('QteBalance')
	RAFManager.setSpeed(1)
	document.removeEventListener('keydown', onKeyDown)
	document.removeEventListener('keyup', onKeyUp)
	clearInterval(interval)
	noEvent.destroy()

	setScore()
})
</script>

<style scoped lang="scss">
$indicator: 10px;

// .qte-balance {
// 	position: absolute;
// 	top: 85vh;
// 	left: 50vw;
// 	transform: translate3d(-50%, 0, 0);

// 	width: 500px;
// 	height: $indicator;

// 	display: flex;
// 	align-items: center;
// 	justify-content: center;

// 	border: 1px solid black;

// 	background: rgb(255, 0, 0);
// 	background: linear-gradient(90deg, rgba(255, 0, 0, 1) 0%, rgba(255, 161, 0, 1) 30%, rgba(20, 255, 0, 1) 50%, rgba(255, 161, 0, 1) 70%, rgba(255, 0, 0, 1) 100%);

// 	&__indicator {
// 		width: $indicator;
// 		height: $indicator;

// 		background-color: white;
// 		border: 1px solid black;
// 		border-radius: 50%;
// 	}
// }

.balance {
	@include fluidSize("balance-size",
		(bpw(s): 150px,
			bpw(lg): 250px));

	width: var(--balance-size);
	// position: relative;
	position: absolute;
	bottom: 5vh;
	left: 50vw;
	transform: translate3d(-50%, 0, 0);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: column nowrap;

}

.gauge {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-flow: column nowrap;
}

.cursor {
	@include fluidSize("cursor-size",
		(bpw(s): 30px,
			bpw(lg): 40px,
			bpw(xxl): 50px));

	position: absolute;
	width: var(--cursor-size);
	height: var(--cursor-size);
	// transform: translateY(-25%);
	transform-origin: 50% 600%;
}

.cursor-icon {
	path {
		fill: var(--cursor-color);
		transition: fill .7s ease(out-swift);
	}
}

.arrows {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}

.left,
.right {
	@include fluidSize("arrow-size",
		(bpw(s): 20px,
			bpw(lg): 30px,
			bpw(xxl): 40px));

	display: block;
	width: var(--arrow-size);

	svg {}
}

.left {
	transform: translateX(-50%) rotate(180deg);
}

.right {
	transform: translateX(50%);
}
</style>
