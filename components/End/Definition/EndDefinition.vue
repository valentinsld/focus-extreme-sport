<template>
  <div class="definition">
    <div class="definition-title">
      <h2 class="title">
        {{ data.title }}
      </h2>
      <p class="text">
        {{ data.content }}
      </p>
    </div>

    <div class="skills">
      <div
        v-for="(el, i) in data.words"
        :key="'word'+i"
        ref="words"
        class="words"
        :class="[
          'word-' + i,
          { 'is-notHovered': hoverIndex !== i && isHovered},
          { 'is-hovered': hoverIndex === i && isHovered},
        ]"
        @mouseover="handleHover(i, true)"
        @mouseleave="handleHover(null, false)"
      >
        <h3 class="word-text">
          <span class="text-size">
            {{ el.word }}
          </span>
        </h3>
        <div class="picture-wrapper">
          <img
            :src="el.image"
            class="word-picture"
            draggable="false"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useMouseInElement } from '@vueuse/core'
  import RAFManager from '~~/webgl/Utils/RAFManager';
  import { clampedMap } from '~~/webgl/Utils/Math';
  import { lerp } from '~~/webgl/Utils/Lerp';

defineProps({
	data: {
		type: Object,
		required: true
	}
})

  let x = 0
  let y = 0
  let lerpX = 0
  let lerpY = 0

const hoverIndex = ref(null);
const isHovered = ref(false)

const words = ref()
const wordsArr = []

onMounted(()=> {
  for (let i = 0; i < words.value.length; i++) {
    const element = words.value[i].querySelector('.text-size');
    const wrapper = words.value[i].querySelector('.picture-wrapper');
    wordsArr.push(wrapper)
    getSize(element, i)
  }

})

function getSize(element, index) {
  const size = element.getBoundingClientRect();
  wordsArr[index].style.height = `${size.height}px`;
}

function handleHover(index, state) {
  hoverIndex.value = index;
  isHovered.value = state

  if (isHovered.value) {
    startHover()
  } else {
    removeHover()
  }
}

  function startHover() {
    const {
      elementX,
      elementY,
      elementWidth,
      elementHeight
	  } = useMouseInElement(words.value[hoverIndex.value]);

    const element = words.value[hoverIndex.value].querySelector('.word-picture');

    RAFManager.add('definition', (dt) => {
      update(dt, elementX, elementY, elementWidth, elementHeight, element)
    })
  }

  function removeHover() {
		RAFManager.remove('definition')
	}

  function update(dt, elX, elY, elW, elH, element) {

    x = clampedMap(elX.value, 0, elW.value, -1, 1);
    y = clampedMap(elY.value, 0, elH.value, -1, 1);

    lerpX = lerp(lerpX, elX.value, .1)
    lerpY = lerp(lerpY, elY.value, .1)

    element.style.left = `${lerpX}px`;
    element.style.top = `${lerpY}px`;

  }
</script>

<style lang="scss" scoped>
.definition {
  width: 100%;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.definition-title {
  max-width: 700px;
}

.title {
  @include fluidSize("title-size",
    (bpw(s): 35px,
      bpw(lg): 50px,
      bpw(xxl): 75px));

  text-transform: uppercase;
  color: colors(black);
  font-family: const(font-tusker);
  font-weight: 400;
  font-size: var(--title-size);
  text-align: center;
  max-width: 35ch;
  margin: auto;
  letter-spacing: 1.25px;
  line-height: 120%;
}

.text {
  margin: 5rem 0;
  font-family: const(font-gotham);
  font-weight: 400;
  font-size: 1.9rem;
  line-height: 125%;
  color: colors(black);
  text-align: center;
  letter-spacing: .45px;
}

.skills {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.words {
  position: relative;
  margin-bottom: -4rem;
}

.word-text {
  font-family: const(font-akira);
  font-size: 10rem;
  text-transform: uppercase;
  color: colors(white);
  transition: color .5s ease(out-swift);

  .is-hovered & {
    color: rgba(colors(black), .2);
  }
}

.picture-wrapper {
  position: absolute;
  overflow: hidden;
  z-index: -1;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
}

.word-picture {
  position: absolute;
  pointer-events: none;
  width: 30rem;

  transform: translate(-50%, -50%) rotate(20deg) scale(.25);
  opacity: 0;
  transition: transform .8s ease(out-bounce), opacity .7s ease(out-swift);

  .is-hovered & {
    transform: translate(-50%, -50%) rotate(0deg) scale(1);
    opacity: 1;
  }
}
</style>
