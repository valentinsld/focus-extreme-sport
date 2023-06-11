<template>
  <div>
    <h2>{{ data.title }}</h2>

    <div>
      <div
        v-for="(el, index) in data.types"
        :key="'sports'+index"
      >
        <h3>{{ el.name }}</h3>

        <p>
          <a
            v-for="(e, i) in el.list"
            :key="index+'sports'+i"
            :href="e.url"
            target="_blank"
          >
            {{ e.name }}
          </a>
        </p>
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
