<template>
  <h1>
    Home  {{ store.state.gamestatestep }}
  </h1>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager';

const store = useStore()
const sceneManager = new SceneManager()

onMounted(()=> {
  sceneManager.setScene('home')
})
</script>
