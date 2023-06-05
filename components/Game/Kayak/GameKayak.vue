<template>
  <div>
    <QteBalance v-if="store.state.gamestatestep === 1" />
    <QteFocus
      v-if="store.state.gamestatestep === 3"
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

onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('kayak', .35, initStates)
})

//
// event change state
//
function initStates (scene) {

  // event QTE Balance
  scene.setEventTimeline(0.13, () => {
    store.state.gamestatestep = 1
  })

  // event QTE Balance END & switch camera 3P
  scene.setEventTimeline(0.48, () => {
    store.state.gamestatestep = 2

    nextTick(() => {
      scene.setCamera3P_1()
    })
  })

  scene.setEventTimeline(0.575, () => {
    scene.WebGL.camera.setCamera()
  })

  // event QTE Focus
  scene.setEventTimeline(0.62, () => {
    webgl.fxComposer.isUpdatable = true
    store.state.gamestatestep = 3
  })

  // set camera position 3P
  scene.setEventTimeline(0.94, () => {
    store.state.gamestatestep = 4
    scene.setCamera3P_finish()
    RAFManager.setSpeed(0.1)
  })

  // event end next scene
  scene.setEventTimeline(0.999, () => {
    // store.state.gamestate = 'ski'
  })
}
</script>
