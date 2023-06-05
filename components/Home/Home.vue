<template>
  <!-- <h1>
    Home  {{ store.state.gamestatestep }}
  </h1> -->
  <section class="page-home page">
    <div class="title">
      <img src="/logo.png">
      <p>A la poursuite de l’Etat de flow</p>
    </div>
    <div class="start">
      <p>Pour une expérience optimale, munis-toi d’un casque</p>
      <button
        v-if="store.state.ressourcesLoaded"
        class="btn-start"
        @click="startProject"
      >
        <span>commencer</span>
      </button>
      <p
        v-else
        style="font-style: italic;"
      >
        Données en cours de chargement, veuillez patienter...
      </p>
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
.page-home {
  color: colors(black);
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;

  img {
    width: 60%;
    max-width: 800px;
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
