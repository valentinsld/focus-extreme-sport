<template>
  <div
    class="tuto"
    :class="{'is-visible': store.state.isTutoVisible}"
  >
    <div class="keyboard">
      <div class="top">
        <div class="top-key key-arrow key-4">
          <svg
            viewBox="0 0 202 202"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M201.182.657A225.8 225.8 0 0 1-.001.657 225.8 225.8 0 0 1 0 201.84a225.797 225.797 0 0 1 201.183 0 225.796 225.796 0 0 1 0-201.183ZM72.986 64.19h34.366l29.75 37.482-29.75 37.483H72.986l29.75-37.483-29.75-37.482Z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
      <div class="bottom">
        <div
          v-for="i in 3"
          :key="i"
          :class="['key-' + i]"
          class="key-arrow"
        >
          <svg
            viewBox="0 0 202 202"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M201.182.657A225.8 225.8 0 0 1-.001.657 225.8 225.8 0 0 1 0 201.84a225.797 225.797 0 0 1 201.183 0 225.796 225.796 0 0 1 0-201.183ZM72.986 64.19h34.366l29.75 37.482-29.75 37.483H72.986l29.75-37.483-29.75-37.482Z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
    </div>
    <p class="text">
      Lance-toi et utilise les flèches du clavier !
    </p>
  </div>
</template>

<script setup>
import useStore from '~/stores'

const store = useStore()
</script>

<style lang="scss" scoped>
.tuto {
	position: absolute;
	z-index: 3;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	bottom: 4rem;
	left: 50%;
	transform: translateX(-50%);
	pointer-events: none;
	opacity: 0;
	transition: opacity .5s ease(out-swift);

	&.is-visible {
		opacity: 1;
	}
}

.keyboard {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.key-arrow {
	width: 3rem;
	margin: .2rem .5rem;

	svg {
		width: 100%;
	}
}

.top-key {
	transform: scale(.1) rotate(45deg);
	opacity: 0;
	transition: transform .8s ease(out-bounce), opacity .8s ease(out-swift);
	transition-delay: 100ms;

	.is-visible & {
		transform: none;
		opacity: 1;
	}

	svg {
		transform: rotate(-90deg);
	}
}

.bottom {
	display: flex;
	align-items: center;
	justify-content: center;
}

@for $i from 1 through 3 {
	.key-#{$i} {
		transform: scale(.1) rotate(45deg);
		opacity: 0;
		transition: transform .8s ease(out-bounce), opacity .8s ease(out-swift);
		transition-delay: calc(100ms + (#{$i} * 75ms));

		.is-visible & {
			transform: none;
			opacity: 1;
		}
	}
}


.key-1 {
	svg {
		transform: rotate(180deg);
	}
}

.key-2 {
	svg {
		transform: rotate(90deg);
	}
}

.text {
	font-family: const(font-gotham);
	font-size: 1.8rem;
	margin-top: 1rem;
	transform: translateY(4rem);
	opacity: 0;
	transition: transform .5 ease(out-swift), opacity .5s ease(out-swift);
	transition-delay: 500ms;

	.is-visible & {
		transform: none;
		opacity: 1;
	}
}

@for $i from 1 through 4 {
	.key-#{$i} {
		animation: tutoTouche 1.5s linear infinite;
		animation-delay: calc(800ms + (#{$i} * 200ms));
	}
}
</style>
