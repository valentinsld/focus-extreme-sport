<template>
  <div class="game-kayak">
    <Transition
      name="balance"
      :duration="{enter: 1000, leave: 1000}"
      appear
    >
      <QteBalance v-if="store.state.gamestatestep === 1" />
    </Transition>
    <Transition
      name="choose"
      :duration="{enter: 1000, leave: 1000}"
      appear
    >
      <QteChoose
        v-if="store.state.gamestatestep === 3"
        @on-keyup="chooseLine"
      />
    </Transition>
    <Transition
      name="focus"
      :duration="{enter: 1000, leave: 1000}"
      appear
    >
      <QteFocus
        v-if="store.state.gamestatestep === 5"
        :delay-reduced-speed="0"
      />
    </Transition>

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
import AudioManager from '~~/webgl/Managers/AudioManager'

const store = useStore()
const webgl = new WebGL()

const Audio = new AudioManager()

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
  scene.setEventTimeline(0.12, () => {
    balanceAnime.play()
    Audio.play('text_sound2', false, 1, 0)
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
    Audio.play('text_sound1', false, 1, 0)
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
  scene.setEventTimeline(0.65, () => {
    focusAnime.play()
    Audio.play('text_sound2', false, 1, 0)
  })

  // event QTE Focus
  scene.setEventTimeline(0.68, () => {
    webgl.fxComposer.isUpdatable = true
    store.state.gamestatestep = 5
    RAFManager.setSpeed(1.25)
  })

  // set camera position 3P
  scene.setEventTimeline(0.90, () => {

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
  scene.setEventTimeline(0.92, () => {
    RAFManager.setSpeed(0.15)
    scene.setAnimationEnd(0, 1.3)
    store.state.isTransitioning = true
  })

  // event end next scene
  scene.setEventTimeline(0.99, () => {
    store.state.gamestate = 'stickers'
    navigateTo('/stickers-rewards')
  })
}

function chooseLine (d) {
  if (d === 'right') {
    store.state.sucess.kayak = true
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

.choose-enter-active {

  :deep(.qte-choose__arrows),
  :deep(.qte-choose__bottom) {
    transform: none;
    opacity: 1;
    transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);
  }

  :deep(.qte-choose__bottom) {
    transition-delay: .1s;
  }
}

.choose-leave-active {
  opacity: 1;
  transition: opacity .3s ease(out-swift);
}

.choose-enter-from {

  :deep(.qte-choose__arrows),
  :deep(.qte-choose__bottom) {
    transform: translateY(4rem);
    opacity: 0;
  }
}

.choose-leave-to {
  opacity: 0;
}

.balance-enter-active,
.balance-leave-active {
  :deep(.text) {
    transform: none;
    opacity: 1;
    transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);
  }


  :deep(.left) {
    transform: translateY(0) rotate(180deg);
    opacity: 1;
    transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);
  }

  :deep(.right),
  :deep(.gauge) {
    transform: translateY(0);
    opacity: 1;
    transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);
  }

  :deep(.gauge) {
    transition-delay: 35ms;
  }

  :deep(.right) {
    transition-delay: 70ms;
  }
}

.balance-enter-from,
.balance-leave-to {
  :deep(.text) {
    transform: translateY(4rem);
    opacity: 0;
  }


  :deep(.left) {
    transform: translateY(4rem) rotate(180deg);
    opacity: 0;
  }

  :deep(.right) {
    opacity: 0;
    transform: translateY(4rem);
  }

  :deep(.gauge) {
    opacity: 0;
    transform: translateY(4rem);
  }
}

.focus-enter-active {

  :deep(.qte-focus__title),
  :deep(.space-container) {
    transform: none;
    opacity: 1;
    transition: transform .3s ease(out-bounce), opacity .3s ease(out-swift);
  }

  :deep(.space-container) {
    transition-delay: 75ms;
  }

  :deep(.qte-focus__indicator) {
    transform: none;
    opacity: 1;
    transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);
  }

}

.focus-leave-active {
  opacity: 1;
  transition: opacity .3s ease(out-swift);
}

.focus-enter-from {

  :deep(.qte-focus__title),
  :deep(.space-container) {
    transform: scale(0);
    opacity: 0;
  }

  :deep(.qte-focus__indicator) {
    transform: translateY(4rem);
    opacity: 0;
  }

}

.focus-leave-to {
  opacity: 0;
}
</style>
