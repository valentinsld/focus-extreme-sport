<template>
  <h1>
    Home  {{ store.state.gamestatestep }}
  </h1>
</template>

<script setup>
import useStore from '@/stores/index.js'
const store = useStore()
</script>
