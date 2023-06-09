<template>
  <div
    ref="map"
    class="end-map"
    @mouseenter="hoverMap(true)"
    @mouseleave="hoverMap(false)"
  >
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
        src="/stickers/1-wingsuit.png"
        draggable="false"
      >
    </div>
    <div
      class="map-wrapper"
    >
      <img
        class="map"
        :src="data.background"
      >

      <div
        class="zoning wingsuit"
        @mouseover="handleHover(0, true)"
        @mouseleave="handleHover(null, false)"
      >
        <svg
          viewBox="0 0 77 138"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="wingsuit-place"
        >
          <path
            d="M41.013 95.852c16.8 21.995 25.812 40.293 33.667 41.607 8.6-5.187-13.359-33.115-13.359-33.115s-12.31-31.98-20.306-36.742C22.524 56.588 10.969 1.752 2.469.102c-6.8-1.318 3.22 25.016-.002 20.109C.884 40.957 20.012 68.359 41.013 95.852Z"
          />
        </svg>
        <p class="text">
          <span class="dot" />
          <span class="content">
            wingsuit
          </span>
        </p>
      </div>

      <div
        class="zoning ski"
        @mouseover="handleHover(1, true)"
        @mouseleave="handleHover(null, false)"
      >
        <svg
          viewBox="0 0 58 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="ski-place"
        >
          <path
            d="M24.982 74.493C38.273 95.607 42.86 113.4 52.58 114.347c13.234-5.558-4.46-32.339-4.46-32.339s-4.645-34.634-5.29-43.214c-1.136-15.121-3.218-29.9-13.65-31.15-8.344-1-22.57-1.914-24.849-6.65C-5.84 21.712 8.368 48.1 24.982 74.493Z"
          />
        </svg>
        <p class="text">
          <span class="dot" />
          <span class="content">
            freeride
          </span>
        </p>
      </div>

      <div
        class="zoning kayak"
        @mouseover="handleHover(2, true)"
        @mouseleave="handleHover(null, false)"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="kayak-place"
        >
          <path
            d="M52.796 73.19c20.289 14.52 34.931 28.699 44.288 25.899 10.15-10.15-16.356-28.251-16.356-28.251s-24.09-25.284-27.932-32.983C46.026 24.287 32.043 5.073 21.914 7.86 13.81 10.091 3.984 3.605.084.083c-1.583 23.026 27.351 54.956 52.712 73.106Z"
          />
        </svg>
        <p class="text">
          <span class="dot" />
          <span class="content">
            Kayak
          </span>
        </p>
      </div>

      <div
        v-for="(el, index) in data.list"
        :key="'map'+index"
        ref="debriefs"
        class="debrief-wrapper"
        :class="['debrief-'+index]"
      >
        <div class="debrief-content">
          <h2 class="debrief-title">
            <span class="title-text">{{ el.title }}</span>
            <span class="title-bg" />
          </h2>

          <figure class="debrief-infos">
            <blockquote class="debrief-quote">
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

          <div class="stats">
            <div
              v-for="(d, i) in el.datas"
              :key="index+'map'+i"
              :class="['stat', 'stat-'+i]"
            >
              <h3 class="stat-title">
                {{ d.value }}
              </h3>
              <p class="stat-info">
                {{ d.info }}
              </p>
            </div>
          </div>
        </div>

        <img
          class="debrief-picture"
          :src="el.image"
        >
      </div>
    </div>
    <MapAltimetre :style="`--graduation-translate: ${ translate }px;`" />
  </div>
</template>

<script setup>
  import { useMouseInElement } from '@vueuse/core'
  import RAFManager from '~~/webgl/Utils/RAFManager';
  import { clampedMap } from '~~/webgl/Utils/Math';
  import { lerp } from '~~/webgl/Utils/Lerp';


