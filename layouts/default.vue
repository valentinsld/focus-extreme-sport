<template>
  <div>
    <Transition
      name="loader"
      appear
    >
      <Loader v-if="!store.state.ressourcesLoaded && !IS_DEV" />
    </Transition>
    <div id="absolute-fade" />
    <!-- <slot /> -->

    <NuxtPage />

    <div
      class="overlay"
      :class="{'is-visible': store.state.isOverlayVisible}"
    />

    <Tutorial
      v-if="store.state.gamestate === 'wingsuit'"
      id="tutorial"
    />

    <Countdown />

    <Transition
      name="sound"
      appear
    >
      <SoundBar v-if="route.name === 'index'" />
    </Transition>
    <canvas id="canvasWebgl" />
  </div>
</template>

<script setup>
import WebGL from '~~/webgl';
import useStore from '~/stores'
import SoundBar from '~~/components/Common/SoundBar.vue';
import Tutorial from '~~/components/Common/Tutorial.vue';
import Countdown from '~~/components/Common/Countdown.vue';

const store = useStore()

const route = useRoute()

const IS_DEV = process.dev

watch(() => route.name, (name) => {
  store.state.lastRoute = name
})

onMounted(() => {
  new WebGL();

  store.state.lastRoute = route.name
});
</script>

<style lang="scss">
.loader-enter-active,
.loader-leave-active {
  transition: opacity 1s ease;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}

#absolute-fade {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  pointer-events: none;

  transition: background-color 2s ease(out-swift);

  &.is-active {
    pointer-events: initial;
    background-color: rgba(colors(black), 1);
  }
}

#canvasWebgl {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* z-index: -1; */
}

.overlay {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, #323846 -15.49%, rgba(50, 56, 70, 0.3) 72.11%, rgba(50, 56, 70, 0.15) 99.71%, rgba(50, 56, 70, 0.3) 127.3%, #323846 214.9%);
  pointer-events: none;
  opacity: 0;
  transition: opacity .5s ease(out-swift);

  &.is-visible {
    opacity: 1;
  }
}

.sound-enter-active,
.sound-leave-active {
  transition: opacity .3s cubic-bezier(0.55, 0, 0.1, 1);
}

.sound-enter-from,
.sound-leave-to {
  opacity: 0;
}
</style>
