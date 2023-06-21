<template>
  <div class="hero">
    <div
      v-for="(el, i) in data.list"
      :key="'hero'+i"
      ref="letters"
      class="hero-letter"
      :class="['letter-' + i]"
      @mouseover="handleHover(i, true)"
      @mouseleave="handleHover(null, false)"
    >
      <h2
        class="letter-title"
        :class="[
          { 'is-notHovered': hoverIndex !== i && isHovered},
          { 'is-hovered': hoverIndex === i && isHovered},
        ]"
      >
        {{ el.letter }}
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


  defineProps({
	  data: {
		  type: Object,
		  required: true
	  }
  })

  const hoverIndex = ref(null);
  const isHovered = ref(false)

  const letters = ref()

  function handleHover(index, state) {
    hoverIndex.value = index;
    isHovered.value = state

    if (isHovered.value) {
      startHover()
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

  function update(dt, elX, elY, elW, elH, element) {
    let x = 0;
    let y = 0;

    x = clampedMap(elX.value, 0, elW.value, -1, 1);
    y = clampedMap(elY.value, 0, elH.value, -1, 1);

    element.style.transform = `translate(${x * 40}px, ${y * 40}px)`;

  }

</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-letter {
  position: relative;
}

.letter-title {
  @include fluidSize("letter-size",
    (bpw(s): 80px,
      bpw(lg): 250px,
      bpw(xxl): 300px));

  font-family: const(font-akira);
  font-weight: 900;
  font-size: var(--letter-size);
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 2px colors(black);
  mix-blend-mode: overlay;
  margin: 0 .2rem;
  transition: color .3s ease(out-swift), -webkit-text-stroke .8s ease(out-swift);

  &.is-hovered {
    color: rgba(colors(white), .7);
    -webkit-text-stroke: 0px;
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
  top: -80%;
  left: -50%;

  .is-hovered~& {
    opacity: 1;
  }

  .letter-2 &,
  .letter-3 &,
  {
  left: unset;
  right: -50%;
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
  bottom: 0;
  transform: translate(110%, 0%);

  .letter-2 &,
  .letter-3 & {
    right: unset;
    left: 0;
    transform: translate(-110%, 0%);
  }
}

.quote {
  font-family: const(font-gotham);
  font-style: italic;
  font-weight: 400;
  font-size: 1.6rem;
}

.picture {
  height: 70%;
}

.author-infos {
  margin-top: 1rem;
}

.author {
  font-family: const(font-akira);
  text-transform: uppercase;
  font-weight: 900;
  font-size: 1.3rem;
}

.role {
  font-family: const(font-gotham);
  font-weight: 400;
  font-size: 1.3rem;
}
</style>
