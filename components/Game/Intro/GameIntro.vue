<template>
  <h1>
    Game Intro {{ store.state.gamestatestep }}
  </h1>
</template>

<script setup>
import useStore from '@/stores/index.js'
const store = useStore()
</script>
