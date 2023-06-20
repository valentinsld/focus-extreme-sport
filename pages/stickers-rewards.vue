<template>
  <div v-if="!isHide">
    <Transition name="stickers">
      <StickersIntro
        v-if="isIntro"
        class="page page-stickers"
        @close="seeRewards"
      />
      <StickersRewards
        v-else
        class="page page-stickers"
        :rewards="currentRewards"
      />
    </Transition>
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import useStickers from '@/stores/stickers.js'

import WebGL from '~/webgl/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager'
import SceneStickers from '@/webgl/Scenes/SceneStickers.js'

const store = useStore()
const stickers = useStickers()
const isHide = ref(true)

const isIntro = ref(true)
const currentRewards = reactive({
  wingsuit: 3,
  ski: 3,
  kayak: 3,
  like_a_boss: false,
})

onMounted(()=> {
  if (store.state.lastRoute !== 'index' && !process.dev) {
    return navigateTo('/flow-state');
  }

  if (process.dev) {
    const webgl = new WebGL()
    if (webgl.ressourcesReady) {
      setScene()
    } else {
      webgl.on('endLoading', () => {
        requestAnimationFrame(setScene)
      })
    }

    calculateStickers()

    return
  }

  calculateStickers()
  setScene()
})

function calculateStickers() {
  currentRewards.value = stickers.calculateNewStickers(
    store.state.altimetre.scores.wingsuit,
    store.state.altimetre.scores.ski,
    store.state.altimetre.scores.kayak,
  )
}

function setScene () {
  const sceneManager = new SceneManager()

  sceneManager.setScene('stickers', .35, () => {
    isHide.value = false
  })
}

function seeRewards() {
  isIntro.value = false

  const scene = new SceneStickers()
  scene.seeHelmet()
}

//
// Unmounted
//
onUnmounted(() => {
  const scene = new SceneStickers()

  scene.setSceneForEnd()
})
</script>

<style lang="scss" scoped>
.page-stickers {
  color: colors(black);
  z-index: 1;

  --duration-transition: 500ms;
  pointer-events: none;

  :deep(button),
  :deep(a) {
    pointer-events: initial;
  }
}

.stickers-leave-active,
.stickers-enter-active {
  transition: opacity var(--duration-transition) cubic-bezier(0.55, 0, 0.1, 1);
}

.stickers-leave-to,
.stickers-enter-from {
  opacity: 0;
}

.stickers-enter-active {
  transition-delay: calc(var(--duration-transition) * 0.5);
}
</style>
