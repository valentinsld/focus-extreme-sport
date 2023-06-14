<template>
  <Transition name="qte-figures">
    <div
      ref="key"
      class="key"
      :class="[props.validKey]"
    >
      <div class="key-container">
        <svg
          ref="border"
          viewBox="0 0 244 244"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="border"
        >
          <path
            d="M234.302 121.835A195.58 195.58 0 0 0 121.84 234.297 195.58 195.58 0 0 0 9.378 121.835 195.58 195.58 0 0 0 121.84 9.373a195.58 195.58 0 0 0 112.462 112.462Z"
            stroke="#fff"
            stroke-width="6"
          />
        </svg>
        <svg
          viewBox="0 0 243 243"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="background"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M.862 121.835a192.017 192.017 0 0 1 120.976 120.976 192.018 192.018 0 0 1 120.976-120.976A192.017 192.017 0 0 1 121.838.859 192.018 192.018 0 0 1 .862 121.835Zm86.676 24.33V116.94l31.876-25.3 31.875 25.3v29.225l-31.875-25.3-31.876 25.3Z"
            fill="#fff"
          />
        </svg>
        <div class="ripples">
          <svg
            v-for="i in 2"
            :key="i"
            viewBox="0 0 243 243"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="['ripple-' + i]"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M.862 121.835a192.017 192.017 0 0 1 120.976 120.976 192.018 192.018 0 0 1 120.976-120.976A192.017 192.017 0 0 1 121.838.859 192.018 192.018 0 0 1 .862 121.835Zm86.676 24.33V116.94l31.876-25.3 31.875 25.3v29.225l-31.875-25.3-31.876 25.3Z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>

const key = ref()
const border = ref()

const props = defineProps({
	validKey: {
		type: String,
		default: 'ArrowRight'
	},
	keyboardKey: {
		type: String,
		default: ''
	},
	duration: {
		type: Number,
		default: 1000
	},
	delay: {
		type: Number,
		default: 1000
	}
})

onMounted(()=> {
	key.value.style.setProperty('--duration', `${props.duration}ms`)

	setTimeout(()=> {
		enableClick()
	}, (props.duration * .65) + props.delay)

	// border.value.addEventListener('transitionend', enableClick)
})

onUnmounted(()=> {
	if(border.value) border.value.removeEventListener('transitionend', enableClick)
})

function enableClick() {
	emit('isClickable', )
}

const emit = defineEmits(['isClickable'])

</script>

<style lang="scss" scoped>
.key {
	// background-color: #fff;
	color: colors(black);
	z-index: 1;
	margin: 20px;
	position: relative;
	opacity: 0;
	transition: opacity .3s ease-in-out;
	filter: drop-shadow(0px 0px 25px rgba(colors(black), 0.6)) drop-shadow(0px 0px 5px rgba(colors(black), 0.1));

	&.is-animated {
		opacity: .5;

		.border {
			transform: scale(0.9);
		}
	}

	&.is-clickable {
		opacity: 1;

	}

	&.is-right {
		.background {
			path {
				fill: colors(f_green);

				.game-ski & {
					fill: colors(f_pink);
				}
			}
		}

		@for $i from 1 through 3 {
			.ripple-#{$i} {
				animation-play-state: running;

				path {
					fill: rgba(colors(f_green), calc(100% / #{$i}));

					.game-ski & {
						fill: rgba(colors(f_pink), calc(100% / #{$i}));
					}
				}
			}
		}
	}

	&.is-wrong {
		.background {
			path {
				fill: red;
			}
		}

		@for $i from 1 through 3 {
			.ripple-#{$i} {
				animation-play-state: running;

				path {
					fill: rgba(red, calc(100% / #{$i}));
				}
			}
		}
	}
}

.key-container {
	width: 60px;
	height: 60px;
	display: block;
	position: relative;

	.ArrowRight & {
		transform: rotate(90deg);
	}

	.ArrowLeft & {
		transform: rotate(-90deg);
	}

	.ArrowDown & {
		transform: rotate(180deg);
	}
}

.border {
	position: absolute;
	display: block;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: -1;
	transform: scale(2);
	transition: transform var(--duration);

	path {
		stroke: colors(f_green);

		.game-ski & {
			stroke: colors(f_pink);
		}
	}
}

.ripples {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: -1;
	display: flex;
	align-items: center;
	justify-content: center;
}

@for $i from 1 through 3 {
	.ripple-#{$i} {
		display: block;
		width: 100%;
		height: 100%;
		position: absolute;

		animation: GrowthRipple .5s ease(out-swift) 1;
		animation-delay: calc(10ms + (#{$i} * 50ms));
		animation-play-state: paused;
	}
}

.background {
	position: absolute;
	display: block;
	width: 100%;
	height: 100%;

	path {
		transition: fill .3s ease(out-swift);
	}
}
</style>
