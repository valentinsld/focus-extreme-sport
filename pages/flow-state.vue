<template>
  <div class="page-flow">
    <!-- <img src="/end.png"> -->

    <EndHero :data="content.hero" />
    <EndDefinition :data="content.definition" />
    <EndMap :data="content.map" />
    <EndAthletes :data="content.athletes" />
    <EndSports :data="content.sports" />
    <EndFilms :data="content.films" />
    <EndEvents :data="content.events" />
    <EndThansk :data="content.thanks" />
    <EndFooter />
  </div>
</template>

<script setup>
import content from '~~/content/flow-state.json'
import SceneManager from '~~/webgl/Managers/SceneManager'

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
  overflow-y: scroll;

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
