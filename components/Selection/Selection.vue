<template>
  <Transition
    name="selection"
    :duration="{ enter: 1200, leave: 1000 }"
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
          @mouseover="handleHover(i, true)"
          @mouseleave="handleHover(null, false)"
          @click="selectPackage"
        >
          <div
            class="package-container"
            :class="[
              { 'is-hidden': hoverIndex !== i && isHovered},
            ]"
          >
            <div class="package-content">
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
                <div class="background-perso" />
              </div>
              <div
                class="title"
                v-text="items[i - 1].title"
              />
              <div class="pictos">
                <div
                  v-for="j in 3"
                  :key="j"
                  class="picto"
                />
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

const store = useStore()

const items = [
	{
		title:"fluidité - équilibre",
		word1: "fluidite",
		word2: "equilibre",
		indicator: "w1"
	},
	{
		title:"vitesse - précision",
		word1: "vitesse",
		word2: "precision",
		indicator: " w2"
	},
	{
		title: "controle - coordination",
		word1: "controle",
		word2: "coordination",
		indicator: "w3"
	},
]

const packages = ref()
const hoverIndex = ref(null);
const isHovered = ref(false)

function handleHover(index, state) {
	hoverIndex.value = index;
	isHovered.value = state
}

function selectPackage() {
  store.state.gamestate = 'intro'
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
	width: 100%;
}

.package {
	cursor: pointer;
	max-width: 30%;
}

.package-container {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: column nowrap;
	transition: transform .5s ease(out-swift), opacity .5s ease(out-swift);

	@include hover() {
		transform: scale(1.2);
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

.background-perso {
	width: 80%;
	height: 80%;
	background-color: red;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
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
	.title {
		&::after {
			background-color: colors(f_pink);
		}
	}
}

.package-2 {
	.title {
		&::after {
			background-color: colors(f_green);
		}
	}
}

.package-3 {
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

.picto {
	width: 25%;
	aspect-ratio: 1 / 1;
	background-color: grey;
	border-radius: 50%;
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

			.background-perso {
				transform: translate(-50%, -50%);
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

			.picto {
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

			.background-perso {
				transform: translate(-50%, 50%);
				opacity: 0;
			}

			.title {
				transform: translateY(4rem);
				opacity: 0;

				&::after {
					transform: translateX(-50%) scaleX(0);
				}
			}

			.picto {
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
