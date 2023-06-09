<template>
  <div
    class="films flow-section"
  >
    <h2
      class="films-title"
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

    <div
      ref="container"
      class="films-list keen-slider"
    >
      <a
        v-for="(el, index) in data.list"
        :key="'film'+index"
        :href="el.url"
        target="_blank"
        class="films-link keen-slider__slide"
      >
        <img
          :src="el.image"
          class="films-picture"
          rel="preload"
          fetchpriority="high"
        >
      </a>
    </div>

    <div class="separator">
      <svg
        viewBox="0 0 31 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="separator-icon"
      >
        <path
          d="M15.727 30.462A23.518 23.518 0 0 0 .91 15.645 23.518 23.518 0 0 0 15.727.828a23.518 23.518 0 0 0 14.817 14.817 23.518 23.518 0 0 0-14.817 14.817Z"
        />
      </svg>
      <div class="arrow" />
    </div>
  </div>
</template>

<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import WheelControls from '~/js/slider-plugin/wheelLenis.js'

import { splitByWord } from '~~/webgl/Utils/splitText';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const title = splitByWord(props.data.title)

const emit = defineEmits(['stop-scroll', 'start-scroll'])
const [container] = useKeenSlider({
  loop: false,
	mode: "snap",
	rtl: false,
	slides: {
    perView: "auto",
		spacing: 20
	},
}, [(slider) => {
  WheelControls(slider, emit)
}])
</script>

<style lang="scss" scoped>
.films-title {
  font-family: const(font-tusker);
  font-weight: 400;
  color: colors(black);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-size: 5rem;
  margin-bottom: 3rem;

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

.films-list {
  display: flex;
  margin-top: 3rem;

  overflow: inherit !important;
}

.films-link {
  @include fluidSize("picture-size",
    (bpw(s): 220px,
      bpw(lg): 270px,
      bpw(xxl): 320px));

  min-width: var(--picture-size);
}

.films-picture {

  width: 100%;
}

.separator {
  margin-top: 5rem;
  width: 100%;
}

.separator-icon {
  width: 2rem;
  fill: colors(black);
  margin-right: 2rem;
  display: inline-block;
  vertical-align: middle;
}

.arrow {
  position: relative;
  width: 60%;
  height: 1px;
  background-color: colors(black);
  display: inline-block;
  vertical-align: middle;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: .75rem;
    height: 1px;
    right: 0;
    display: block;
    background-color: colors(black);
    transform-origin: center right;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
}
</style>
