<template>
  <!-- <h1>
    Home  {{ store.state.gamestatestep }}
  </h1> -->
  <section class="page-home page">
    <div class="title">
      <h1>Focus</h1>
      <p>A la poursuite de l’Etat de flow</p>
    </div>
    <div class="start">
      <p>Pour une expérience optimale, muni-toi d’un casque</p>
      <button
        class="btn-start"
        @click="startProject"
      >
        <span>commencer</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import useStore from '@/stores/index.js'
import SceneManager from '~~/webgl/Managers/SceneManager';

const store = useStore()

onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('home')
})

function startProject() {
  store.state.gamestate = 'selection'
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;

  h1 {
    color: red;
    text-transform: uppercase;
  }
}

.start {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
  position: absolute;
  bottom: 2%;
}
</style>
