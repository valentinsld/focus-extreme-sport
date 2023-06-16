<template>
  <div>
    <QteBalance v-if="store.state.gamestatestep === 1" />
    <QteChoose
      v-if="store.state.gamestatestep === 3"
      @on-keyup="chooseLine"
    />
    <QteFocus
      v-if="store.state.gamestatestep === 5"
      :delay-reduced-speed="0"
    />
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import WebGL from '~~/webgl'
import SceneManager from '~~/webgl/Managers/SceneManager'
import RAFManager from '~~/webgl/Utils/RAFManager'

const store = useStore()
const webgl = new WebGL()

let currentScene = null
onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('kayak', .35, initStates)
})

//
// event change state
//
function initStates (scene) {
  currentScene = scene

  // event QTE Balance
  scene.setEventTimeline(0.05, () => {
    store.state.gamestatestep = 1
  })

  scene.setEventTimeline(0.20, () => {
    store.state.gamestatestep = 2
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
  scene.setEventTimeline(0.925, () => {
    scene.splashBack.hideSplash()
    scene.splashRight.hideSplash()
    scene.splashLeft.hideSplash()
    scene.setCamera3P_finish()

    scene.currentAnim.stop()
  })

  // set camera position 3P
  scene.setEventTimeline(0.92, () => {
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
