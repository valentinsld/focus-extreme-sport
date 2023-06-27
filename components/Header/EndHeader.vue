<template>
  <header
    ref="header"
    class="header"
  >
    <NuxtLink
      to="/"
      class="page-link"
    >
      <svg
        viewBox="0 0 31 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.727 30.462A23.518 23.518 0 0 0 .91 15.645 23.518 23.518 0 0 0 15.727.828a23.518 23.518 0 0 0 14.817 14.817 23.518 23.518 0 0 0-14.817 14.817Z"
        />
      </svg>
      <span>
        home
      </span>
    </NuxtLink>

    <div class="background" />
    <nav class="nav">
      <button
        class="link"
        @click="emitAnchor('flow')"
      >
        <span>Le flow</span>
      </button>

      <div class="separator" />

      <button
        class="link"
        @click="emitAnchor('map')"
      >
        <span>Parcours</span>
      </button>

      <div class="separator" />

      <button
        class="link"
        @click="emitAnchor('athletes')"
      >
        <span>Athlètes</span>
      </button>

      <div class="separator" />

      <button
        class="link"
        @click="emitAnchor('sport')"
      >
        <span>Sports</span>
      </button>

      <div class="separator" />

      <button
        class="link"
        @click="emitAnchor('event')"
      >
        <span>Évènement</span>
      </button>
    </nav>


    <NuxtLink
      to="/stickers-rewards"
      class="page-link"
    >
      <svg
        viewBox="0 0 39 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m4.724 25.914.488 2.1a2.772 2.772 0 0 0 2.328 2.118l12.104 1.641L20.9 36.95c.05.207.236.353.449.353h3.212a.462.462 0 0 0 .45-.566l-1.595-6.86c2.481-1.717 3.158-6.547 3.186-8.748 1.9-2.607 6.794-4.448 10.492-5.386.46-.117.498-.814.09-1.057a4.287 4.287 0 0 1-1.06-.9C34.194 10.317 32.073 1.22 21.74.827 8.664.333 2.628 6.605 1.287 11.391c-1.073 3.829.447 10.617 1.341 13.533l2.096.99Z"
        />
      </svg>
      <span>
        stickers
      </span>
    </NuxtLink>
  </header>
</template>

<script setup>

const header = ref()

function emitAnchor(anchor) {
  emit('anchor', anchor)
}

onMounted(()=> {
  setTimeout(() => {
      header.value.classList.add('is-observed')
    }, 500)
})

const emit = defineEmits(['anchor'])

</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
  width: 100vw;
  z-index: 4;
  opacity: 0;
  transition: opacity .5s ease(out-swift);

  &.is-observed {
    opacity: 1;
  }
}

.background {
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(180deg, rgba(#D8E3ED, 1) 15.60%, rgba(255, 255, 255, 0.00) 80%);
  z-index: -1;
  pointer-events: none;
}

.nav {
  position: fixed;
  z-index: 4;
  display: flex;
  align-items: center;
  left: 50%;
  transform: translateX(-50%);


}

.separator {
  width: 1rem;
  height: 3px;
  background-color: colors(black);
  margin: 0 1rem;
}

.link {
  font-family: const(font-akira);
  font-weight: 700;
  font-size: 1.2rem;
  background-color: transparent;
  border: none;
  cursor: pointer;

  span {
    position: relative;
    display: block;
    color: colors(black);

    &::after {
      content: "";
      position: absolute;
      display: block;
      width: 100%;
      height: 3px;
      bottom: -2px;
      left: 0;
      background-color: colors(f_pink);
      transform: scaleX(0);
      transform-origin: center right;
      transition: transform 0.3s ease-in-out;
      will-change: transform;
    }
  }

  &:hover {
    span {
      &::after {
        transform: scaleX(1);
        transform-origin: center left;
      }
    }
  }
}

.page-link {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &:hover {
    svg {
      fill: rgba(colors(black), 1);
    }
  }

  svg {
    width: 3rem;
    stroke-width: 1px;
    stroke: colors(black);
    fill: rgba(colors(black), 0);
    transition: fill .3s ease(out-swift);
  }

  span {
    text-transform: uppercase;
    font-family: const(font-akira);
    font-weight: 900;
    font-size: 1.3rem;
    margin-top: 1rem;
    color: colors(black);
  }
}
</style>
