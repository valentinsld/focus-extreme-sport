<template>
  <div
    :class="{
      'page-sticker': true,
      'is-hide': isHide
    }"
  >
    <h1>Découvre les stickers que tu as gagnés !!</h1>

    <div class="page-sticker__list">
      <div class="list__item">
        <img :src="store.state.altimetre.scores.wingsuit > 50 ? '/stickers/1-wingsuit.png' : '/stickers/3-wingsuit.png'">
      </div>
      <div class="list__item">
        <img :src="store.state.altimetre.scores.wingsuit > 50 ? '/stickers/1-kayak.png' : '/stickers/3-kayak.png'">
      </div>
    </div>

    <NuxtLink to="/flow-state">
      En apprendre plus sur le sport extreme
    </NuxtLink>
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager'

const store = useStore()
const isHide = ref(true)

onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('empty', .35, () => {
    isHide.value = false
  })
})
</script>

<style lang="scss">
.page-sticker {
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
    display: flex;
    justify-content: space-between;

    width: 70%;
    min-height: 50%;

    .list {
      &__item {
        width: 30%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        background: rgba(217, 217, 217, 0.49);
        border: 2px solid #FFFFFF;
        border-radius: 30px;

        img {
          position: relative;
          width: 130%;
          max-height: 40%;
          object-fit: contain;
        }
      }
    }
  }

  a {
    border: 1px solid colors(black);
    padding: 8px 24px;
  }
}
</style>
