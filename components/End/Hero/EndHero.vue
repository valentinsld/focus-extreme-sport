<template>
  <div>
    <div
      v-for="(el, i) in data.list"
      :key="'hero'+i"
    >
      <h2>{{ el.letter }}</h2>

      <figure>
        <blockquote>{{ el.quote }}</blockquote>
        <figcaption>
          <p>{{ el.author }}</p>
          <p>{{ el.role }}</p>
        </figcaption>
      </figure>

      <img :src="el.image">
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
