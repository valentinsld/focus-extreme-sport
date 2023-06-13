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
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager';

const store = useStore()

let currentScene = null
onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('ski', 0.35, initStates)
})

function initStates(scene) {
  currentScene = scene

  // event QTE Balance
  scene.setEventTimeline(0.07, () => {
    store.state.gamestatestep = 1
  })

  // event QTE End Balance
  scene.setEventTimeline(0.5, () => {
    store.state.gamestatestep = 2
  })

  // start travelling 3P
  scene.setEventTimeline(0.56, () => {
    scene.setCameraTravelling()
  })

  // end travelling 3P
  scene.setEventTimeline(0.65, () => {
    scene.removeCameraTravelling()
  })

  // event QTE Focus
  scene.setEventTimeline(0.7, () => {
    store.state.gamestatestep = 3
  })

  // event END QTE Focus
  scene.setEventTimeline(0.82, () => {
    store.state.gamestatestep = 4
  })

  // event QTE Figure
  scene.setEventTimeline(0.85, () => {
    store.state.gamestatestep = 5
  })

  // set new Cam
  scene.setEventTimeline(0.93, () => {
    scene.setCamera3P()
  })

  scene.setEventTimeline(0.988, () => {
    console.log('TODO : animation de ski avec neige')
  })


  // event end next scene
  scene.setEventTimeline(0.995, () => {
    store.state.gamestate = 'kayak'
  })
}

const endQteFigure = (isSucess) => {
  store.state.gamestatestep = 6

  currentScene.setCameraQteFigure()

  nextTick(() => {
    if (isSucess) {
      currentScene.animationSucessQTE()
    } else {
      currentScene.animationSucessQTE()
    }
  })
}
</script>
