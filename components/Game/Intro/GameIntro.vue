<template>
  <section class="page page-intro">
    <div class="breathe-container">
      <div
        v-for="i in 6"
        :key="i"
        ref="circles"
        class="breathe-circle"
        :class="[
          'circle-'+i,
          {'is-inhaling': isInhaling},
          {'is-exhaling': !isInhaling},
        ]"
      />
      <div class="breathe-point" />
    </div>
    <transition
      name="text"
      appear
    >
      <div
        v-if="isInhaling"
        class="text"
      >
        <p
          class="t1"
          v-html="inhaleText"
        />
      </div>
      <div
        v-else
        class="text"
      >
        <p
          class="t2"
          v-html="exhaleText"
        />
      </div>
    </transition>
  </section>
</template>

<script setup>
import useStore from '@/stores/index.js'
import { splitText } from '~~/webgl/Utils/splitText';

const store = useStore()

const isInhaling = ref(false)
const circles = ref()

const inhaleText = splitText('Inspire...')
const exhaleText = splitText('...Expire')

onMounted(()=> {
  setTimeout(()=> {
    breathe(1)
  }, 100)
})

function breathe(count) {
  const totalTime = 15000; // en ms
  const inhaleTime = totalTime / 5;
  const exhaleTime = totalTime / 5;

  let step = 0;

  const breatheLoop = () => {
    if (step >= count) {
      store.state.gamestate = 'wingsuit'
      store.isIntroFinished = true
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

<style lang="scss" scoped>
.breathe-container {
  --breathe-duration: 3s;

  @include fluidSize("container-size",
    (bpw(s): 100px,
      bpw(lg): 250px,
      bpw(xxl): 350px));

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--container-size);
  height: var(--container-size);
  border: 1px solid colors(white);
  border-radius: 50%;
}

@for $i from 1 through 6 {
  .circle-#{$i} {
    position: absolute;
    width: calc(100% * (.17 * #{$i}));
    height: calc(100% * (.17 * #{$i}));
    background-color: rgba(colors(white), calc(100% / (#{$i})));
    border-radius: 50%;
    transform: scale(0);
    transition: transform ease(out-swift);
    transition-duration: var(--breathe-duration);
    transition-delay: calc(10ms + (#{$i} * 75ms));

    &.is-inhaling {
      transform: scale(1);
    }

    &.is-exhaling {
      transform: scale(0);
    }
  }
}

.breathe-point {
  position: absolute;
  width: 10%;
  height: 10%;
  background-color: colors(white);
  border-radius: 50%;
  z-index: 2;
  animation: BreatheMovement calc(var(--breathe-duration) + 1) ease-in-out infinite;
}

.text {
  position: absolute;
  bottom: 2%;
}


.text-enter-active,
.text-leave-active {
  transition: opacity 375ms cubic-bezier(0.55, 0, 0.1, 1);
}

.text-enter-from,
.text-leave-to {
  opacity: 0;
}



@for $i from 1 through 10 {
  :deep(.char-#{$i}) {
    display: inline-block;
    animation: PopLetter 1.5s ease-out infinite;
    animation-delay: calc(150ms + (#{$i} * 75ms));
  }
}
</style>
