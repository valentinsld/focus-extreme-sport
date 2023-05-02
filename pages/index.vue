<template>
  <div class="gameContainer">
    <Home v-if="store.state.gamestate === 'home'" />
    <GameIntro v-else-if="store.state.gamestate === 'intro'" />
    <GameWingsuit v-else-if="store.state.gamestate === 'wingsuit'" />
    <GameSki v-else-if="store.state.gamestate === 'ski'" />
    <GameKayak v-else-if="store.state.gamestate === 'kayak'" />
    <!-- <QteFigure
      :data-children="dataChildren"
      @is-finished="qteFigureFinish"
    /> -->
    <!-- <QteBalance /> -->
    <!-- <QteFocus /> -->

    <QteInfoNoEvent :hidden="store.state.noEventPlayer" />
    <Altimetre v-if="store.state.gamestate !== 'home'" />
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import WebGL from '~~/webgl';
const store = useStore()

// const dataChildren = reactive([
// 	{
// 		validKey: 'ArrowRight',
// 		delay: 3000,
// 		duration: 2000
// 	},
// 	{
// 		validKey: 'ArrowUp',
// 		delay: 5000,
// 		duration: 2000
// 	},
// 	{
// 		validKey: 'ArrowLeft',
// 		delay: 7000,
// 		duration: 2000
// 	},
// 	{
// 		validKey: 'ArrowDown',
// 		delay: 8000,
// 		duration: 2000
// 	}
// ])

onMounted(() => {
  initDebugGameState()
})

onUnmounted(() => {
  debugFolder.dispose()
})

// function qteFigureFinish() {
//   console.log('QTE Figure is fineshed ma man');
// }


//
// debug
//
let debugFolder
const initDebugGameState = () => {
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

<style scoped lang="scss">
.gameContainer {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  // z-index: 1;

  padding: 50px;
}
</style>
