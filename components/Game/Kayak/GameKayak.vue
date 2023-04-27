<template>
  <h1>
    Game Kayak {{ store.state.gamestatestep }}
  </h1>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager'
import SceneKayak from '~~/webgl/Scenes/SceneKayak'

const store = useStore()

let currentScene = null
onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('kayak')
  currentScene = new SceneKayak()

  currentScene.setEventsTimeline({
    start: {
      value: 0.1,
      callback: () => {
        console.log('start 0.1')
      }
    },
    end: {
      value: 0.15,
      callback: () => {
        console.log('end 0.15')
      }
    }
  })
})
</script>
