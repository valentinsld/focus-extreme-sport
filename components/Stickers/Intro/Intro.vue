<template>
  <div>
    Zone de photo

    <button @click="close">
      Suivant
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])

function close() {
	emit('close')
}

</script>
