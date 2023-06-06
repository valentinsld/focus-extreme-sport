<template>
  <div class="altimetre">
    <h2>
      Altimètre : {{ store.state.altimetre.altitude }}
    </h2>

    <!-- <p>
      scores : {{ store.state.altimetre.scores }}
    </p> -->
  </div>
</template>

<script setup>
// call store
import useStore from '@/stores/index.js'
const store = useStore()
</script>

<style lang="scss">
.altimetre {
  position: absolute;
  left: 20px;
  bottom: 20px;

  border: 1px solid red;
  background-color: black;
  color: white;
}
</style>
