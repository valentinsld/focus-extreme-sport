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
        @stop-scroll="stopLenis"
        @start-scroll="startLenis"
      />
      <EndSports
        ref="sport"
        :data="content.sports"
        :sticker-translate="stickerSportT"
      />
      <EndFilms
        ref="movie"
        :data="content.films"
        @stop-scroll="stopLenis"
        @start-scroll="startLenis"
      />
      <EndEvents
        ref="events"
        :data="content.events"
        :cloud-translate="cloudEventT"
        @stop-scroll="stopLenis"
        @start-scroll="startLenis"
      />
      <EndThansk
        ref="thanks"
        :data="content.thanks"
        :cloud-translate="cloudThanksT"
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
import WebGL from '~~/webgl'

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

const stickerSportT = ref(0);

const cloudEventT = ref(0);

const cloudThanksT = ref(0);

let cloudFParallax = null;
let stickerFParallax = null;

let cloudMParallax = null;
let stickerMParallax = null;

let stickerSParallax = null;

let cloudEParallax = null;

let cloudTParallax = null;

const observerList = [
  hero,
  definition,
  map,
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

  if (stickerSParallax) {
    stickerSParallax.setTranslate(e.animatedScroll);
    stickerSportT.value = stickerSParallax.translate.value;
  }

  if (cloudEParallax) {
    cloudEParallax.setTranslate(e.animatedScroll);
    cloudEventT.value = cloudEParallax.translate.value;
  }

  if (cloudTParallax) {
    cloudTParallax.setTranslate(e.animatedScroll);
    cloudThanksT.value = cloudTParallax.translate.value;
  }
})


onMounted(() => {
	initWebGL()

  RAFManager.add('lenis',(currentTime) => {
    lenis.raf(currentTime * 1000)
  })

  const images = scrollContainer.value.querySelectorAll('img')
  for (let i = 0; i < images.length; i++) {
    const element = images[i];

    element.addEventListener('load', () => {
      lenis.resize()
    })
  }

  cloudFParallax = useParallax({
    section: definition.value.$el,
    page: scrollWrapper.value,
    start: -75,
    end: 75
  });
  stickerFParallax = useParallax({
    section: definition.value.$el,
    page: scrollWrapper.value,
    start: -100,
    end: 100
  });

  cloudMParallax = useParallax({
    section: map.value.$el,
    page: scrollWrapper.value,
    start: -50,
    end: 40
  });
  stickerMParallax = useParallax({
    section: map.value.$el,
    page: scrollWrapper.value,
    start: -150,
    end: 40
  });

  stickerSParallax = useParallax({
    section: sport.value.$el,
    page: scrollWrapper.value,
    start: 0,
    end: 100
  });

  cloudEParallax = useParallax({
    section: events.value.$el,
    page: scrollWrapper.value,
    start: -40,
    end: 40
  });

  cloudTParallax = useParallax({
    section: thanks.value.$el,
    page: scrollWrapper.value,
    start: -40,
    end: 40
  });

  cloudFParallax.getParallaxValues();
  stickerFParallax.getParallaxValues();

  cloudMParallax.getParallaxValues();
  stickerMParallax.getParallaxValues();

  stickerSParallax.getParallaxValues();

  cloudEParallax.getParallaxValues();

  cloudTParallax.getParallaxValues();
})

onUnmounted(() => {
  RAFManager.remove('lenis')
  lenis.destroy()
})


function initWebGL () {
  const webgl = new WebGL()
  if (webgl.ressourcesReady) {
      setScene()
  } else {
    webgl.on('endLoading', () => {
      requestAnimationFrame(setScene)
    })
  }
}
function setScene () {
  const sceneManager = new SceneManager()

  sceneManager.setScene('stickers', 0, (scene) => {
    scene.setSceneForEnd()
  })
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

function stopLenis() {
  lenis.stop()
}
function startLenis() {
  lenis.start()
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
