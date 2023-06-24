<template>
  <section class="sport flow-section">
    <h2
      class="sport-title"
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

    <div class="sport-wrapper">
      <div
        v-for="(el, index) in data.types"
        :key="'sports'+index"
        class="sport-list"
        data-in-view
        :class="[
          'sport-' + index
        ]"
      >
        <div class="top-star stars">
          <svg
            viewBox="0 0 184 184"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M183.142 91.57a145.346 145.346 0 0 0-91.57 91.572A145.347 145.347 0 0 0 0 91.57 145.347 145.347 0 0 0 91.571 0a145.347 145.347 0 0 0 91.571 91.57Z"
            />
          </svg>
        </div>
        <div class="bottom-star stars">
          <svg
            viewBox="0 0 184 184"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M183.142 91.57a145.346 145.346 0 0 0-91.57 91.572A145.347 145.347 0 0 0 0 91.57 145.347 145.347 0 0 0 91.571 0a145.347 145.347 0 0 0 91.571 91.57Z"
            />
          </svg>
        </div>
        <h3
          class="sport-category"
          :class="[el.name]"
        >
          <span>
            {{ el.name }}
          </span>
        </h3>

        <div class="link-wrapper">
          <a
            v-for="(e, i) in el.list"
            :key="index+'sports'+i"
            :href="e.url"
            target="_blank"
            class="sport-link"
            :class="['link-' + i]"
          >
            <span class="sport-link-text">
              {{ e.name }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
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
// .sport {
//   width: 100%;
//   max-width: 980px;
//   margin: 6.5rem auto;
// }

.sport-title {
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

.sport-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  // align-items: flex-start;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: space-between;
}

.sport-list {
  position: relative;
  width: 48%;
  // max-width: 48%;
  padding: 3rem;
  margin: 1.5rem 0;
  border: 1px solid colors(black);
  border-top-left-radius: 2rem;
  border-bottom-right-radius: 2rem;
  transform: translateY(2rem) rotate(10deg);
  opacity: 0;
  transition: transform .5s ease(out-swift), opacity .5s ease(out-swift);
  will-change: transform;

  &.is-observed {

    transform: none;
    opacity: 1;

    .stars {
      opacity: 1;
    }

    .sport-category {

      span {
        transform: none;
        transition-delay: 200ms;
      }

      &::after {
        transform: none;
        transition-delay: 100ms;
      }
    }

    @for $i from 0 through 20 {
      .link-#{$i} {
        transition-delay: calc(300ms + (#{$i} * 25ms));
        transform: none;
        opacity: 1;
      }
    }
  }
}

.stars {
  position: absolute;
  width: 1.5rem;
  opacity: 0;
  transition: opacity .3s ease(out-swift);
  transition-delay: 150ms;

  svg {
    width: 100%;
    fill: colors(black);
  }
}

.top-star {
  top: 0;
  right: 5px;
}

.bottom-star {
  bottom: 0;
  left: 5px;
}

.sport-category {

  padding: 0 .8rem;
  position: relative;
  width: fit-content;
  margin-bottom: 2rem;
  overflow: hidden;

  span {
    font-family: const(font-akira);
    font-weight: 700;
    color: colors(black);
    text-transform: uppercase;
    font-size: 3rem;
    display: block;
    transform: translateY(4rem);
    transition: transform .5s ease(out-swift);
  }

  &.Eau {
    &::after {
      background-color: colors(f_purple);
    }
  }

  &.Neige {
    &::after {
      background-color: colors(f_pink);
    }
  }

  &.Terre {
    &::after {
      background-color: colors(f_blue);
    }
  }

  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: colors(f_green);
    transform-origin: center left;
    transform: scaleX(0);
    transition: transform .5s ease(out-swift);
  }
}

.link-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  flex-flow: row wrap;
}

.sport-link {
  position: relative;
  overflow: hidden;
  padding: .5rem 1rem;
  border: 1px solid colors(black);
  margin: .5rem 1rem .2rem 0;
  border-radius: 2rem;
  transform: scale(0);
  opacity: 0;
  transition: transform .5s ease(out-swift), opacity .5s ease(out-swift);

  span {
    font-family: const(font-gotham);
    font-weight: 400;
    text-transform: lowercase;
    font-size: 2rem;
    color: colors(black);
    transition: color .3s ease(out-swift);
  }

  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    z-index: -1;
    background-color: colors(black);
    transform: translate(-50%, 110%) scale(2);
    transition: transform .5s ease(out-swift);
  }

  &:hover {
    span {
      color: colors(white);
    }

    &::after {
      transform: translate(-50%, -85%) scale(2);
    }
  }
}
</style>
