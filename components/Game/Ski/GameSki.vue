<template>
  <div class="game-ski">
    <Transition
      name="balance"
      :duration="{enter: 1000, leave: 1000}"
      appear
    >
      <QteBalance v-if="store.state.gamestatestep === 1" />
    </Transition>
    <Transition
      name="focus"
      :duration="{enter: 1000, leave: 1000}"
      appear
    >
      <QteFocus
        v-if="store.state.gamestatestep === 3"
        :delay-reduced-speed="0"
      />
    </Transition>
    <Transition
      name="figure"
      :duration="{enter: 1000, leave: 1000}"
      appear
    >
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
    </Transition>
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
import RAFManager from '~~/webgl/Utils/RAFManager';

import lottie  from 'lottie-web'

import backflip from '~~/assets/lottieJson/BACK_FLIP.json'
import balance from '~~/assets/lottieJson/BALANCE_PINK.json'
import focus from '~~/assets/lottieJson/STAY_FOCUS_PINK.json'
import AudioManager from '~~/webgl/Managers/AudioManager';

const store = useStore()

const Audio = new AudioManager()

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

  scene.timelineValue = 0.1

  // Show lottie balance
  scene.setEventTimeline(0.21, () => {
    isBalanceVisible.value = true
  })
  scene.setEventTimeline(0.215, () => {
    balanceAnime.play()
    Audio.play('text_sound1', false, 1, 0)
  })


  // event QTE Balance
  scene.setEventTimeline(0.25, () => {
    store.state.gamestatestep = 1
  })

  // event QTE End Balance
  scene.setEventTimeline(0.475, () => {
    store.state.gamestatestep = 2
  })

  // start travelling 3P
  scene.setEventTimeline(0.555, () => {
    RAFManager.setSpeed(1.25)
    scene.setCameraTravelling()
  })

  // end travelling 3P
  scene.setEventTimeline(0.62, () => {
    RAFManager.setSpeed(1)
    scene.removeCameraTravelling()
  })

  // Show lottie focus
  scene.setEventTimeline(0.625, () => {
    isFocusVisible.value = true
  })
  scene.setEventTimeline(0.63, () => {
    focusAnime.play()
    Audio.play('text_sound1', false, 1, 0)
  })

  // event QTE Focus
  scene.setEventTimeline(0.66, () => {
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
    Audio.play('text_sound2', false, 1, 0)
  })


  // event QTE Figure
  scene.setEventTimeline(0.845, () => {
    store.state.gamestatestep = 5
  })

  scene.setEventTimeline(0.89, () => {
    RAFManager.setSpeed(0.1)
    if (doBackFlip) {
      currentScene.animationSucessQTE()
    } else {
      currentScene.animationFailsQTE()
    }
  })

  // set new Cam
  scene.setEventTimeline(0.93, () => {
    scene.setCamera3P()
    RAFManager.setSpeed(0.45)
    // scene.initFinalCloudSnow()
  })

  scene.setEventTimeline(0.9485, () => {
    RAFManager.setSpeed(0.25)
    // scene.finalCloud.showSplash()
    scene.initFinalCloudSnow()
  })


  // event end next scene
  scene.setEventTimeline(0.988, () => {
    store.state.gamestate = 'kayak'
  })
}

const endQteFigure = (isSucess) => {
  store.state.gamestatestep = 6
  store.state.sucess.ski = isSucess

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
