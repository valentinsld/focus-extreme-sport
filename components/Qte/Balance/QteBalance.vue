<template>
  <div
    ref="balance"
    class="qte-balance"
  >
    <div class="balance">
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
      <div class="gauge">
        <svg
          width="205"
          height="50"
          viewBox="0 0 205 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        ><path
          d="M103.102 11.148C45.186 11.796 10.544 37.306.462 49.981 7.763 33.38 38.509.99 103.103.99s94.793 32.39 101.818 48.99c-9.808-13.214-43.902-39.48-101.818-38.833Z"
          fill="url(#a)"
        /><defs><radialGradient
          id="a"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-98.7221 0 0 -408.066 102.691 25.081)"
        ><stop stop-color="#fff" /><stop
          offset="1"
          stop-color="#fff"
          stop-opacity="0"
        /></radialGradient></defs></svg>
        <div
          class="cursor"
          :style="{ transform: `translateY(-40%) rotate(${value * 35}deg)` }"
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
    <div class="text">
      <p>Centre le curseur !</p>
    </div>
  </div>
</template>

<script setup>
import useStore from '~~/stores';
import WebGL from '~~/webgl';
import RAFManager from '~~/webgl/Utils/RAFManager';
import NoEventKeyboard from '../NoEvent.js';
import { lerp } from '~~/webgl/Utils/Lerp';
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
let disto = 0
let disX = 0
let disY = 0
let chroma = 0
let vignette = 0

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

		balance.value.style.setProperty('--cursor-color', cursorGradient[Math.round(Math.abs(value.value) * (cursorGradient.length - 1))])
		disto = 1 - Math.abs(value.value)

		if(webgl.fxComposer.isUpdatable) {
			// webgl.fxComposer.postProcessingPass.uniforms.uK0.value.x = -(disto * .3) // (disto * .1) * 3
			disX = lerp(disX,-(disto * .3), 0.01) // (disto * .1) * 3
			webgl.fxComposer.postProcessingPass.uniforms.uK0.value.x = disX
			// webgl.fxComposer.postProcessingPass.uniforms.uK0.value.y = -(disto * .3) // (disto * .1) * 3
			disY = lerp(disY,-(disto * .3), 0.01) // (disto * .1) * 3
			webgl.fxComposer.postProcessingPass.uniforms.uK0.value.y = disY

			chroma = lerp(chroma,(disto * 0.0075), 0.01)
			webgl.fxComposer.postProcessingPass.uniforms.uAmount.value = chroma

			vignette = lerp(vignette,(disto * 0.35), 0.01)
			webgl.fxComposer.postProcessingPass.uniforms.uDarkness.value = vignette

			if(store.state.gamestate === 'ski') {
				// webgl.fxComposer.postProcessingPass.uniforms.uK0.value.x = -(disto * .3) // (disto * .1) * 3
				disX = lerp(disX,-(disto * .25), 0.01) // (disto * .1) * 3
				webgl.fxComposer.postProcessingPass.uniforms.uK0.value.x = disX
				// webgl.fxComposer.postProcessingPass.uniforms.uK0.value.y = -(disto * .3) // (disto * .1) * 3
				disY = lerp(disY,-(disto * .25), 0.01) // (disto * .1) * 3
				webgl.fxComposer.postProcessingPass.uniforms.uK0.value.y = disY
			}
		}

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
	// webgl.fxComposer.resetEffect()
	document.removeEventListener('keydown', onKeyDown)
	document.removeEventListener('keyup', onKeyUp)
	clearInterval(interval)
	noEvent.destroy()

	setScore()
})
</script>

<style scoped lang="scss">
$indicator: 10px;

.qte-balance {
	position: absolute;
	bottom: 2.5vh;
	left: 50vw;
	transform: translate3d(-50%, 0, 0);
	display: flex;
	align-items: center;
	flex-direction: column-reverse;
}

.balance {
	// position: relative;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	flex-flow: row nowrap;

}

.gauge {
	@include fluidSize("balance-size",
		(bpw(s): 150px,
			bpw(lg): 250px));

	width: var(--balance-size);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: column nowrap;
	margin: 0 1rem;
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
	transform-origin: 50% 450%;
}

.cursor-icon {
	filter: drop-shadow(0px 0px 5px rgba(colors(black), .5));

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

	display: block;
	width: 3rem;

	svg {
		width: 100%;
		filter: drop-shadow(0px 0px 5px rgba(colors(black), .5));
	}
}

.left {
	transform: rotate(180deg);
}

.text {
	margin-bottom: 1rem;

	p {
		font-size: 1.8rem;
		font-family: const(font-gotham);
		font-weight: 400;
	}
}
</style>
