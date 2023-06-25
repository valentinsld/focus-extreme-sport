<template>
  <div
    ref="scrollWrapper"
    class="page-flow"
  >
    <div
      ref="scrollContainer"
      class="scroll-container"
    >
      <EndHeader @anchor="scrollTo" />

      <EndHero
        ref="hero"
        :data="content.hero"
      />
      <EndDefinition
        ref="definition"
        :data="content.definition"
      />
      <EndMap
        ref="map"
        :data="content.map"
      />
      <!-- <EndAthletes :data="content.athletes" /> -->
      <EndSports
        ref="sport"
        :data="content.sports"
      />
      <!-- <EndFilms :data="content.films" /> -->
      <!-- <EndEvents :data="content.events" /> -->
      <EndThansk
        ref="thanks"
        :data="content.thanks"
      />
      <EndFooter />
    </div>
    <!-- <img src="/end.png"> -->
  </div>
</template>

<script setup>
import EndHeader from '~~/components/Header/EndHeader.vue'
import content from '~~/content/flow-state.json'
import SceneManager from '~~/webgl/Managers/SceneManager'
import { useIntersectObserver } from '~~/webgl/Utils/useIntersectObserver'
import Lenis from '@studio-freight/lenis'
import RAFManager from '~~/webgl/Utils/RAFManager'

const hero = ref()
const definition = ref()
const map = ref()
const sport = ref()
const thanks = ref()
const scrollWrapper = ref()
const scrollContainer = ref()

const observerList = [
  hero,
  definition,
  sport,
  thanks
]

let time = 0

useIntersectObserver({
		ref: observerList,
		margin: '0px',
		threshold: 0.2,
	});

  const lenis = new Lenis()

  console.log(lenis);

onMounted(() => {
	setScene()

  RAFManager.add('lenis',(currentTime, dt) => {
    lenis.raf(currentTime * 1000)
  })
})

function setScene () {
  const sceneManager = new SceneManager()

  sceneManager.setScene('stickers', 0)
}

function scrollTo (anchor) {
  let destination;

  switch (anchor) {
    case 'flow':
      destination = hero.value.$el
      break;

    case 'map':
      destination = map.value.$el
      break;

    case 'athletes':
      destination = map.value.$el
      break;

    case 'sport':
      destination = sport.value.$el
      break;

    case 'event':
      destination = sport.value.$el
      break;
  }
  lenis.scrollTo(destination)
}
</script>

<style lang="scss">
.page-flow {
  position: relative;
  z-index: 1;

  // height: 100vh;
  overflow-x: hidden;
  // overflow-y: scroll;
  // scroll-behavior: smooth;

  // display: flex;
  // flex-direction: column;

  font-size: 2rem;

  // img {
  // 	// TODO remove these line
  // 	max-height: 100px;
  // }

  * {}
}
</style>
