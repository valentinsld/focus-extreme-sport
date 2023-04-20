<template>
  <div style="padding: 50px;">
    <Home v-if="store.state.gamestate === 'home'" />
    <GameIntro v-else-if="store.state.gamestate === 'intro'" />
    <GameWingsuit v-else-if="store.state.gamestate === 'wingsuit'" />
    <GameSki v-else-if="store.state.gamestate === 'ski'" />
    <GameKayak v-else-if="store.state.gamestate === 'kayak'" />
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import WebGL from '~~/webgl';
const store = useStore()

onMounted(() => {
  inutDebugGameState()
})

onUnmounted(() => {
  debugFolder.dispose()
})

//
// debug
//
let debugFolder
const inutDebugGameState = () => {
  const webgl = new WebGL()
  if (!webgl.debug) return

  debugFolder = webgl.debug.addFolder({ title: 'GameState' })
  debugFolder.addInput(store.state, 'gamestate', {
    options: {
      home: 'home',
      intro: 'intro',
      wingsuit: 'wingsuit',
      ski: 'ski',
      kayak: 'kayak',
    },
  }).on('change', () => {
    store.state.gamestatestep = 0
    inputStep.refresh()
  })
  const inputStep = debugFolder.addInput(store.state, 'gamestatestep', {
    min: 0,
    max: 3,
    step: 1,
  })
}
</script>
