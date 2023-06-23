<template>
  <div class="thanks">
    <h2 class="thanks-title">
      {{ data.title }}
    </h2>

    <div class="thanks-wrapper">
      <div
        v-for="(el, index) in data.list"
        :key="'tank'+index"
        class="thanks-list"
        :class="[
          'thanks-' + index
        ]"
      >
        <img
          class="thanks-picture"
          :src="el.image"
          draggable="false"
        >
        <h3 class="thanks-name">
          {{ el.name }}
        </h3>

        <div class="thanks-socials">
          <a
            v-for="(l, i) in el.socials"
            :key="index+'socials'+i"
            :href="l.link"
            target="_blank"
            class="thanks-link"
            :class="['link-' + i]"
          >
            {{ l.link }}
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
.thanks {
  width: 100%;
  max-width: 980px;
  margin: 6.5rem auto;
}

.thanks-title {
  font-family: const(font-tusker);
  font-weight: 400;
  color: colors(black);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-size: 5rem;
  margin-bottom: 3rem;
}

.thanks-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row wrap;
}

.thanks-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
}

.thanks-picture {
  width: 10rem;
  filter: grayscale(100%);
}

.thanks-name {
  font-family: const(font-akira);
  font-weight: 900;
  font-size: 1.4rem;
  color: colors(black);
  text-transform: uppercase;
  margin-top: 1rem;
}

.thanks-social {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 1.5rem;
}
</style>
