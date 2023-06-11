<template>
  <div>
    <img :src="data.background">

    <div
      v-for="(el, index) in data.list"
      :key="'map'+index"
    >
      <h2>{{ el.title }}</h2>

      <figure>
        <blockquote>{{ el.quote }}</blockquote>
        <figcaption>
          <p>{{ el.author }}</p>
          <p>{{ el.role }}</p>
        </figcaption>
      </figure>

      <div>
        <div
          v-for="(d, i) in el.datas"
          :key="index+'map'+i"
        >
          <h3>{{ d.value }}</h3>
          <p>{{ d.info }}</p>
        </div>
      </div>

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
