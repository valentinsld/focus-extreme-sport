<template>
  <div
    class="page-flow"
  >
    <!-- <img src="/end.png"> -->
    <EndHeader />

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
</template>

<script setup>
import EndHeader from '~~/components/Header/EndHeader.vue'
import content from '~~/content/flow-state.json'
import SceneManager from '~~/webgl/Managers/SceneManager'
import { useIntersectObserver } from '~~/webgl/Utils/useIntersectObserver'

const hero = ref()
const definition = ref()
const map = ref()
const sport = ref()
const thanks = ref()

const observerList = [
  hero,
  definition,
  sport,
  thanks
]

useIntersectObserver({
		ref: observerList,
		margin: '0px',
		threshold: 0.2,
	});

onMounted(() => {
	setScene()
})

function setScene () {
  const sceneManager = new SceneManager()

  sceneManager.setScene('stickers', 0)
}

</script>

<style lang="scss">
.page-flow {
  position: relative;
  z-index: 1;

  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;

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
