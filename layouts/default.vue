<template>
  <div>
    <slot />

    <QteInfoNoEvent :hidden="store.state.noEventPlayer" />
    <canvas id="canvasWebgl" />
  </div>
</template>

<script setup>
import useStore from '@/stores/index.js'
import WebGL from '~~/webgl';

const store = useStore()

onMounted(() => {
  new WebGL();
});


</script>

<style scoped>
#canvasWebgl {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
