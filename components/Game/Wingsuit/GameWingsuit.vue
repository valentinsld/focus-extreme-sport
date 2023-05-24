<template>
  <div>
    <h1>
      Game Wingsuit  {{ store.state.gamestatestep }}
    </h1>

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
              duration: 2000
            },
            {
              validKey: 'ArrowUp',
              delay: 2500,
              duration: 2000
            },
            {
              validKey: 'ArrowLeft',
              delay: 4500,
              duration: 2000
            },
            {
              validKey: 'ArrowDown',
              delay: 6500,
              duration: 2000
            }
          ]"
          @is-finished="endQteFigure"
        />
      </div>
    </Transition>
    <QteBalance v-if="store.state.gamestatestep === 3" />
    <QteFocus
      v-if="store.state.gamestatestep === 5"
      :delay-reduced-speed="0"
    />
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager';
import RAFManager from '~~/webgl/Utils/RAFManager';

const store = useStore()
let currentScene = null

onMounted(()=> {
  store.state.gamestatestep = 0

  const sceneManager = new SceneManager()
  sceneManager.setScene('wingsuit', .35, initStates)
})

//
// event change state
//
const initStates = (scene) => {
  currentScene = scene

  // event QTE FIGURE
  scene.setEventTimeline(0.05, () => {
    store.state.gamestatestep = 1
  })

  // event QTE Balance
    scene.setEventTimeline(0.15, () => {
    store.state.gamestatestep = 3
  })

  // event QTE Balance END
  scene.setEventTimeline(0.495, () => {
    store.state.gamestatestep = 4
  })

  // switch camera 3P _ 1
  scene.setEventTimeline(0.52, () => {
    scene.setCamera3P_2()
  })
  scene.setEventTimeline(0.575, () => {
    scene.WebGL.camera.setCamera()
  })

  // event QTE Focus
  scene.setEventTimeline(0.62, () => {
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
  scene.setEventTimeline(0.91, () => {
    store.state.gamestate = 'kayak'
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
.figure-enter-active,
.figure-leave-active {
  transition: opacity 1s cubic-bezier(0.55, 0, 0.1, 1);
}

.figure-enter-from,
.figure-leave-to {
  opacity: 0;
}
</style>
