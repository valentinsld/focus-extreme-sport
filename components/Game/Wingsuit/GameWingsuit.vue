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
      ref="backflipLottie"
      class="lottie"
      :class="{'is-visible': isBackflipVisible}"
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

import backflip from '~~/assets/lottieJson/backflip.json'


const store = useStore()
let currentScene = null

const webgl = new WebGL()

const Audio = new AudioManager()

const backflipLottie = ref()
const isBackflipVisible = ref(false)

let backflipAnime;

onMounted(()=> {

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

  store.state.gamestatestep = 0

  const sceneManager = new SceneManager()
  sceneManager.setScene('wingsuit', 10000, initStates)

  // start sound
  Audio.play('cinematique', false, 1, 4000)
  setTimeout(() => {
    Audio.play('wingsuit-montagne', true, 1, 6000)
  }, 6600)
})

//
// event change state
//
const initStates = (scene) => {
  currentScene = scene

  //Show lottie rollover
  scene.setEventTimeline(0.01, () => {
    RAFManager.setSpeed(0.02)
    store.state.isOverlayVisible = true
    store.state.isTutoVisible = true
  })
  scene.setEventTimeline(0.02, () => {
    RAFManager.setSpeed(1)
    store.state.isOverlayVisible = false
    store.state.isTutoVisible = false
  })

  //Show lottie rollover
  scene.setEventTimeline(0.032, () => {
    isBackflipVisible.value = true
  })
  scene.setEventTimeline(0.035, () => {
    backflipAnime.play()
  })

  //event QTE FIGURE
  scene.setEventTimeline(0.08, () => {
    store.state.gamestatestep = 1
  })

  //event QTE Balance
  scene.setEventTimeline(0.17, () => {
    webgl.fxComposer.isUpdatable = true
    store.state.gamestatestep = 3
  })

  // event QTE Balance END
  scene.setEventTimeline(0.48, () => {
    store.state.gamestatestep = 4
  })

  scene.setEventTimeline(0.526, () => {
    scene.setCamera3P_2()
  })

  // event QTE Focus
  scene.setEventTimeline(0.62, () => {
    webgl.fxComposer.isUpdatable = true
    store.state.gamestatestep = 5
    RAFManager.setSpeed(0.6)
  })

  // set camera position 3P
  scene.setEventTimeline(0.865, () => {
    store.state.gamestatestep = 6
    scene.setCamera3P()
    RAFManager.setSpeed(0.04)
  })

  // event end next scene
  scene.setEventTimeline(0.9, () => {
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
