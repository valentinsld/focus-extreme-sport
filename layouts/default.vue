<template>
  <div>
    <slot />

    <canvas id="canvasWebgl"></canvas>
  </div>
</template>

<script setup>
import WebGL from "~~/webgl";

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
