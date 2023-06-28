<template>
  <Transition
    name="selection"
    :duration="{ enter: 1600, leave: 1000 }"
  >
    <section
      v-if="store.state.gamestate === 'selection'"
      class="page page-selection"
    >
      <div
        class="packages"
      >
        <div
          v-for="i in 3"
          :key="i"
          ref="packages"
          class="package"
          :class="[
            'package-'+ i
          ]"
          @click="selectPackage(items[i-1].isAvaialable)"
        >
          <div
            class="package-container"
            :class="[
              (items[i-1].isAvaialable ? 'is-available' : 'not-available')
            ]"
          >
            <div class="package-content">
              <div class="background-container">
                <div class="background">
                  <div
                    v-for="j in 3"
                    :key="j"
                    class="texts"
                    :class="[items[i - 1].indicator]"
                  >
                    <p class="word1">
                      {{ items[i -1].word1 }}
                    </p>
                    <p class="word2">
                      {{ items[i -1].word2 }}
                    </p>
                  </div>
                </div>
                <img
                  class="background-perso"
                  :class="['perso-' + i]"
                  :src="items[i -1].image"
                >
              </div>
              <div
                class="title"
                v-text="items[i - 1].title"
              />
              <div class="pictos">
                <div
                  v-for="j in 3"
                  :key="j"
                >
                  <component :is=" items[i - 1].pictos[j - 1]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Transition>
</template>

<script setup>
import useStore from '@/stores/index.js'

import Surf from '../Common/Icons/SurfIco.vue';
import SpeedRiding from '../Common/Icons/SpeedRidingIco.vue';
import Wingsuit from '../Common/Icons/WingsuitIco.vue';
import HighlineIco from '../Common/Icons/HighlineIco.vue';
import SkiIco from '../Common/Icons/SkiIco.vue';
import KayakIco from '../Common/Icons/KayakIco.vue';
import EscaladeIco from '../Common/Icons/EscaladeIco.vue';
import ParachuteIco from '../Common/Icons/ParachuteIco.vue';
import GymkhanaIco from '../Common/Icons/GymkhanaIco.vue';

const store = useStore()

const items = [
	{
		title:"fluidité - équilibre",
		word1: "fluidite",
		word2: "equilibre",
		indicator: "w1",
		pictos : [
			HighlineIco,
			Surf,
			SpeedRiding,
		],
		image: '/selection/coming-soon-1.png',
		isAvaialable: false,
	},
	{
		title:"vitesse - précision",
		word1: "vitesse",
		word2: "precision",
		indicator: " w2",
		pictos : [
			Wingsuit,
			SkiIco,
			KayakIco,
		],
		image: '/selection/perso.png',
		isAvaialable: true,
	},
	{
		title: "controle - coordination",
		word1: "controle",
		word2: "coordination",
		indicator: "w3",
		pictos : [
			EscaladeIco,
			ParachuteIco,
			GymkhanaIco,
		],
		image: '/selection/coming-soon-2.png',
		isAvaialable: false,
	},
]

const packages = ref()

function selectPackage(value) {
	if (!value) return
	store.state.gamestate = 'phrase'
}
</script>

<style lang="scss" scoped>
.page-selection {
	z-index: 2;

}

.packages {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	width: 90%;
}

.package {
	max-width: 30%;
}

.package-container {
	cursor: pointer;

	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: column nowrap;
	transition: transform .5s ease(out-swift), opacity .5s ease(out-swift);

	@include hover() {
		transform: scale(1.2);

		:deep(.sport-text) {
			opacity: 1;
		}

	}

	&.not-available {
		cursor: not-allowed;
		opacity: .3;

		@include hover() {
			transform: scale(1) !important;
		}
	}

	&.is-hidden {
		opacity: 0.3;
	}
}

.background {
	width: 25rem;
	height: 37rem;
	overflow: hidden;
	position: relative;
}

.background-container {
	position: relative;
}

.background-perso {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 120%;
	// height: 100%;
	transform: translate(-50%, -50%);

	object-fit: contain;

	&.perso-3 {
		width: 135%;
		transform: translate(-60%, -62%);
	}
}

.texts {
	font-family: const(font-tusker);
	text-transform: uppercase;

}

.w1 {
	.word1 {
		font-weight: 700;
		font-size: 7.2rem;
		line-height: 112%;
		letter-spacing: 0.1rem;
	}

	.word2 {
		font-weight: 700;
		font-size: 6.2rem;
		line-height: 112%;
	}
}

