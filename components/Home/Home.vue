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
import WebGL from '~~/webgl/index.js';
import SceneManager from '~~/webgl/Managers/SceneManager';
import AudioManager from '~~/webgl/Managers/AudioManager';

const store = useStore()

onMounted(()=> {
  const sceneManager = new SceneManager()
  sceneManager.setScene('home')

  //
  // TODO remove it on main
  //
  const init = () => {
    const audioManager = new AudioManager()
    audioManager.play('damso', true)

    setTimeout(() => {
      audioManager.stop('damso')
    }, 10000);

    const modif = {
      frequency: 1,
    }

    const WEBGL = new WebGL()
    if (WEBGL.debug) {
      WEBGL.debug.addInput(modif, 'frequency', { min: 0, max: 1, step: 0.01 }).on('change', (e) => {
        audioManager.setFrequencyLowPass(e.value)
      })
    }

    window.removeEventListener('click', init)
  }

  window.addEventListener('click', init)
  // TODO end remove
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
