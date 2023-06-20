<template>
  <div
    :class="{
      'rewards': true
    }"
  >
    <StickersRewardsSlider v-if="currentSticker >= 3" />

    <div
      :class="{
        'rewards__list': true,
        'is-hide': currentSticker >= 3
      }"
    >
      <StickersRewardsItem
        :score="rewards.wingsuit"
        sport="wingsuit"
        :text="'Mais quel boss ! Le wingsuit n’a plus de secret pour toi.'"
        :is-visible="currentSticker === 0"
        @next="nextSticker"
      />
      <StickersRewardsItem
        :score="rewards.ski"
        sport="ski"
        :text="'Mais quel boss ! Le ski n’a plus de secret pour toi.'"
        :is-visible="currentSticker === 1"
        @next="nextSticker"
      />
      <StickersRewardsItem
        :score="rewards.kayak"
        sport="kayak"
        :text="'Mais quel boss ! Le kayak n’a plus de secret pour toi.'"
        :is-visible="currentSticker === 2"
        @next="nextSticker"
      />
    </div>

    <NuxtLink
      :class="{
        'btn-underline': true,
        'is-visible': currentSticker >= 3
      }"
      to="/flow-state"
    >
      <span>
        En savoir +
      </span>
    </NuxtLink>
  </div>
</template>

<script setup>
import WebGL from '@/webgl/index.js'
import useStickers from '@/stores/stickers.js'

defineProps({
  rewards: {
    type: Object,
    required: true,
  }
})

const stickers = useStickers()
const currentSticker = ref(-1)

onMounted(() => {
  setTimeout(() => {
    currentSticker.value = 0
  }, 1000)
})

function nextSticker() {
  currentSticker.value++
}

// on end see stickers
watch(currentSticker, (value) => {
  if (value === 3) {
    const scene = (new WebGL()).sceneStickers.scene

    scene.seeStickers(toRaw(stickers.state))
  }
})
</script>

<style lang="scss" scoped>
.rewards {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  height: 100vh;

  color: colors(black);

  transition: opacity 1s ease-in-out;

  &.is-hide {
    opacity: 0;
  }

  &__list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: radial-gradient(72.4% 72.4% at 50% 50%, #000000 0%, rgba(0, 0, 0, 0) 100%);

    transition: opacity 1s ease-in-out;

    &.is-hide {
      opacity: 0;
    }
  }

  a {
    position: absolute;
    bottom: 40px;
    right: 70px;

    &.is-visible {
      opacity: 1 !important
    }
  }
}
</style>
