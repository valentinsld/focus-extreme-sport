<template>
  <div
    class="gameContainer"
    :class="[
      { 'is-clickable': store.state.gamestate === 'home' || store.state.gamestate === 'selection'},
    ]"
  >
    <Home />
    <Selection />

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

    <!-- <QteInfoNoEvent :hidden="store.state.noEventPlayer" /> -->
    <Altimetre v-if="isIntroFinished" />
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import WebGL from '~~/webgl';
const store = useStore()

const isIntroFinished = computed(() => ['wingsuit', 'ski', 'kayak'].includes(store.state.gamestate))

onMounted(() => {
  eventWebGLStarted()
  initDebugGameState()
})

onUnmounted(() => {
  debugFolder?.dispose()
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

<style lang="scss">
.gameContainer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 1;


  pointer-events: none;

  &.is-clickable {
    pointer-events: all;

  }

  button,
  a {
    pointer-events: initial !important;
  }
}

.page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;

  transition: opacity 0.4s ease-out;

  &.is-hide {
    opacity: 0;
  }
}

// .selection-enter-active {
//   transition: transform .5s ease(out-swift), opacity .4s ease(out-swift);

// }

// .selection-leave-active {}

// .selection-enter-from {

//   transform: translateY(4rem) scale(1.2);
//   opacity: 0;


// }

// .selection-leave-to {}

.intro-enter-active,
.intro-leave-active {
  @for $i from 1 through 20 {
    :deep(.word-#{$i}) {
      opacity: 1;
      transition: opacity 2s ease(out-swift);
      transition-delay: calc(50ms + (#{$i} * 75ms));
    }
  }
}

.intro-enter-from,
.intro-leave-to {
  @for $i from 1 through 20 {
    :deep(.word-#{$i}) {
      opacity: 0;
    }
  }
}

.figure-enter-active,
.figure-leave-active {
  transition: opacity 1s cubic-bezier(0.55, 0, 0.1, 1);
}

.figure-enter-from,
.figure-leave-to {
  opacity: 0;
}
</style>
