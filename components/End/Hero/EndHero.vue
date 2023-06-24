<template>
  <div
    ref="hero"
    class="hero"
  >
    <div
      v-for="(el, i) in data.list"
      :key="'hero'+i"
      ref="letters"
      class="hero-letter"
      data-in-view
      :class="[
        'letter-' + i,
        { 'is-notHovered': hoverIndex !== i && isHovered},
        { 'is-hovered': hoverIndex === i && isHovered},
      ]"
      @mouseover="handleHover(i, true)"
      @mouseleave="handleHover(null, false)"
    >
      <h2
        class="letter-title"
      >
        <span class="letter-container">
          {{ el.letter }}
        </span>
      </h2>

      <div class="epigraph">
        <figure class="quote-container">
          <blockquote class="quote">
            {{ el.quote }}
          </blockquote>
          <figcaption class="author-infos">
            <p class="author">
              {{ el.author }}
            </p>
            <p class="role">
              {{ el.role }}
            </p>
          </figcaption>
        </figure>

        <img
          :src="el.image"
          draggable="false"
          class="picture"
        >
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

  let x = 0;
  let y = 0;
  let lerpX = 0
  let lerpY = 0

  const hoverIndex = ref(null);
  const isHovered = ref(false)

  const letters = ref()
  const hero = ref()

  onMounted(() => {
    setTimeout(() => {
      hero.value.classList.add('is-observed')
    }, 100)
  })

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
	  } = useMouseInElement(letters.value[hoverIndex.value]);

    const element = letters.value[hoverIndex.value].querySelector('.epigraph');

    RAFManager.add('hero', (dt) => {
      update(dt, elementX, elementY, elementWidth, elementHeight, element)
    })
  }

  function removeHover() {
		RAFManager.remove('hero')
	}

  function update(dt, elX, elY, elW, elH, element) {

    x = clampedMap(elX.value, 0, elW.value, -1, 1);
    y = clampedMap(elY.value, 0, elH.value, -1, 1);

    lerpX = lerp(lerpX, x * 40, .1)
    lerpY = lerp(lerpY, y * 40, .1)

    element.style.transform = `translate(${lerpX}px, ${lerpY}px)`;

  }

</script>

<style lang="scss" scoped>
//TODO add responsiveness

.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &.is-observed {
    @for $i from 0 through 4 {
      .letter-#{$i} {
        .letter-title {
          transition-delay: calc(100ms + (#{$i} * 50ms));
          transform: none;
          opacity: 1;
        }
      }
    }
  }

}

.hero-letter {
  position: relative;
}

.letter-title {

  transform: rotate(20deg) scale(0.25);
  opacity: 0;
  transition: transform .8s ease(out-bounce), opacity .7s ease(out-swift);

  .letter-container {

    font-family: const(font-akira);
    font-weight: 900;
    font-size: 22vw;
    line-height: 80%;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 2px colors(black);
    mix-blend-mode: overlay;
    margin: 0 .2rem;
    transition: color .3s ease(out-swift), -webkit-text-stroke .8s ease(out-swift);
  }

  .is-hovered & {
    .letter-container {
      color: rgba(colors(white), .7);
      -webkit-text-stroke: 0px;
    }
  }
}

.epigraph {
  position: absolute;
  display: flex;
  align-items: center;
  z-index: -1;
  height: 100vh;
  opacity: 0;
  pointer-events: none;
  transition: opacity .5s ease(out-swift);
  top: -120%;
  left: -50%;

  .is-hovered & {
    opacity: 1;
  }

  .letter-2 & {
    left: unset;
    right: -25%;
  }

  .letter-3 & {
    left: unset;
    right: -20%;
  }

}

.letter-0,
.letter-2,
{
color: colors(f_pink);
}

.letter-1,
.letter-3,
{
color: colors(f_purple);
}

.quote-container {
  max-width: 20ch;
  position: absolute;
  z-index: 2;
  right: 0;
  bottom: 5%;
  transform: translate(110%, 0%);

  .letter-2 &,
  .letter-3 & {
    right: unset;
    left: 0;
    transform: translate(-110%, 0%);
  }
}

.picture {
  height: 70%;
  transform: rotate(20deg) scale(0.25);
  opacity: 0;
  transition: transform .3s ease(out-swift), opacity .25s ease(out-swift);

  .is-hovered & {
    transform: none;
    opacity: 1;
    transition: transform .8s ease(out-bounce), opacity .7s ease(out-swift);
  }
}

.quote {
  font-family: const(font-gotham);
  font-style: italic;
  font-weight: 400;
  font-size: 1.6rem;
  transform: translateY(2rem);
  opacity: 0;
  transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);

  .is-hovered & {
    transform: none;
    opacity: 1;
    transition-delay: 200ms;
  }
}


.author-infos {
  margin-top: 1rem;
}


.author {
  font-family: const(font-akira);
  text-transform: uppercase;
  font-weight: 900;
  font-size: 1.3rem;
  transform: translateY(2rem);
  opacity: 0;
  transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);

  .is-hovered & {
    transform: none;
    opacity: 1;
    transition-delay: 275ms;
  }
}

.role {
  font-family: const(font-gotham);
  font-weight: 400;
  font-size: 1.3rem;
  transform: translateY(2rem);
  opacity: 0;
  transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);

  .is-hovered & {
    transform: none;
    opacity: 1;
    transition-delay: 350ms;
  }
}
</style>
