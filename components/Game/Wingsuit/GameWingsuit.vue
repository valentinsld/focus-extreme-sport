<template>
  <div>
    <h1>
      Game Wingsuit  {{ store.state.gamestatestep }}
    </h1>

    <QteFigure
      v-if="store.state.gamestatestep === 1"
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

onMounted(()=> {
  store.state.gamestatestep = 0

  const sceneManager = new SceneManager()
  sceneManager.setScene('wingsuit', .35, initStates)
})

//
// event change state
//
const initStates = (scene) => {
  // event QTE FIGURE
  scene.setEventTimeline(0.05, () => {
    store.state.gamestatestep = 1
  })

  // event QTE Balance
    scene.setEventTimeline(0.17, () => {
    store.state.gamestatestep = 3
  })

  // event QTE Balance END
  scene.setEventTimeline(0.53, () => {
    store.state.gamestatestep = 4
  })

  // event QTE Focus
  scene.setEventTimeline(0.58, () => {
    store.state.gamestatestep = 5
    RAFManager.setSpeed(0.6)
  })

  // set camera position 3P
  scene.setEventTimeline(0.75, () => {
    store.state.gamestatestep = 6
    scene.setCamera3P()
    RAFManager.setSpeed(0.05)
  })

  // event end next scene
  scene.setEventTimeline(0.83, () => {
    store.state.gamestate = 'kayak'
  })
}

const endQteFigure = (isSucess) => {
  store.state.gamestatestep = 2

  if (isSucess) {
    // TODO : faire un rollover
  } else {
    // TODO : animation pas de rollover
  }
}
</script>
