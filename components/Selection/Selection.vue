<template>
  <section class="page page-selection">
    <div
      class="packages"
    >
      <div
        v-for="i in 3"
        :key="i"
        ref="packages"
        class="package"
        :class="[
          { 'is-hidden': hoverIndex !== i && isHovered}
        ]"
        @mouseover="handleHover(i, true)"
        @mouseleave="handleHover(null, false)"
        @click="selectPackage"
      >
        <div class="package-content">
          <div class="background" />
          <div
            class="title"
            v-text="titles[i - 1]"
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
  </section>
</template>

<script setup>
import useStore from '@/stores/index.js'

const store = useStore()

const titles = [
	"fluidité - équilibre",
	"vitesse - précision",
	"controle - coordination"
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
.packages {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
}

.package {
	// event hover
	pointer-events: initial !important;

	max-width: 30%;
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
	min-width: var(--test-size);
	min-height: var(--test-size);
	background-color: #fff;
	border-radius: 20px;
}

.title {
	text-align: center;
	text-transform: uppercase;
}

.pictos {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}

.picto {
	width: 25%;
	aspect-ratio: 1 / 1;
	background-color: grey;
	border-radius: 50%;
}
</style>
