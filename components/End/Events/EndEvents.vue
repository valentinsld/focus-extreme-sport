<template>
  <div>
    <h2>{{ data.title }}</h2>

    <div>
      <a
        v-for="(el, index) in data.list"
        :key="'event'+index"
        :href="el.url"
        target="_blank"
      >
        <img :src="el.image">
        <p>{{ el.date }}</p>
      </a>
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