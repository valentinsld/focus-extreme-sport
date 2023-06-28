import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

function getStickersValue(score) {
	const arr = []
	if (score > 90) {
		arr.push(1)
	}
	if (score > 50) {
		arr.push(2)
	}
	if (score > 0) {
		arr.push(3)
	}

	return arr
}

const useStickers = defineStore('stickers', () => {
	const state = reactive(
		useStorage('stickers', {
			wingsuit: [],
			ski: [],
			kayak: [],
			like_a_boss: false,
		})
	)

	const isEmpty = computed(() => {
		return state.value.wingsuit.length === 0 && state.value.ski.length === 0 && state.value.kayak.length === 0 && !state.value.like_a_boss
	})

	//
	// calculate stickers
	//
	function calculateNewStickers(wingsuit, ski, kayak) {
		const stickerWingsuit = getStickersValue(wingsuit)
		const stickerSki = getStickersValue(ski)
		const stickerKayak = getStickersValue(kayak)

		if (!state.value.wingsuit.includes(stickerWingsuit)) {
			state.value.wingsuit.push(...stickerWingsuit)
		}
		if (!state.value.ski.includes(stickerSki)) {
			state.value.ski.push(...stickerSki)
		}
		if (!state.value.kayak.includes(stickerKayak)) {
			state.value.kayak.push(...stickerKayak)
		}

		if (state.value.wingsuit.length === 3 && state.value.ski.length === 3 && state.value.kayak.length === 3) {
			state.value.like_a_boss = true
		}

		return {
			wingsuit: stickerWingsuit[0],
			ski: stickerSki[0],
			kayak: stickerKayak[0],
			like_a_boss: state.value.like_a_boss,
		}
	}

	return {
		state,
		isEmpty,
		calculateNewStickers
	}
})

export default useStickers