import MapAltimetre from '~~/components/End/Map/MapAltimetre.vue';

  defineProps({
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

  let y = 0;
  let lerpY = 0

  const hoverIndex = ref(null);
  const isHovered = ref(false)
  const map = ref()
  const translate = ref(0)

  const debriefs = ref()

function handleHover(index, state) {
  hoverIndex.value = index;
  isHovered.value = state

  if (isHovered.value) {
    startHover(index)
  } else {
    removeHover()
  }
}

function startHover(index) {
  debriefs.value[index].classList.add('is-hovered')
}

function removeHover() {
  debriefs.value.forEach(el => {
    el.classList.remove('is-hovered')
  })
}

function hoverMap(state) {
  const {
      elementY,
      elementHeight
	  } = useMouseInElement(map.value);

    if(state) {
      RAFManager.add('map', () => {
        update(elementY, elementHeight)
      })
    }
}

function update(elY, elH) {

  y = clampedMap(elY.value, 0, elH.value * .8, -10, elH.value * .78);

  lerpY = lerp(lerpY, y, .1)

  translate.value = lerpY

}

</script>

<style lang="scss" scoped>
.cloud {
  position: absolute;
  z-index: -2;
  opacity: .5;
  bottom: 15%;
  left: -25%;
}

.sticker {
  position: absolute;
  z-index: -2;
  bottom: 0%;
  right: 25%;

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


.end-map {
  --delay: 25ms;
  position: relative;
}

.map-wrapper {

  position: relative;
  width: 90vw;
  margin: auto;
}

.map {
  width: 100%;
  opacity: .75;
}

.debrief-wrapper {
  top: 0;
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 2;
}

.debrief-content {
  @include fluidSize("content-size",
    (bpw(s): 250px,
      bpw(lg): 300px,
      bpw(xxl): 400px));

  max-width: var(--content-size);
  position: relative;
  padding: 5px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-color: colors(f_border);
    width: 100%;
    height: 100%;
    z-index: -2;
    opacity: 0;
    filter: blur(20px);
    transition: opacity .3s ease(out-swift);
  }

  .is-hovered & {
    &::after {
      opacity: .6;
    }
  }
}

.debrief-0 {
  top: 5%;
  left: 0%;
}

.debrief-1 {
  top: 30%;
  left: 0%;
}

.debrief-2 {
  top: 55%;
  left: 0%;
}

.debrief-title {
  position: relative;
  overflow: hidden;
  padding: 0 .5rem;
  width: fit-content;

  .title-text {
    display: block;
    font-family: const(font-akira);
    font-weight: 900;
    color: colors(black);
    text-transform: uppercase;
    font-size: 2.9rem;
    transform: translateY(2rem);
    opacity: 0;
    transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);
  }

  .title-bg {
    display: block;
    background-color: colors(f_green);
    width: 100%;
    height: 100%;
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    transform: scaleX(0);
    transform-origin: center right;
    transition: transform .3s ease(out-swift);
  }

  .is-hovered & {

    .title-text {
      opacity: 1;
      transform: none;
    }

    .title-bg {
      transform: scaleX(1);
      transform-origin: center left;
      transition-delay: var(--delay);
    }
  }
}

.debrief-quote {
  font-family: const(font-gotham);
  font-size: 1.7rem;
  font-weight: 400;
  font-style: italic;
  color: colors(black);
  margin-top: 1.5rem;
  line-height: 110%;
  letter-spacing: .35px;
  opacity: 0;
  transform: translateY(2rem);
  transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);

  .is-hovered & {
    opacity: 1;
    transform: none;
    transition-delay: calc(var(--delay) * 2);
  }
}

.author-infos {
  margin-top: 1.5rem;
}


.author {
  font-family: const(font-akira);
  text-transform: uppercase;
  font-weight: 900;
  font-size: 1.3rem;
  color: colors(black);
  opacity: 0;
  transform: translateY(2rem);
  transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);

  .is-hovered & {
    opacity: 1;
    transform: none;
    transition-delay: calc(var(--delay) * 2.5);
  }
}

