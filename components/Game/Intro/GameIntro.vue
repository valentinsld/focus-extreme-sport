<template>
  <section class="page page-intro">
    {{ isInhaling }}
  </section>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager';

const store = useStore()

const isInhaling = ref(false)

onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('intro')

  breathe(4)
})

function breathe(count) {
  const totalTime = 4000;
  const inhaleTime = totalTime / 5;
  const exhaleTime = totalTime / 5;

  let step = 0;

  const breatheLoop = () => {
    console.log(step);
    if (step >= count) {
      store.state.gamestate = 'kayak'
      return;
    }

    isInhaling.value = true

    setTimeout(() => {
      isInhaling.value = false

      step++;

      setTimeout(breatheLoop, exhaleTime);
    }, inhaleTime);
  };

  breatheLoop();
}
</script>
