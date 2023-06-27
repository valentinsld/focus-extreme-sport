<template>
  <div class="definition flow-section">
    <img
      src="/cloud.png"
      draggable="false"
      class="cloud"
      :style="`transform:
					translateY(${cloudTranslate}%)
				`"
    >
    <div
      class="sticker"
      data-in-view
      :style="`transform:
            translateY(${stickerTranslate}%)
          `"
    >
      <img
        src="/stickers/1-kayak.png"
        draggable="false"
      >
    </div>
    <div class="definition-title">
      <h2
        class="title"
        data-in-view
      >
        <span
          v-for="(word, index) in title"
          :key="word"
          class="title-word"
          :class="[
            'title-word-' + index,
          ]"
          v-html="word.innerText"
        />
      </h2>
      <p
        class="text"
        data-in-view
      >
        {{ data.content }}
      </p>
    </div>

    <div
      class="skills"
      data-in-view
    >
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
          <div class="picture-container">
            <img
              :src="el.image"
              class="word-picture"
              draggable="false"
            >
          </div>
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
  import { splitByWord } from '~~/webgl/Utils/splitText';

const props = defineProps({
	data: {
		type: Object,
		required: true
	},
  cloudTranslate: {
			type: [ Number, String ],
			default: 0
		},
  stickerTranslate: {
			type: [ Number, String ],
			default: 0
		},
})

  let x = 0
  let y = 0
  let lerpX = 0
  let lerpY = 0

const hoverIndex = ref(null);
const isHovered = ref(false)

const words = ref()
const wordsArr = []

const title = splitByWord(props.data.title)

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

    const element = words.value[hoverIndex.value].querySelector('.picture-container');

    RAFManager.add('definition', (dt) => {
      update(dt, elementX, elementY, elementWidth, elementHeight, element)
    })
  }

  function removeHover() {
		RAFManager.remove('definition')
	}

  function update(dt, elX, elY, elW, elH, element) {

    x = clampedMap(elX.value, 0, elW.value, 0, elW.value);
    y = clampedMap(elY.value, 0, elH.value, 0, elH.value);

    lerpX = lerp(lerpX, x, .1)
    lerpY = lerp(lerpY, y, .1)

    element.style.transform = `translate(${lerpX}px, ${lerpY}px)`;

  }
</script>

<style lang="scss" scoped>
.cloud {
  position: absolute;
  z-index: -1;
  opacity: .35;
  top: 15%;
  right: -70%;
}

.sticker {
  position: absolute;
  z-index: -1;
  top: 35%;
  right: -20%;

  img {
    width: 20rem;
    transform: rotate(20deg) scale(.25);
    opacity: 0;
    transition: transform .5s ease(out-bounce), opacity .5s ease(out-swift);

  }

  &.is-observed {
    img {
      transform: none;
      opacity: 1;
    }
  }
}


.definition {
  position: relative;
  width: 100%;
  margin: 2rem auto 13rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

  &.is-observed {
    @for $i from 0 through 20 {
      .title-word-#{$i} {
        transition-delay: calc(100ms + (#{$i} * 25ms));
        transform: none;
        opacity: 1;
      }
    }
  }
}

.title-word {
  margin: 0 .6rem;
  display: inline-block;
  transform: translateY(2rem);
  opacity: 0;
  transition: transform .5s ease(out-swift), opacity .5s ease(out-swift);
}


.text {
  margin: 5rem auto;
  font-family: const(font-gotham);
  font-weight: 400;
  font-size: 1.9rem;
  line-height: 125%;
  color: colors(black);
  text-align: center;
  letter-spacing: .45px;
  max-width: 700px;
  opacity: 0;
  transition: opacity .3s ease(out-swift);
  transition-delay: 250ms;

  &.is-observed {
    opacity: 1;
  }
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
  opacity: 0;
  transform: translateY(4rem);
  transition: transform .5s ease(out-swift), opacity .5s ease(out-swift);

  .is-observed & {
    opacity: 1;
    transform: none;
  }
}

@for $i from 0 through 2 {
  .word-#{$i} {
    transition-delay: calc(200ms + (#{$i} * 75ms));
  }
}

.word-text {
  font-family: const(font-akira);
  font-size: 10rem;
  text-transform: uppercase;
  color: colors(white);
  transition: color .5s ease(out-swift);



  &.is-observed {
    opacity: 1;
  }

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
