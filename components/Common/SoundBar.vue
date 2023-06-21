<template>
  <button
    class="button-sound"
    @click.prevent="toggleSound"
  >
    <span class="bar-wrapper">
      <span
        v-for="bar in 5"
        :key="bar"
        ref="soundBars"
        :class="['sound-bar', `bar-${bar}`]"
      />
    </span>
  </button>
</template>

<script setup>
import useStore from '@/stores/index.js'
import { lerp } from '~~/webgl/Utils/Lerp';
import RAFManager from '~~/webgl/Utils/RAFManager';
import { onBeforeUnmount, onMounted, ref} from 'vue';
import AudioManager from '~~/webgl/Managers/AudioManager';
let AUDIO = null

const soundBars = ref();
const randomOffset = [];

const store = useStore()

const animeProgress = ref(0);
let offset;

onMounted(() => {
	AUDIO = new AudioManager()

	// Offset each bar randomly at start
	for (let i = 0; i < soundBars.value.length; i++) {
		randomOffset.push(Math.random() + 1 * 10);
	}

	RAFManager.add('SoundBar', (currentTime) => {
		update(currentTime)
	})
});

onBeforeUnmount(() => {
	soundBars.value.length = 0;
	RAFManager.remove('SoundBar');
});

function update(dt) {
	// Animate each bar
	for (let i = 0; i < soundBars.value.length; i++) {
		const bar = soundBars.value[ i ];
		const off = randomOffset[ i ];
		animeProgress.value = lerp(animeProgress.value, store.state.isAudioMuted ? 0 : 1, 0.01);
		offset = (Math.sin(dt * (0.7 + off * 0.6) + off * 30) + 1);
		bar.style.transform = `scaleY(${ 0.7 + (offset * animeProgress.value) })`;
	}
}

function toggleSound() {
	store.state.isAudioMuted = !store.state.isAudioMuted

	AUDIO.toggleSound(store.state.isAudioMuted)
}
</script>

<style lang="scss" scoped>
.button-sound {
	position: absolute;
	z-index: 3;
	bottom: 4rem;
	right: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 2rem;
	border: none;
	background-color: transparent;
	pointer-events: all;
	cursor: pointer;

	&:hover {
		.sound-bar {
			opacity: 1;
		}
	}
}

.sound-bar {
	display: inline-block;
	width: 2px;
	height: 1rem;
	margin: 0 1px;
	vertical-align: middle;
	background-color: colors(white);
	opacity: .5;
	transition: 0.5s opacity ease(in-out-smooth);
	transform: scaleY(0.5);
	border-radius: 1px;
	transform-origin: center center;
	will-change: transform, opacity;
}
</style>
