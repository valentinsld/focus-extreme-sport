<template>
  <div class="qte-choose">
    <div class="qte-choose__arrows">
      <svg
        width="239"
        height="51"
        viewBox="0 0 239 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M34.5223 11.3505L28.5173 2.31996L6.7332 0.484375L-0.000152588 21.2829L6.00479 30.3135L10.9436 15.0579C19.064 28.9866 30.4615 36.3016 43.8567 39.0038C58.7998 42.0182 75.8529 39.217 92.9152 34.6556C103.206 31.9045 113.977 28.3627 124.503 24.9013C131.29 22.6698 137.974 20.4717 144.363 18.5405C161.088 13.4849 176.196 10.1049 188.587 11.2088C209.01 13.0284 230.224 24.001 238.521 50.4496C238.521 24.001 211.638 4.22691 189.386 2.24436C175.105 0.972027 158.521 4.85851 141.759 9.92554C134.889 12.002 128.042 14.2572 121.215 16.5054C110.959 19.883 100.751 23.2448 90.5908 25.9609C73.8058 30.4482 58.4453 32.7654 45.6364 30.1815C34.6658 27.9684 25.2901 22.1091 18.4114 9.99297L34.5223 11.3505Z"
          fill="url(#paint0_linear_1318_3)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1318_3"
            x1="119.261"
            y1="0.484375"
            x2="180.521"
            y2="54.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop :stop-color="directionChoose === 'left' ? COLORS.active : COLORS.normal" />
            <stop
              offset="1"
              :stop-color="directionChoose === 'left' ? COLORS.active : COLORS.normal"
              stop-opacity="0"
            />
          </linearGradient>
        </defs>
      </svg>
      <svg
        width="239"
        height="50"
        viewBox="0 0 239 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M203.999 10.8661L210.004 1.83558L231.788 0L238.522 20.7985L232.517 29.8291L227.578 14.5735C219.457 28.5023 208.06 35.8172 194.665 38.5194C179.722 41.5338 162.669 38.7326 145.606 34.1712C135.316 31.4201 124.544 27.8783 114.018 24.4169C107.232 22.1854 100.547 19.9873 94.1586 18.0562C77.4338 13.0005 62.3252 9.62049 49.9342 10.7245C29.5119 12.544 8.29794 23.5166 0 49.9653C0 23.5166 26.8837 3.74254 49.1355 1.75998C63.416 0.487652 80.0005 4.37413 96.7628 9.44117C103.632 11.5176 110.48 13.7729 117.307 16.0211C127.563 19.3986 137.771 22.7604 147.931 25.4765C164.716 29.9638 180.076 32.281 192.885 29.6971C203.856 27.484 213.231 21.6247 220.11 9.50859L203.999 10.8661Z"
          fill="url(#paint0_linear_1318_2)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1318_2"
            x1="119.261"
            y1="0"
            x2="58"
            y2="54.0156"
            gradientUnits="userSpaceOnUse"
          >
            <stop :stop-color="directionChoose === 'right' ? COLORS.active : COLORS.normal" />
            <stop
              offset="1"
              :stop-color="directionChoose === 'right' ? COLORS.active : COLORS.normal"
              stop-opacity="0"
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="qte-choose__bottom">
      <div class="bottom__button is-left">
        <svg
          viewBox="0 0 202 202"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M201.182.657A225.8 225.8 0 0 1-.001.657 225.8 225.8 0 0 1 0 201.84a225.797 225.797 0 0 1 201.183 0 225.796 225.796 0 0 1 0-201.183ZM72.986 64.19h34.366l29.75 37.482-29.75 37.483H72.986l29.75-37.483-29.75-37.482Z"
            :fill="directionChoose === 'left' ? COLORS.active : COLORS.normal"
          />
        </svg>
      </div>
      <p class="bottom__question">
        Gauche ou droite ?
      </p>
      <div class="bottom__button is-right">
        <svg
          viewBox="0 0 202 202"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M201.182.657A225.8 225.8 0 0 1-.001.657 225.8 225.8 0 0 1 0 201.84a225.797 225.797 0 0 1 201.183 0 225.796 225.796 0 0 1 0-201.183ZM72.986 64.19h34.366l29.75 37.482-29.75 37.483H72.986l29.75-37.483-29.75-37.482Z"
            :fill="directionChoose === 'right' ? COLORS.active : COLORS.normal"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import useStore from '~~/stores';
import RAFManager from '~~/webgl/Utils/RAFManager';
import NoEventKeyboard from '../NoEvent.js';

const SCORE_MAX = 25
const store = useStore()

const directionChoose = ref(null)
const COLORS = {
	normal: '#fff',
	active: '#C4FE1F'
}
const emit = defineEmits(['onKeyup'])

//
// events
//
const noEvent = new NoEventKeyboard({})
const onKeyUp = (ev) => {
	if (['ArrowLeft', 'KeyA'].includes(ev.code)) {
		sendEvent('left')
	} else if (['ArrowRight', 'KeyD'].includes(ev.code)) {
		sendEvent('right')
	}
}

function sendEvent(d) {
	directionChoose.value = d

	noEvent.action()

	emit('onKeyup', d)
}

//
// score
//
function setScore() {
	store.state.altimetre.scores[store.state.gamestate] +=  SCORE_MAX
}

//
//
//
onMounted(() => {
	RAFManager.setSpeed(0.0)

	noEvent.action()
	document.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
	RAFManager.setSpeed(1)
	document.removeEventListener('keyup', onKeyUp)

	setScore()
})
</script>


<style lang="scss">
.qte-choose {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__arrows {
    margin-bottom: 20px;

    svg {

      &:nth-child(1) {
        transform: translate3d(10%, 0, 0);
      }

      &:nth-child(2) {
        transform: translate3d(-10%, 0, 0);
      }

      * {
        transition: all 0.3s ease;
      }
    }
  }

  &__bottom {
    display: flex;
    align-items: center;
    gap: 2.5rem;

    .bottom {
      &__button {
        width: 3rem;

        &.is-left {
          transform: rotate(180deg);
        }

        * {
          transition: all 0.3s ease;
        }
      }

      &__question {
        font-size: 2rem;
        font-weight: 400;
      }
    }
  }
}
</style>