.role {
  font-family: const(font-gotham);
  font-weight: 400;
  font-size: 1.3rem;
  color: colors(black);
  opacity: 0;
  transform: translateY(2rem);
  transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);

  .is-hovered & {
    opacity: 1;
    transform: none;
    transition-delay: calc(var(--delay) * 3);
  }
}

.stats {
  position: relative;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  width: 85%;

  &::after {
    content: "";
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    background-color: colors(black);
    width: 100%;
    height: 1px;
    transform: scaleX(0);
    transform-origin: center right;
    transition: transform .3s ease(out-swift);
  }

  .is-hovered & {
    &::after {
      transform: none;
      transform-origin: center left;
      transition-delay: calc(var(--delay) * 3.5);
    }
  }

}

.stat {
  margin-right: 1rem;
  transform: translateY(2rem);
  opacity: 0;
  transition: transform .3s ease(out-swift), opacity .3s ease(out-swift);

}

@for $i from 0 through 2 {
  .stat-#{ $i } {
    .is-hovered & {
      transition-delay: calc((var(--delay) * 4) + (#{$i} * 50ms));
      transform: none;
      opacity: 1;
    }
  }
}

.stat-title {
  font-family: const(font-tusker);
  font-weight: 700;
  color: colors(black);
  font-size: 1.4rem;
}

.stat-info {
  font-size: .8rem;
  font-family: const(font-gotham);
  font-weight: 400;
  text-transform: uppercase;
  color: colors(black);
}

.zoning {
  position: absolute;
  z-index: 2;
  cursor: pointer;

  &:hover {
    .text {

      .dot {
        background-color: colors(f_green);
      }

      .content {
        &::after {
          transform: scaleX(1);
          transform-origin: center left;
        }
      }
    }

    svg {
      fill: colors(f_green);
    }
  }

  .text {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    top: -20%;
    right: -150%;
    font-family: const(font-akira);
    font-weight: 900;
    font-size: 2rem;
    text-transform: uppercase;
    color: colors(black);


    .content {
      position: relative;
      padding: 0 .5rem;
      mix-blend-mode: difference;

      &::after {
        content: "";
        position: absolute;
        z-index: -1;
        display: block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: colors(f_green);
        transform-origin: center right;
        transform: scaleX(0);
        transition: transform .3s ease(out-swift);
        will-change: transform;
      }
    }

    .dot {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background-color: colors(black);
      margin-right: 1rem;
      transition: background-color .3s ease(out-swift);
    }
  }

  svg {
    transition: fill .3s ease(out-swift);
  }
}

.debrief-picture {
  @include fluidSize("pic-size",
    (bpw(s): 100px,
      bpw(lg): 250px,
      bpw(xxl): 300px));

  width: var(--pic-size);
  transform: rotate(15deg) scale(.25);
  opacity: 0;
  transition: transform .5s ease(out-swift), opacity .4s ease(out-swift);

  filter: drop-shadow(0px 0px 10px #2a292d5f);

  .is-hovered & {
    transform: none;
    opacity: 1;
    transition-delay: calc(var(--delay) * 2);
  }
}

.wingsuit {
  top: 11.75%;
  left: 57.75%;
  width: 8rem;
  height: 25%;

  .text {
    right: -110%;
  }
}

.wingsuit-place {
  fill: colors(black);
  opacity: .7;
  height: 100%;
}

.ski {
  top: 37.5%;
  left: 65%;
  width: 8rem;
  height: 20%;

  .text {
    right: -150%;
  }
}

.ski-place {
  fill: colors(black);
  opacity: .7;
  height: 100%;
}

.kayak-place {
  height: 100%;
  fill: colors(black);
  opacity: .7;
}

.kayak {
  top: 60%;
  left: 70%;
  width: 8rem;
  height: 15%;

  .text {
    right: -70%;
  }
}
</style>
