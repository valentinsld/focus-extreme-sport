<template>
  <div class="game-ski">
    <QteBalance v-if="store.state.gamestatestep === 1" />
    <QteFocus
      v-if="store.state.gamestatestep === 3"
      :delay-reduced-speed="0"
    />
    <QteFigure
      v-if="store.state.gamestatestep === 5"
      :data-children="[
        {
          validKey: 'ArrowUp',
          delay: 500,
          duration: 1500
        },
        {
          validKey: 'ArrowLeft',
          delay: 1500,
          duration: 1500
        },
        {
          validKey: 'ArrowRight',
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

    <div
      ref="backflipLottie"
      class="lottie"
      :class="{'is-visible': isBackflipVisible}"
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
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager';

import lottie  from 'lottie-web'

import backflip from '~~/assets/lottieJson/BACK_FLIP.json'
import balance from '~~/assets/lottieJson/BALANCE_PINK.json'
import focus from '~~/assets/lottieJson/STAY_FOCUS_PINK.json'

const store = useStore()

const backflipLottie = ref()
const isBackflipVisible = ref(false)

const balanceLottie = ref()
const isBalanceVisible = ref(false)

const focusLottie = ref()
const isFocusVisible = ref(false)

let currentScene = null
let doBackFlip = null

let backflipAnime, balanceAnime, focusAnime;

onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('ski', 0.35, initStates)

  initLottie();
})

function initLottie() {
  backflipAnime = lottie.loadAnimation({
    container: backflipLottie.value, // the dom element that will contain the animation
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: backflip,
  });

  backflipAnime.onComplete = function(){
    isBackflipVisible.value = false
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


function initStates(scene) {
  currentScene = scene

  // Show lottie balance
  scene.setEventTimeline(0.095, () => {
    isBalanceVisible.value = true
  })
  scene.setEventTimeline(0.1, () => {
    balanceAnime.play()
  })


  // event QTE Balance
  scene.setEventTimeline(0.175, () => {
    store.state.gamestatestep = 1
  })

  // event QTE End Balance
  scene.setEventTimeline(0.4, () => {
    store.state.gamestatestep = 2
  })

  scene.timelineValue = 0.45

  // start travelling 3P
  scene.setEventTimeline(0.555, () => {
    scene.setCameraTravelling()
  })

  // end travelling 3P
  scene.setEventTimeline(0.6, () => {
    scene.removeCameraTravelling()
  })

  // Show lottie focus
  scene.setEventTimeline(0.615, () => {
    isFocusVisible.value = true
  })
  scene.setEventTimeline(0.62, () => {
    focusAnime.play()
  })

  // event QTE Focus
  scene.setEventTimeline(0.65, () => {
    store.state.gamestatestep = 3
  })

  // event END QTE Focus
  scene.setEventTimeline(0.78, () => {
    store.state.gamestatestep = 4
  })

  // Show lottie focus
  scene.setEventTimeline(0.795, () => {
    isBackflipVisible.value = true
  })
  scene.setEventTimeline(0.8, () => {
    backflipAnime.play()
  })


  // event QTE Figure
  scene.setEventTimeline(0.845, () => {
    store.state.gamestatestep = 5
  })

  scene.setEventTimeline(0.89, () => {
    if (doBackFlip) {
      currentScene.animationSucessQTE()
    } else {
      currentScene.animationFailsQTE()
    }
  })

  // set new Cam
  scene.setEventTimeline(0.93, () => {
    scene.setCamera3P()
    // scene.initFinalCloudSnow()
  })

  scene.setEventTimeline(0.95, () => {
    // scene.finalCloud.showSplash()
    scene.initFinalCloudSnow()
  })


  // event end next scene
  scene.setEventTimeline(0.995, () => {
    store.state.gamestate = 'kayak'
  })
}

const endQteFigure = (isSucess) => {
  store.state.gamestatestep = 6

  currentScene.setCameraQteFigure()

  doBackFlip = isSucess
}
</script>

<style lang="scss" scoped>
.game-ski {
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
