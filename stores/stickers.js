import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

function getStickersValue(score) {
	if (score > 90) {
		return 1
	} else if (score > 50) {
		return 2
	} else {
		return 3
	}
}

const useStickers = defineStore('stickers', () => {
	const state = reactive(
	  useLocalStorage('stickers', {
		wingsuit: [],
		ski: [],
		kayak: [],
		like_a_boss: false,
	  })
	)

	//
	// calculate stickers
	//
	function calculateNewStickers(wingsuit, ski, kayak) {
		const stickerWingsuit = getStickersValue(wingsuit)
		const stickerSki = getStickersValue(ski)
		const stickerKayak = getStickersValue(kayak)

		if (!state.value.wingsuit.includes(stickerWingsuit)) {
			state.value.wingsuit.push(stickerWingsuit)
		}
		if (!state.value.ski.includes(stickerSki)) {
			state.value.ski.push(stickerSki)
		}
		if (!state.value.kayak.includes(stickerKayak)) {
			state.value.kayak.push(stickerKayak)
		}

		if (state.value.wingsuit.length === 3 && state.value.ski.length === 3 && state.value.kayak.length === 3) {
			state.value.like_a_boss = true
		}

		return {
			wingsuit: stickerWingsuit,
			ski: stickerSki,
			kayak: stickerKayak,
			like_a_boss: state.value.like_a_boss,
		}
	}

	return {
		state,
		calculateNewStickers
	}
})

export default useStickers
