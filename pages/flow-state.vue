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
        :cloud-translate="cloudFlowT"
        :sticker-translate="stickerFlowT"
      />
      <EndMap
        ref="map"
        :data="content.map"
        :cloud-translate="cloudMapT"
        :sticker-translate="stickerMapT"
      />
      <EndAthletes
        ref="athletes"
        :data="content.athletes"
        :cloud-translate="cloudAthT"
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
import { useParallax } from '~~/webgl/Utils/useParallax'
import useStore from '~~/stores'

const store = useStore()

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

const cloudFlowT = ref(0);
const stickerFlowT = ref(0);

const cloudMapT = ref(0);
const stickerMapT = ref(0);

const cloudAthT = ref(0);

let cloudFParallax = null;
let stickerFParallax = null;

let cloudMParallax = null;
let stickerMParallax = null;

let cloudAParallax = null;

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

  lenis.on('scroll', (e) => {
    if (cloudFParallax) {
			cloudFParallax.setTranslate(e.animatedScroll);
			cloudFlowT.value = cloudFParallax.translate.value;
		}
    if (stickerFParallax) {
			stickerFParallax.setTranslate(e.animatedScroll);
			stickerFlowT.value = stickerFParallax.translate.value;
		}

    if (cloudMParallax) {
			cloudMParallax.setTranslate(e.animatedScroll);
			cloudMapT.value = cloudMParallax.translate.value;
		}
    if (stickerMParallax) {
			stickerMParallax.setTranslate(e.animatedScroll);
			stickerMapT.value = stickerMParallax.translate.value;
		}

    if (cloudAParallax) {
			cloudAParallax.setTranslate(e.animatedScroll);
			cloudAthT.value = cloudAParallax.translate.value;
      console.log(cloudAthT.value);
		}
  })


onMounted(() => {
	setScene()


  RAFManager.add('lenis',(currentTime, dt) => {
    lenis.raf(currentTime * 1000)
  })

  cloudFParallax = useParallax({
    section: definition.value.$el,
    page: scrollWrapper.value,
    start: -30,
    end: 20
  });
  stickerFParallax = useParallax({
    section: definition.value.$el,
    page: scrollWrapper.value,
    start: -40,
    end: 40
  });

  cloudMParallax = useParallax({
    section: map.value.$el,
    page: scrollWrapper.value,
    start: -30,
    end: 20
  });
  stickerMParallax = useParallax({
    section: map.value.$el,
    page: scrollWrapper.value,
    start: -40,
    end: 40
  });

  cloudAParallax = useParallax({
    section: athletes.value.$el,
    page: scrollWrapper.value,
    start: -30,
    end: 20
  });

  cloudFParallax.getParallaxValues();
  stickerFParallax.getParallaxValues();

  cloudMParallax.getParallaxValues();
  stickerMParallax.getParallaxValues();

  cloudAParallax.getParallaxValues();
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
  overflow-x: hidden;
  font-size: 2rem;
}
</style>
