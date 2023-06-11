<template>
  <div>
    <h2>{{ data.title }}</h2>

    <div>
      <div
        v-for="(el, index) in data.list"
        :key="'athletes'+index"
        :class="`is-${el.color}`"
      >
        <img :src="el.image">
        <h3>{{ el.name }}</h3>
        <p>{{ el.aptitude }}</p>
        <p>{{ el.type }}</p>
        <p>{{ el.country }}</p>
        <p>{{ el.achieved }}</p>

        <p>
          <span
            v-for="(d, i) in el.capacities"
            :key="index+'capacities'+i"
          >
            {{ d }}
          </span>
        </p>

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
