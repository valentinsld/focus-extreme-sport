<template>
  <div>
    <h2>{{ data.title }}</h2>

    <div>
      <div
        v-for="(el, index) in data.list"
        :key="'tank'+index"
      >
        <img :src="el.image">
        <h3>{{ el.name }}</h3>

        <div>
          <a
            v-for="(l, i) in el.socials"
            :key="index+'socials'+i"
            :href="l.link"
            target="_blank"
          >
            {{ l.type }}
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
