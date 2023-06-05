<template>
  <section
    class="page page-intro"
    :class="{'is-hide': isHide}"
  >
    <Transition name="stepIntro">
      <p v-if="!isBreating">
        Le sport est régi par la concentration.<br>
        Délicate et capricieuse, elle est le fruit d’une préparation intense.
      </p>
      <div v-else>
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
      </div>
    </Transition>
  </section>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneHome from '~~/webgl/Scenes/SceneHome';
import { splitText } from '~~/webgl/Utils/splitText';

const store = useStore()

const isBreating = ref(false)
const isInhaling = ref(false)
const circles = ref()

const isHide = ref(false)
const DURATION_BEFORE_FADE = 1500

const inhaleText = splitText('Inspire...')
const exhaleText = splitText('...Expire')

onMounted(()=> {
  const sceneHome = new SceneHome()

  sceneHome.playDark()

  setTimeout(() => {
    isBreating.value = true

    setTimeout(()=> {
      breathe(3)
    }, 300)
  }, 10000)
})

function breathe(count) {
  const totalTime = 15000; // en ms
  const inhaleTime = totalTime / 5;
  const exhaleTime = totalTime / 5;

  let step = 0;

  const breatheLoop = () => {
    if (step >= count) {
      isHide.value = true
      setTimeout(() => store.state.gamestate = 'wingsuit', DURATION_BEFORE_FADE)
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
.page-intro {
  position: relative;

  &>* {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;
  }
}

.stepIntro-enter-active,
.stepIntro-leave-active {
  transition: opacity 375ms cubic-bezier(0.55, 0, 0.1, 1);
}

.stepIntro-enter-from,
.stepIntro-leave-to {
  opacity: 0;
}

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
