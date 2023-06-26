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
      <EndAthletes
        ref="athletes"
        :data="content.athletes"
      />
      <EndSports
        ref="sport"
        :data="content.sports"
      />
      <EndFilms
        ref="movie"
        :data="content.films"
      />
      <EndEvents
        ref="events"
        :data="content.events"
      />
      <EndThansk
        ref="thanks"
        :data="content.thanks"
      />
      <EndFooter />
    </div>
  </div>
</template>

<script setup>
import EndHeader from '~~/components/Header/EndHeader.vue'
import content from '~~/content/flow-state.json'
import SceneManager from '~~/webgl/Managers/SceneManager'
import RAFManager from '~~/webgl/Utils/RAFManager'
import { useIntersectObserver } from '~~/webgl/Utils/useIntersectObserver'

import Lenis from '@studio-freight/lenis'

const hero = ref()
const definition = ref()
const map = ref()
const athletes = ref()
const sport = ref()
const movie = ref()
const events = ref()
const thanks = ref()
const scrollWrapper = ref()
const scrollContainer = ref()

const observerList = [
  hero,
  definition,
  athletes,
  movie,
  events,
  sport,
  thanks
]

useIntersectObserver({
		ref: observerList,
		margin: '0px',
		threshold: 0.2,
	});

  const lenis = new Lenis()

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
      destination = athletes.value.$el
      break;

    case 'sport':
      destination = sport.value.$el
      break;

    case 'event':
      destination = events.value.$el
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
