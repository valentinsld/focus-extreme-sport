<template>
  <div class="events flow-section">
    <h2
      class="events-title"
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
    <div class="films-list">
      <a
        v-for="(el, index) in data.list"
        :key="'event'+index"
        :href="el.url"
        target="_blank"
        class="films-item"
      >
        <div class="item">
          <img
            :src="el.image"
            class="films-picture"
          >
          <span class="films-date-container">
            <span class="films-date">
              {{ el.date }}
            </span>
          </span>
        </div>
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
  import { splitByWord } from '~~/webgl/Utils/splitText';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const title = splitByWord(props.data.title)
</script>

<style lang="scss" scoped>
.events-title {
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

.item {
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 40px 5px rgba(colors(black), .3);
  width: fit-content;
}

.films-list {
  display: flex;
  align-items: stretch;
}

.films-item {
  position: relative;
  margin-right: 2rem;
}

.films-picture {
  @include fluidSize("picture-size",
    (bpw(s): 200px,
      bpw(lg): 250px,
      bpw(xxl): 300px));

  aspect-ratio: 12/17;
  width: var(--picture-size);
  display: block;
}

.films-date-container {
  width: 100%;
  background-color: colors(white);
  padding: 1rem 0;
  display: block;
}

.films-date {
  font-family: const(font-tusker);
  font-weight: 400;
  color: colors(black);
  text-align: center;
  display: block;
  font-size: 2.5rem;
  text-transform: uppercase;
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
  will-change: transform;

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
