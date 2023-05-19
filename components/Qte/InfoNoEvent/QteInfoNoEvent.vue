<template>
  <div
    :class="{
      'no-event': true,
      hidden: !hidden,
    }"
  >
    No event
  </div>
</template>

<script setup>
defineProps({
  hidden: {
	type: Boolean,
	default: false,
  },
})
</script>

<style lang="scss" scoped>
.no-event {
	position: absolute;
	right: 20px;
	bottom: 20px;

	padding: 20px;
	background-color: red;
	border-radius: 20px;

	&.hidden {
		display: none;
	}
}
</style>