.w2 {
	.word1 {
		font-weight: 700;
		font-size: 7.6rem;
		line-height: 112%;
		letter-spacing: 0.1rem;
	}

	.word2 {
		font-weight: 600;
		font-size: 6.4rem;
		line-height: 98%;
		letter-spacing: 0.1rem;
	}
}

.w3 {
	.word1 {
		font-weight: 600;
		font-size: 7.1rem;
		line-height: 112%;
	}

	.word2 {
		font-weight: 400;
		font-size: 6.4rem;
		line-height: 110%;
		letter-spacing: 0.05rem;
	}
}

.title {
	position: relative;
	text-align: center;
	text-transform: uppercase;
	font-size: 1.1rem;
	font-style: italic;
	font-family: const(font-gotham);
	margin-top: 2rem;

	&::after {
		position: absolute;
		display: block;
		content: "";
		width: 8rem;
		height: .2rem;
		bottom: -.7rem;
		left: 50%;
		transform: translateX(-50%);
	}
}

.package-1 {

	.package-container {
		&:hover {
			:deep(.picto) {
				path {
					fill: colors(f_pink);
					stroke: colors(f_pink);
				}
			}
		}
	}

	.title {
		&::after {
			background-color: colors(f_pink);
		}
	}
}

.package-2 {
	.package-container {
		&:hover {
			:deep(.picto) {
				path {
					fill: colors(f_green);
					stroke: colors(f_green);
				}
			}
		}
	}

	.title {
		&::after {
			background-color: colors(f_green);
		}
	}
}

.package-3 {
	.package-container {
		&:hover {
			:deep(.picto) {
				path {
					fill: colors(f_purple);
					stroke: colors(f_purple);
				}
			}
		}
	}

	.title {
		&::after {
			background-color: colors(f_purple);
		}
	}
}

.pictos {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-top: 3rem;
}

.selection-enter-active {
	.page-selection {
		pointer-events: all;
	}

	@for $i from 1 through 3 {
		.package-#{$i} {

			.texts {
				transform: none;
				opacity: 1;
				transition: transform .5s ease(out-swift), opacity .4s ease(out-swift);
				transition-delay: calc(100ms + (#{$i} * 75ms));
			}

			.perso-1,
			.perso-2 {
				transform: translate(-50%, -50%);
				opacity: 1;
				transition: transform .8s ease(out-bounce), opacity .8s ease(out-swift);
				transition-delay: calc(250ms + (#{$i} * 75ms));
			}

			.perso-3 {
				transform: translate(-60%, -62%);
				opacity: 1;
				transition: transform .8s ease(out-bounce), opacity .8s ease(out-swift);
				transition-delay: calc(250ms + (#{$i} * 75ms));

			}

			.title {
				transform: none;
				opacity: 1;
				transition: transform .5s ease(out-swift), opacity .4s ease(out-swift);
				transition-delay: calc(450ms + (#{$i} * 75ms));

				&::after {
					transform: translateX(-50%) scaleX(1);
					transition: transform .5s ease(out-swift), opacity .4s ease(out-swift);
					transition-delay: calc(550ms + (#{$i} * 75ms));
				}
			}

			:deep(.icon) {
				transform: scale(1);
				opacity: 1;
				transition: transform .8s ease(out-bounce), opacity .4s ease(out-swift);
				transition-delay: calc(650ms + (#{$i} * 100ms));
			}
		}
	}
}

.selection-leave-active {
	@for $i from 1 through 3 {
		.package-#{$i} {
			transition: transform .5s ease(out-swift), opacity .4s ease(out-swift);
			transition-delay: calc(100ms + (#{$i} * 75ms));
		}
	}
}

.selection-enter-from {
	@for $i from 1 through 3 {
		.package-#{$i} {

			.texts {
				transform: translateY(4rem);
				opacity: 0;
			}

			.perso-1,
			.perso-2 {
				transform: translate(-50%, 50%);
				opacity: 0;
			}

			.perso-3 {
				transform: translate(-60%, 62%);
				opacity: 0;
			}

			.title {
				transform: translateY(4rem);
				opacity: 0;

				&::after {
					transform: translateX(-50%) scaleX(0);
				}
			}

			:deep(.icon) {
				transform: scale(0);
				opacity: 0;
			}
		}
	}
}

.selection-leave-to {
	@for $i from 1 through 3 {
		.package-#{$i} {
			transform: translateY(4rem);
			opacity: 0;
		}
	}

}
</style>
