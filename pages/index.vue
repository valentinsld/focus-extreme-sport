<template>
  <div
    class="gameContainer"
    :class="{'is-game': store.isIntroFinished}"
  >
    <Transition
      name="home"
      appear
    >
      <Home v-if="store.state.gamestate === 'home'" />
    </Transition>
    <Transition
      name="selection"
      appear
    >
      <Selection v-if="store.state.gamestate === 'selection'" />
    </Transition>
    <Transition
      name="intro"
      appear
    >
      <GameIntro v-if="store.state.gamestate === 'intro'" />
    </Transition>
    <Transition
      name="wingsuit"
      appear
    >
      <GameWingsuit v-if="store.state.gamestate === 'wingsuit'" />
    </Transition>
    <Transition
      name="ski"
      appear
    >
      <GameSki v-if="store.state.gamestate === 'ski'" />
    </Transition>
    <Transition
      name="kayak"
      appear
    >
      <GameKayak v-if="store.state.gamestate === 'kayak'" />
    </Transition>
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
  eventWebGLStarted()
  initDebugGameState()
})

onUnmounted(() => {
  debugFolder.dispose()
})

//
// event on webGL started
//
const eventWebGLStarted = () => {
  const webgl = new WebGL()
  webgl.on('endLoading', () => {
    store.state.ressourcesLoaded = true
  })
}

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
      selection: 'selection',
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

  z-index: 1;

  padding: 50px;
  // background-color: rgba(colors(black), 1);

  // transition: background-color 4s ease(out-swift);

  &.is-game {
    background-color: rgba(colors(black), 0);
  }
}

.page {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
}

.home-enter-active,
.home-leave-active {
  transition: opacity 375ms cubic-bezier(0.55, 0, 0.1, 1);
}

.home-enter-from,
.home-leave-to {
  opacity: 0;
}

.selection-enter-active,
.selection-leave-active {
  transition: opacity 1s cubic-bezier(0.55, 0, 0.1, 1);
}

.selection-enter-from,
.selection-leave-to {
  opacity: 0;
}
</style>
