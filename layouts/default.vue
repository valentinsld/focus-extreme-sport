<template>
  <div
    :class="{'no-cursor': noCursor}"
  >
    <Transition
      name="loader"
      appear
    >
      <Loader v-if="!store.state.ressourcesLoaded && !IS_DEV" />
    </Transition>
    <div id="absolute-fade" />
    <slot />

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
const store = useStore()

const route = useRoute()
console.log(route.name);

const IS_DEV = process.dev

onMounted(() => {
  new WebGL();
});

const noCursor = computed(() => ['intro', 'wingsuit', 'ski', 'kayak'].includes(store.state.gamestate))


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

.no-cursor {
  cursor: none;
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

.sound-enter-active,
.sound-leave-active {
  transition: opacity .3s cubic-bezier(0.55, 0, 0.1, 1);
}

.sound-enter-from,
.sound-leave-to {
  opacity: 0;
}
</style>
