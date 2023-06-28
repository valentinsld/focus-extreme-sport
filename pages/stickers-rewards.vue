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
        :display="displayRewards"
        @see-stickers="seeStickers"
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
const displayRewards = ref(true)
const currentRewards = ref({
  wingsuit: 3,
  ski: 3,
  kayak: 3,
  like_a_boss: false,
})

onMounted(()=> {
  const scoreZero = store.state.altimetre.scores.wingsuit <= 0 && store.state.altimetre.scores.ski <= 0 && store.state.altimetre.scores.kayak <= 0

  if (scoreZero && stickers.isEmpty) {
    return navigateTo('/flow-state');
  }
  if (scoreZero) {
    isIntro.value = false
    displayRewards.value = false
  }

  const webgl = new WebGL()
  if (webgl.ressourcesReady) {
    requestAnimationFrame(setScene)
  } else {
    webgl.on('endLoading', () => {
      requestAnimationFrame(setScene)
    })
  }

  calculateStickers()
})

function calculateStickers() {
  currentRewards.value = stickers.calculateNewStickers(
    store.state.altimetre.scores.wingsuit,
    store.state.altimetre.scores.ski,
    store.state.altimetre.scores.kayak,
  )
}

function setScene () {
  if (store.state.lastRoute === 'flow-state') {
    isHide.value = false
    displayRewards.value = false
    seeStickers(true)
  }
  const sceneManager = new SceneManager()

  sceneManager.setScene('stickers', .35, () => {
    isHide.value = false

    if (store.state.lastRoute === 'stickers-rewards') {
      displayRewards.value = false
      seeStickers(true)
    }
  })
}

function seeRewards() {
  isIntro.value = false

  const scene = new SceneStickers()
  scene.seeHelmet()
}
function seeStickers(isDelay = false) {
  isIntro.value = false

  const scene = new SceneStickers()
  if (isDelay) {
    scene.seeStickers(toRaw(stickers.state), 4000, 1000, true)
  } else {
    scene.seeStickers(toRaw(stickers.state))
  }
}

//
// Unmounted
//
onUnmounted(() => {
  const webgl = new WebGL()
  if (!webgl.ressourcesReady) return

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
