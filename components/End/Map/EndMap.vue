<template>
  <div class="end-map">
    <img
      class="map"
      :src="data.background"
    >

    <div
      class="zoning wingsuit"
      @mouseover="handleHover(0, true)"
      @mouseleave="handleHover(null, false)"
    >
      <svg
        viewBox="0 0 77 138"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="wingsuit-place"
      >
        <path
          d="M41.013 95.852c16.8 21.995 25.812 40.293 33.667 41.607 8.6-5.187-13.359-33.115-13.359-33.115s-12.31-31.98-20.306-36.742C22.524 56.588 10.969 1.752 2.469.102c-6.8-1.318 3.22 25.016-.002 20.109C.884 40.957 20.012 68.359 41.013 95.852Z"
        />
      </svg>
      <p class="text">
        <span class="dot" />
        <span class="content">
          wingsuit
        </span>
      </p>
    </div>

    <div
      class="zoning ski"
      @mouseover="handleHover(1, true)"
      @mouseleave="handleHover(null, false)"
    >
      <svg
        viewBox="0 0 58 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="ski-place"
      >
        <path
          d="M24.982 74.493C38.273 95.607 42.86 113.4 52.58 114.347c13.234-5.558-4.46-32.339-4.46-32.339s-4.645-34.634-5.29-43.214c-1.136-15.121-3.218-29.9-13.65-31.15-8.344-1-22.57-1.914-24.849-6.65C-5.84 21.712 8.368 48.1 24.982 74.493Z"
        />
      </svg>
      <p class="text">
        <span class="dot" />
        <span class="content">
          freeride
        </span>
      </p>
    </div>

    <div
      class="zoning kayak"
      @mouseover="handleHover(2, true)"
      @mouseleave="handleHover(null, false)"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="kayak-place"
      >
        <path
          d="M52.796 73.19c20.289 14.52 34.931 28.699 44.288 25.899 10.15-10.15-16.356-28.251-16.356-28.251s-24.09-25.284-27.932-32.983C46.026 24.287 32.043 5.073 21.914 7.86 13.81 10.091 3.984 3.605.084.083c-1.583 23.026 27.351 54.956 52.712 73.106Z"
        />
      </svg>
      <p class="text">
        <span class="dot" />
        <span class="content">
          Kayak
        </span>
      </p>
    </div>

    <div
      v-for="(el, index) in data.list"
      :key="'map'+index"
      ref="sports"
      class="sport-wrapper"
      :class="['sport-'+index]"
    >
      <div class="sport-content">
        <h2 class="sport-title">
          {{ el.title }}
        </h2>

        <figure class="sport-infos">
          <blockquote class="sport-quote">
            {{ el.quote }}
          </blockquote>
          <figcaption class="author-infos">
            <p class="author">
              {{ el.author }}
            </p>
            <p class="role">
              {{ el.role }}
            </p>
          </figcaption>
        </figure>

        <div class="stats">
          <div
            v-for="(d, i) in el.datas"
            :key="index+'map'+i"
            :class="['stat', 'stat-'+i]"
          >
            <h3 class="stat-title">
              {{ d.value }}
            </h3>
            <p class="stat-info">
              {{ d.info }}
            </p>
          </div>
        </div>
      </div>

      <img
        class="sport-picture"
        :src="el.image"
      >
    </div>
  </div>
</template>

<script setup>
  defineProps({
	  data: {
		  type: Object,
		  required: true
	  }
  })

  const hoverIndex = ref(null);
  const isHovered = ref(false)

  const sports = ref()

  function handleHover(index, state) {
    hoverIndex.value = index;
    isHovered.value = state

    if (isHovered.value) {
      startHover(index)
    } else {
      removeHover()
    }
}

function startHover(index) {
  sports.value[index].classList.add('is-hovered')
}

function removeHover() {
  sports.value.forEach(el => {
    el.classList.remove('is-hovered')
  })
}

</script>

<style lang="scss" scoped>
.end-map {
  position: relative;
  width: 90vw;
}

.map {
  width: 100%;
}

.sport-wrapper {
  top: 0;
  position: absolute;
  display: flex;
  align-items: center;
}

.sport-wrapper {
  opacity: 0;

  &.is-hovered {
    opacity: 1;
  }
}

.sport-content {
  max-width: 300px;
}

.sport-title {
  position: relative;
  font-family: const(font-akira);
  font-weight: 900;
  color: colors(black);
  text-transform: uppercase;
  font-size: 2.9rem;
  padding: 0 .5rem;
  width: fit-content;

  &::after {
    content: "";
    background-color: colors(f_green);
    width: 100%;
    height: 100%;
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.sport-quote {
  font-family: const(font-gotham);
  font-size: 1.7rem;
  font-weight: 400;
  font-style: italic;
  color: colors(black);
  margin-top: 1.5rem;
  line-height: 110%;
  letter-spacing: .35px;
}

.author-infos {
  margin-top: 1.5rem;
}


.author {
  font-family: const(font-akira);
  text-transform: uppercase;
  font-weight: 900;
  font-size: 1.3rem;
  color: colors(black);
}

.role {
  font-family: const(font-gotham);
  font-weight: 400;
  font-size: 1.3rem;
  color: colors(black);
}

.stats {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid colors(black);
  display: flex;
  align-items: center;
  width: 85%;

}

.stat {
  margin-right: 1rem;
}

.stat-title {
  font-family: const(font-tusker);
  font-weight: 700;
  color: colors(black);
  font-size: 1.4rem;
}

.stat-info {
  font-size: .8rem;
  font-family: const(font-gotham);
  font-weight: 400;
  text-transform: uppercase;
  color: colors(black);
}

.zoning {
  position: absolute;
  z-index: 2;
  cursor: pointer;

  &:hover {
    .text {

      .dot {
        background-color: colors(f_green);
      }

      .content {
        &::after {
          transform: scaleX(1);
          transform-origin: center left;
        }
      }
    }

    svg {
      fill: colors(f_green);
    }
  }

  .text {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    top: -20%;
    right: -150%;
    font-family: const(font-akira);
    font-weight: 900;
    font-size: 2rem;
    text-transform: uppercase;
    color: colors(black);


    .content {
      position: relative;
      padding: 0 .5rem;
      mix-blend-mode: difference;

      &::after {
        content: "";
        position: absolute;
        z-index: -1;
        display: block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: colors(f_green);
        transform-origin: center right;
        transform: scaleX(0);
        transition: transform .3s ease(out-swift);
        will-change: transform;
      }
    }

    .dot {
      display: block;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background-color: colors(black);
      margin-right: 1rem;
      transition: background-color .3s ease(out-swift);
    }
  }

  svg {
    transition: fill .3s ease(out-swift);
  }
}

.wingsuit {
  top: 11.75%;
  left: 57.75%;
}

.wingsuit-place {
  width: 7rem;
  fill: colors(black);
  opacity: .7;
}

.ski {
  top: 37.5%;
  left: 65%;

  .text {
    right: -200%;
  }
}

.ski-place {
  width: 6rem;
  fill: colors(black);
  opacity: .7;
}

.kayak-place {
  width: 10rem;
  fill: colors(black);
  opacity: .7;
}

.kayak {
  top: 62%;
  left: 72%;

  .text {
    right: -40%;
  }
}
</style>
