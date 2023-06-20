<template>
  <div class="rewards-slider">
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
      <div class="keen-slider__slide">
        <img
          src="/stickers/like_a_boss.png"
        >
      </div>
      <div class="keen-slider__slide">
        <img
          src="/stickers/1-wingsuit.png"
        >
      </div>
      <div class="keen-slider__slide">
        <img
          src="/stickers/2-wingsuit.png"
        >
      </div>
      <div class="keen-slider__slide">
        <img
          src="/stickers/3-wingsuit.png"
        >
      </div>
      <div class="keen-slider__slide">
        <img
          src="/stickers/1-ski.png"
        >
      </div>
      <div class="keen-slider__slide">
        <img
          src="/stickers/2-ski.png"
        >
      </div>
      <div class="keen-slider__slide">
        <img
          src="/stickers/3-ski.png"
        >
      </div>
      <div class="keen-slider__slide">
        <img
          src="/stickers/1-kayak.png"
        >
      </div>
      <div class="keen-slider__slide">
        <img
          src="/stickers/2-kayak.png"
        >
      </div>
      <div class="keen-slider__slide">
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
  </div>
</template>

<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import WheelControls from '~/js/slider-plugin/wheel.js'


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
			slideEl.style.opacity = op
		});
	},
}, [WheelControls])
</script>

<style lang="scss">
.rewards-slider {
	position: absolute;
	z-index: 10;
	top: 50%;
	left: 0px;
	padding-left: 40px;
	transform: translate3d(0, -50%, 0);

	height: 100vh;
	width: 180px;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;

	background: linear-gradient(90deg, #ffffffdd, #ffffff00);

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
</style>
