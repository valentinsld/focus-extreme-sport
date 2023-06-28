<template>
  <div
    ref="base"
    class="rewards-slider"
  >
    <button
      class="rewards-slider__button"
      @click="slider.prev()"
    >
      <svg
        width="22"
        height="18"
        viewBox="0 0 22 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.527341 8.35212L0.527342 18.0001L11.0273 9.64795L21.5273 18.0001L21.5273 8.35212L11.0273 7.92728e-07L0.527341 8.35212Z"
          fill="black"
        />
      </svg>
    </button>
    <div />
    <div
      ref="container"
      class="rewards-slider__slider keen-slider"
    >
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.like_a_boss,
        }"
        data-sport="boss"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/like_a_boss.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.wingsuit.includes(1)
        }"
        data-sport="wingsuit"
        data-level="top"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/1-wingsuit.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.wingsuit.includes(2)
        }"
        data-sport="wingsuit"
        data-level="mid"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/2-wingsuit.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.wingsuit.includes(3)
        }"
        data-sport="wingsuit"
        data-level="bot"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/3-wingsuit.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.ski.includes(1)
        }"
        data-sport="ski"
        data-level="top"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/1-ski.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.ski.includes(2)
        }"
        data-sport="ski"
        data-level="mid"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/2-ski.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.ski.includes(3)
        }"
        data-sport="ski"
        data-level="bot"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/3-ski.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.kayak.includes(1)
        }"
        data-sport="kayak"
        data-level="top"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/1-kayak.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.kayak.includes(2)
        }"
        data-sport="kayak"
        data-level="mid"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/2-kayak.png"
        >
      </div>
      <div
        :class="{
          'keen-slider__slide': true,
          'is-hide': !stickers.state.kayak.includes(3)
        }"
        data-sport="kayak"
        data-level="bot"
        @mouseenter="showInfos"
        @mouseleave="hideInfos"
      >
        <img
          src="/stickers/3-kayak.png"
        >
      </div>
    </div>
    <button
      class="rewards-slider__button"
      @click="slider.next()"
    >
      <svg
        width="22"
        height="19"
        viewBox="0 0 22 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.5273 10.1401L21.5273 0.492119L11.0273 8.84424L0.527344 0.49212L0.527344 10.1401L11.0273 18.4922L21.5273 10.1401Z"
          fill="black"
        />
      </svg>
    </button>
    <div
      class="stickers-infos"
      :class="{'is-visible': isInfosVisible}"
    >
      <div class="animate-infos">
        <div class="infos-text">
          <p v-text="textInfos" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import WheelControls from '~/js/slider-plugin/wheel.js'
import useStickers from '~~/stores/stickers'
import { useMouseInElement } from '@vueuse/core'
import RAFManager from '~~/webgl/Utils/RAFManager';
import { clampedMap } from '~~/webgl/Utils/Math';
import { lerp } from '~~/webgl/Utils/Lerp';

const textInfos = ref()
const base = ref()
const isInfosVisible = ref(false)

let y = 0;
let lerpY = 0

const stickers = useStickers()

const [container, slider] = useKeenSlider({
	loop: true,
	mode: "snap",
	rtl: false,
	slides: {
        perView: 6,
		spacing: 10
	},
	vertical: true,
	detailsChanged: (s) => {
		const slides = s.track.details.slides;
		s.slides.forEach((_element, idx) => {
			const slide = slides[idx]
			const slideEl = s.slides[idx]

			// wallah ca fonctionne, demander à Valentin
			const op = 1 - ((Math.abs(slide.distance / 0.84 - 0.5)) - 0.34) * 6.25
      if(op <= 0.01) {
        slideEl.classList.add('not-visible')
      } else if(op !== 0 && slideEl.classList.contains('not-visible')) {
        slideEl.classList.remove('not-visible')
      }
			slideEl.style.opacity = op
		});
	},
}, [WheelControls])

const infosContent = {
  boss: {
    textLocked: "Débloque-le en gagnant tous les stickers",
    textUnlocked: "Le boss des boss, tu as gagné tous les stickers!"
  },
  wingsuit: {
    top: {
      textLocked: "Débloque-le en réussissant toutes les actions du wingsuit",
      textUnlocked: "3/3 de réussite sur le wingsuit"
    },
    mid: {
      textLocked: "Débloque-le en réussissant 2 actions du wingsuit",
      textUnlocked: "2/3 de réussite sur le wingsuit"
    },
    bot: {
      textLocked: "Locked",
      textUnlocked: "1/3 de réussite sur le wingsuit"
    }
  },
  ski: {
    top: {
      textLocked: "Débloque-le en réussissant toutes les actions du freeride",
      textUnlocked: "3/3 de réussite sur le freeride"
    },
    mid: {
      textLocked: "Débloque-le en réussissant 2 interactions du freeride",
      textUnlocked: "2/3 de réussite sur le freeride"
    },
    bot: {
      textLocked: "Locked",
      textUnlocked: "1/3 de réussite sur le freeride"
    }
  },
  kayak: {
    top: {
      textLocked: "Débloque-le en réussissant toutes les actions du kayak",
      textUnlocked: "3/3 de réussite sur le kayak"
    },
    mid: {
      textLocked: "Débloque-le en réussissant 2 interactions du kayak",
      textUnlocked: "2/3 de réussite sur le kayak"
    },
    bot: {
      textLocked: "Locked",
      textUnlocked: "1/3 de réussite sur le kayak"
    }
  }
}

