<template>
  <Transition
    name="home"
    :duration="{ enter: 600, leave: 1000 }"
    appear
  >
    <section
      v-if="store.state.gamestate === 'home' && store.state.ressourcesLoaded"
      class="page-home page"
    >
      <div class="title">
        <img
          src="/logo.png"
          class="logo"
        >
        <p class="catch-line">
          à la poursuite de l’état de flow
        </p>
        <div class="sticker-container">
          <img
            src="/STICKERS_HOLO.png"
            class="sticker"
          >
        </div>
        <svg
          viewBox="0 0 184 184"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="home-separator"
        >
          <path
            d="M183.142 91.57a145.346 145.346 0 0 0-91.57 91.572A145.347 145.347 0 0 0 0 91.57 145.347 145.347 0 0 0 91.571 0a145.347 145.347 0 0 0 91.571 91.57Z"
            fill="#000000"
          />
        </svg>
      </div>
      <div class="start">
        <p class="start-text">
          Pour une expérience optimale, munis-toi d’un casque
        </p>
        <button
          class="btn-start"
          :class="{'is-visible': store.state.ressourcesLoaded}"
          @click="startProject"
        >
          <span class="btn-text">commencer</span>
        </button>
        <!-- TODO : supprimer ça avant la prez c'est juste du debug dev -->
        <p
          v-if="!store.state.ressourcesLoaded"
          class="load-text"
          :class="{'is-visible': !store.state.ressourcesLoaded}"
          style="font-style: italic;"
        >
          Données en cours de chargement, veuillez patienter...
        </p>
        <!-- ça -->
      </div>
    </section>
  </Transition>
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
  position: absolute;

  .logo {
    width: 80%;
    max-width: 900px;
  }

  .sticker-container {
    position: absolute;
    width: 9rem;
    right: 5rem;
    bottom: 1rem;
  }

  .sticker {
    width: 100%;
    filter: drop-shadow(0px 0px 5px rgba(colors(black), .5));
    animation: RollingSticker 20s linear forwards infinite;
  }
}

.catch-line {
  font-size: 1.5em;
  text-transform: uppercase;
  font-family: const(font-gotham);
  letter-spacing: .3rem;
}

.home-separator {
  width: 1rem;
  position: absolute;
  bottom: -50%;
  display: none;
}

.start {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
  position: absolute;
  bottom: 4rem;

  &-text {
    font-family: const(font-gotham);
    font-weight: 400;
    opacity: .3;
    letter-spacing: .1rem;
    margin-bottom: 1rem;
    font-size: 1.8rem;
  }
}

.btn-start {
  position: relative;
  border: none;
  background-color: transparent;
  pointer-events: all;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 0;
  transition: opacity .3s ease(out-swift);

  &.is-visible {
    opacity: 1;
  }

  &:hover {
    .btn-text {
      &::after {
        transform: scaleX(1);
      }
    }
  }

}

.load-text {
  position: absolute;
  transform: translateY(2rem);
  opacity: 0;
  transition: opacity .3s ease(out-swift);

  &.is-visible {
    opacity: 1;
  }
}

.btn-text {
  display: block;
  position: relative;
  font-family: const(font-akira);
  font-weight: 900;
  font-size: 2.5rem;

  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 1px;
    background-color: colors(black);
    bottom: -5%;
    transform-origin: center center;
    transform: scaleX(0);
    transition: transform .35s ease(out-swift);

  }
}

.home-enter-active {
  transition: opacity 500ms cubic-bezier(0.55, 0, 0.1, 1);
}

.home-enter-from {
  opacity: 0;
}


.home-leave-active {

  .btn-start,
  .start-text,
  .catch-line,
  .sticker-container,
  .logo {
    transition: transform .5s ease(out-swift), opacity .4s ease(out-swift);
    opacity: 1;
  }

  .start-text {
    transition-delay: 100ms;
  }

  .catch-line {
    transition-delay: 175ms;
  }

  .sticker-container,
  .logo {
    transition-delay: 250ms;
  }
}

.home-leave-to {

  .btn-start,
  .start-text,
  .catch-line,
  {
  transform: translateY(4rem);
  opacity: 0;

  &::after {
    transform: scaleX(1);
  }
}

.sticker-container,
.logo {
  transform: translateY(4rem) scale(.9);
  opacity: 0;
}

}
</style>
