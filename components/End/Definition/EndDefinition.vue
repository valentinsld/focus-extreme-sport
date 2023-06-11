<template>
  <div>
    <div>
      <h2>{{ data.title }}</h2>
      <!-- Salut Léo, fait bien un max-width de 700px, comme j'ai démandé à Margaux -->
      <p>{{ data.content }}</p>
    </div>

    <div>
      <div
        v-for="(el, i) in data.words"
        :key="'word'+i"
      >
        <h3>{{ el.word }}</h3>
        <img :src="el.image">
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