function showInfos(e) {

  const sport = e.target.dataset.sport
  const level = e.target.dataset.level
  let index;

  switch (e.target.dataset.level) {
    case "top":
      index = 1
      break;

    case "mid":
      index = 2
      break;

    case "bot":
      index = 3
      break;
  }

  if (sport !== "boss" && stickers.state[sport].includes(index)) {
    textInfos.value = infosContent[sport][level].textUnlocked
  } else if(sport !== "boss" && !stickers.state[sport].includes(index)) {
    textInfos.value = infosContent[sport][level].textLocked
  }

  if(sport === 'boss' && stickers.state.like_a_boss) {
    textInfos.value = infosContent[sport].textUnlocked
  } else if(sport === 'boss' && !stickers.state.like_a_boss) {
    textInfos.value = infosContent[sport].textLocked
  }


  if(!e.target.classList.contains('not-visible')) {
    startHover()
    isInfosVisible.value = true
  }
}

function hideInfos() {
  isInfosVisible.value = false
  removeHover()
}

function startHover() {
    const {
      elementY,
      elementHeight
	  } = useMouseInElement(base.value);

    const element = base.value.querySelector('.stickers-infos');


    RAFManager.add('stickers-infos', () => {
      update(elementY, elementHeight, element)
    })
  }

  function removeHover() {
		RAFManager.remove('stickers-infos')
	}

  function update( elY, elH, element) {

    y = clampedMap(elY.value, 0, elH.value, 0, elY.value);

    lerpY = lerp(lerpY, y, .1)

    element.style.transform = `translateY(${lerpY}px)`;

  }
</script>

<style lang="scss">
.rewards-slider {
  position: absolute;
  top: 50%;
  left: 0px;
  padding-left: 40px;
  transform: translate3d(-100%, -50%, 0);

  height: 100vh;
  width: 180px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  background: linear-gradient(90deg, #ffffffdd, #ffffff00);

  animation: appear 1s ease-out forwards;

  @keyframes appear {

    0%,
    50% {
      opacity: 0;
      transform: translate3d(-100%, -50%, 0);
    }

    100% {
      opacity: 1;
      transform: translate3d(0, -50%, 0);
    }
  }

  &,
  * {
    pointer-events: initial;
  }

  &__slider {
    display: flex;
    width: 100%;
    height: 75vh;

    margin-top: -12.5vh;
    margin-bottom: -12.5vh;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;

      filter: drop-shadow(0px 0px 4px #00000042);
    }

    // hide
    .keen-slider__slide {
      position: relative;
      overflow: initial;

      &.is-hide {
        &::before {
          content: '';
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          height: 36px;
          width: 36px;
          transform: translate3d(-50%, -50%, 0);

          background-image: url('/stickers/lock.png');
          background-position: center center;
          background-repeat: no-repeat;
          background-size: contain;

          opacity: 0.8;
        }

        img {
          filter: brightness(10%);
          opacity: 0.8;
        }
      }
    }
  }

  &__button {
    position: relative;
    z-index: 1;

    cursor: pointer;

    border: none;
    background: transparent;

    transition: all 0.3s ease(ease_out-cubic);

    &:hover {
      opacity: 0.5;
      transform: scale(0.97);
    }

    &:active {
      transform: scale(0.75);
    }
  }
}

.stickers-infos {
  position: absolute;
  right: -100%;
  top: 20%;
  z-index: 3;
}

.animate-infos {
  .is-visible & {
    animation: softBounceOut .5s linear 1 forwards;
  }
}

.infos-text {
  background-color: #EFF3F5;
  padding: .5rem 1rem;
  width: 15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: rotate(10deg) scale(.25);
  transition: transform .5s ease(out-bounce), opacity .4s ease(out-swift);

  .is-visible & {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }

  p {

    text-align: center;
    font-family: const(font-gotham);
    font-weight: 400;
    color: colors(black);
    font-size: 1.3rem;
  }
}
</style>
