<template>
  <div class="sport">
    <h2 class="sport-title">
      {{ data.title }}
    </h2>

    <div class="sport-wrapper">
      <div
        v-for="(el, index) in data.types"
        :key="'sports'+index"
        class="sport-list"
        :class="[
          'sport-' + index
        ]"
      >
        <h3
          class="sport-category"
          :class="[el.name]"
        >
          <span>
            {{ el.name }}
          </span>
        </h3>

        <div class="link-wrapper">
          <a
            v-for="(e, i) in el.list"
            :key="index+'sports'+i"
            :href="e.url"
            target="_blank"
            class="sport-link"
            :class="['link-' + i]"
          >
            <span class="sport-link-text">
              {{ e.name }}
            </span>
          </a>
        </div>
      </div>
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
  </script>

<style lang="scss" scoped>
.sport {
  width: 100%;
  max-width: 980px;
  margin: 6.5rem auto;
}

.sport-title {
  font-family: const(font-tusker);
  font-weight: 400;
  color: colors(black);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-size: 5rem;
  margin-bottom: 3rem;
}

.sport-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;
}

.sport-list {
  position: relative;
  width: 48%;
  // max-width: 48%;
  padding: 3rem;
  margin: 1.5rem 0;
  border-left: 1px solid colors(black);
  border-right: 1px solid colors(black);
  border-top: 1px solid colors(black);
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.sport-category {

  padding: 0 .8rem;
  position: relative;
  width: fit-content;
  margin-bottom: 2rem;

  span {
    font-family: const(font-akira);
    font-weight: 700;
    color: colors(black);
    text-transform: uppercase;
    font-size: 3rem;
  }

  &.Eau {
    &::after {
      background-color: colors(f_purple);
    }
  }

  &.Neige {
    &::after {
      background-color: colors(f_pink);
    }
  }

  &.Terre {
    &::after {
      background-color: colors(f_blue);
    }
  }

  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: colors(f_green);


  }
}

.link-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  flex-flow: row wrap;
}

.sport-link {
  position: relative;
  overflow: hidden;
  padding: .5rem 1rem;
  border: 1px solid colors(black);
  margin: .5rem 1rem .2rem 0;
  border-radius: 2rem;

  span {
    font-family: const(font-gotham);
    font-weight: 400;
    text-transform: lowercase;
    font-size: 2rem;
    color: colors(black);
    transition: color .3s ease(out-swift);
  }

  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    z-index: -1;
    background-color: colors(black);
    transform: translate(-50%, 110%) scale(2);
    transition: transform .5s ease(out-swift);
  }

  &:hover {
    span {
      color: colors(white);
    }

    &::after {
      transform: translate(-50%, -85%) scale(2);
    }
  }
}
</style>
