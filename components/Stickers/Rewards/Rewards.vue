<template>
  <div
    :class="{
      'rewards': true,
      'is-hide': isHide
    }"
  >
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

    <NuxtLink to="/flow-state">
      En apprendre plus sur le sport extreme
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  rewards: {
    type: Object,
    required: true,
  }
})

const currentSticker = ref(0)

function nextSticker() {
  currentSticker.value++
}
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
    border: 1px solid colors(black);
    padding: 8px 24px;
  }
}
</style>
