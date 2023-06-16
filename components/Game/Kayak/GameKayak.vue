<template>
  <div class="game-kayak">
    <QteBalance v-if="store.state.gamestatestep === 1" />
    <QteChoose
      v-if="store.state.gamestatestep === 3"
      @on-keyup="chooseLine"
    />
    <QteFocus
      v-if="store.state.gamestatestep === 5"
      :delay-reduced-speed="0"
    />

    <div
      ref="choiceLottie"
      class="lottie"
      :class="{'is-visible': isChoiceVisible}"
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
import WebGL from '~~/webgl'
import SceneManager from '~~/webgl/Managers/SceneManager'
import RAFManager from '~~/webgl/Utils/RAFManager'

import lottie  from 'lottie-web'

import lineChoice from '~~/assets/lottieJson/LINE_CHOICE.json'
import balance from '~~/assets/lottieJson/BALANCE_PURPLE.json'
import focus from '~~/assets/lottieJson/STAY_FOCUS_PURPLE.json'

const store = useStore()
const webgl = new WebGL()

const choiceLottie = ref()
const isChoiceVisible = ref(false)

const balanceLottie = ref()
const isBalanceVisible = ref(false)

const focusLottie = ref()
const isFocusVisible = ref(false)

let choiceAnime, balanceAnime, focusAnime;

let currentScene = null
onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('kayak', .35, initStates)

  initLottie();
})

function initLottie() {
  choiceAnime = lottie.loadAnimation({
    container: choiceLottie.value, // the dom element that will contain the animation
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: lineChoice,
  });

  choiceAnime.onComplete = function(){
    isChoiceVisible.value = false
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
function initStates (scene) {
  currentScene = scene


   // Show lottie balance
   scene.setEventTimeline(0.095, () => {
    isBalanceVisible.value = true
  })
  scene.setEventTimeline(0.1, () => {
    balanceAnime.play()
  })

  // event QTE Balance
  scene.setEventTimeline(0.15, () => {
    store.state.gamestatestep = 1
  })

  scene.setEventTimeline(0.28, () => {
    store.state.gamestatestep = 2
  })

   // Show lottie balance
   scene.setEventTimeline(0.315, () => {
    isChoiceVisible.value = true
  })
  scene.setEventTimeline(0.322, () => {
    choiceAnime.play()
  })

  // QTE choose
  scene.setEventTimeline(0.372, () => {
    store.state.gamestatestep = 3
  })

  // event QTE Focus END & switch camera 3P
  scene.setEventTimeline(0.425, () => {
    nextTick(() => {
      scene.setCamera3P_1()
    })
  })

  scene.setEventTimeline(0.52, () => {
    scene.WebGL.camera.setCamera()
  })

  // Show lottie balance
  scene.setEventTimeline(0.625, () => {
    isFocusVisible.value = true
  })
  scene.setEventTimeline(0.63, () => {
    focusAnime.play()
  })

  // event QTE Focus
  scene.setEventTimeline(0.68, () => {
    webgl.fxComposer.isUpdatable = true
    store.state.gamestatestep = 5
    RAFManager.setSpeed(1.1)
  })

  scene.setEventTimeline(0.90, () => {
    RAFManager.setSpeed(0.2)
    store.state.gamestatestep = 6
  })
  // set camera position 3P
  scene.setEventTimeline(0.93, () => {
    scene.splashBack.hideSplash()
    scene.splashRight.hideSplash()
    scene.splashLeft.hideSplash()
    scene.setCamera3P_finish()

    scene.currentAnim.stop()
  })

  // set camera position 3P
  scene.setEventTimeline(0.925, () => {
    scene.setAnimationEnd(0, 1.3)
  })

  // event end next scene
  scene.setEventTimeline(0.99, () => {
    store.state.gamestate = 'ski'
    navigateTo('/stickers-rewards')
  })
}

function chooseLine (d) {
  if (d === 'right') {
    currentScene.switchCurve()
  }

  setTimeout(() => {
    store.state.gamestatestep = 4
  }, 1000);
}
</script>

<style lang="scss" scoped>
.game-kayak {
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
