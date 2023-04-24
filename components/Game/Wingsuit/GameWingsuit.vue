<template>
  <h1>
    Game Wingsuit  {{ store.state.gamestatestep }}
  </h1>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager';

const store = useStore()

onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('wingsuit')
})
</script>
