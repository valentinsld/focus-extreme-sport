<template>
  <h1>
    Game Intro {{ store.state.gamestatestep }}
  </h1>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager';

const store = useStore()
const sceneManager = new SceneManager()

onMounted(()=> {
  sceneManager.setScene('intro')
})
</script>
