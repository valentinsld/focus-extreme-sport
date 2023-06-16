<template>
  <div class="game-wingsuit">
    <Transition
      name="figure"
      appear
    >
      <div
        v-if="store.state.gamestatestep === 1"
        class="container"
      >
        <QteFigure
          :data-children="[
            {
              validKey: 'ArrowRight',
              delay: 500,
              duration: 1500
            },
            {
              validKey: 'ArrowUp',
              delay: 1500,
              duration: 1500
            },
            {
              validKey: 'ArrowLeft',
              delay: 2500,
              duration: 1500
            },
            {
              validKey: 'ArrowDown',
              delay: 3500,
              duration: 1500
            }
          ]"
          @is-finished="endQteFigure"
        />
      </div>
    </Transition>

    <div
      ref="rolloverLottie"
      class="lottie"
      :class="{'is-visible': isRolloverVisible}"
    />
    <div
      ref="balanceLottie"
      class="lottie"
      :class="{'is-visible': isBalanceVisible}"
    />
    <div
      ref="focusLottie"
      class="lottie"
      :class="{'is-visible': isFocusVisible}"
    />
    <QteBalance v-if="store.state.gamestatestep === 3" />
    <QteFocus
      v-if="store.state.gamestatestep === 5"
      :delay-reduced-speed="0"
    />
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import WebGL from '~~/webgl';
import AudioManager from '~~/webgl/Managers/AudioManager';
import SceneManager from '~~/webgl/Managers/SceneManager';
import RAFManager from '~~/webgl/Utils/RAFManager';

import lottie  from 'lottie-web'

import rollover from '~~/assets/lottieJson/ROLLOVER.json'
import balance from '~~/assets/lottieJson/BALANCE_GREEN.json'
import focus from '~~/assets/lottieJson/STAY_FOCUS_GREEN.json'


const store = useStore()
let currentScene = null

const webgl = new WebGL()

const Audio = new AudioManager()

const rolloverLottie = ref()
const isRolloverVisible = ref(false)

const balanceLottie = ref()
const isBalanceVisible = ref(false)

const focusLottie = ref()
const isFocusVisible = ref(false)

let rolloverAnime, balanceAnime, focusAnime;

onMounted(()=> {

  initLottie();

  store.state.gamestatestep = 0

  const sceneManager = new SceneManager()
  // Duration transition au noir intro
  sceneManager.setScene('wingsuit', 12000, initStates)

  // start sound FADE delay
  Audio.play('cinematique', false, 1, 4000)
  setTimeout(() => {
    Audio.play('wingsuit-montagne', true, 1, 6000)
  }, 6600)
})

function initLottie() {
  rolloverAnime = lottie.loadAnimation({
    container: rolloverLottie.value, // the dom element that will contain the animation
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: rollover,
  });

  rolloverAnime.onComplete = function(){
    isRolloverVisible.value = false
  }

  balanceAnime = lottie.loadAnimation({
    container: balanceLottie.value, // the dom element that will contain the animation
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: balance,
  });

  balanceAnime.onComplete = function(){
    isBalanceVisible.value = false
  }

  focusAnime = lottie.loadAnimation({
    container: focusLottie.value, // the dom element that will contain the animation
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: focus,
  });

  focusAnime.onComplete = function(){
    isFocusVisible.value = false
  }
}

//
// event change state
//
const initStates = (scene) => {
  currentScene = scene

  RAFManager.speed = 0.18

  // Show lottie rollover
  scene.setEventTimeline(0.01, () => {
    RAFManager.setSpeed(0.18)
    store.state.isOverlayVisible = true
    store.state.isTutoVisible = true
  })
  scene.setEventTimeline(0.03, () => {
    RAFManager.setSpeed(1)
    store.state.isOverlayVisible = false
    store.state.isTutoVisible = false
  })

  // Show lottie rollover
  scene.setEventTimeline(0.045, () => {
    isRolloverVisible.value = true
  })
  scene.setEventTimeline(0.05, () => {
    rolloverAnime.play()
  })

  // event QTE FIGURE
  scene.setEventTimeline(0.1, () => {
    store.state.gamestatestep = 1
  })


  // Show lottie balance
  scene.setEventTimeline(0.195, () => {
    isBalanceVisible.value = true
  })
  scene.setEventTimeline(0.2, () => {
    balanceAnime.play()
  })

  // event QTE Balance
  scene.setEventTimeline(0.28, () => {
    webgl.fxComposer.isUpdatable = true
    store.state.gamestatestep = 3
  })

  // event QTE Balance END
  scene.setEventTimeline(0.48, () => {
    store.state.gamestatestep = 4
  })

  scene.setEventTimeline(0.51, () => {
    scene.setCamera3P_2()
  })

   // Show lottie focus
   scene.setEventTimeline(0.595, () => {
    isFocusVisible.value = true
  })
  scene.setEventTimeline(0.6, () => {
    focusAnime.play()
  })
  // event QTE Focus
  scene.setEventTimeline(0.68, () => {
    webgl.fxComposer.isUpdatable = true
    store.state.gamestatestep = 5
    RAFManager.setSpeed(0.6)
  })

  scene.setEventTimeline(0.84, () => {
    store.state.gamestatestep = 6
  })
  // set camera position 3P
  scene.setEventTimeline(0.86, () => {
    RAFManager.setSpeed(0.08)

    scene.setCamera3P()
  })

  // event end next scene
  scene.setEventTimeline(0.91, () => {
    store.state.gamestate = 'ski'
  })
}

const endQteFigure = (isSucess) => {
  store.state.gamestatestep = 2

  if (isSucess) {
    currentScene.animationSucessQTE()
  } else {
    currentScene.animationFailsQTE()
  }
}
</script>

<style lang="scss" scoped>
.game-wingsuit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}

.lottie {
  position: absolute;
  width: 120rem;
  transition: opacity .3s ease(out-swift);
  opacity: 0;

  &.is-visible {
    opacity: 1;
  }
}
</style>
