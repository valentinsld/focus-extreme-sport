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
      @is-finished="() => store.state.gamestatestep = 2"
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
    scene.setEventTimeline(0.2, () => {
    store.state.gamestatestep = 3
  })

  // event QTE Balance END
  scene.setEventTimeline(0.63, () => {
    store.state.gamestatestep = 4
  })

  // event QTE Focus
  scene.setEventTimeline(0.69, () => {
    store.state.gamestatestep = 5
  })
}
</script>
