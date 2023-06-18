<template>
  <Transition
    v-if="!isHide"
    name="stickers"
  >
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
</template>

<script setup>
import useStore from '@/stores/index.js'
import useStickers from '@/stores/stickers.js'
import SceneManager from '~~/webgl/Managers/SceneManager'

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
  if (store.state.lastRoute !== 'index') {
    return navigateTo('/flow-state');
  }

  const sceneManager = new SceneManager()
  sceneManager.setScene('empty', .35, () => {
    isHide.value = false
  })

  calculateStickers()
})

function calculateStickers() {
  currentRewards.value = stickers.calculateNewStickers(
    store.state.altimetre.scores.wingsuit,
    store.state.altimetre.scores.ski,
    store.state.altimetre.scores.kayak,
  )

  console.log(stickers.calculateNewStickers(
    store.state.altimetre.scores.wingsuit,
    store.state.altimetre.scores.ski,
    store.state.altimetre.scores.kayak,
  ))

  console.log(currentRewards.value)
}

function seeRewards() {
  isIntro.value = false
}
</script>

<style lang="scss" scoped>
.page-stickers {
  color: colors(black);
  z-index: 1;

  --duration-transition: 500ms
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
  transition-delay: var(--duration-transition);
}
</style>
