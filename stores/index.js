import { defineStore } from 'pinia'

const useStore = defineStore('store', () => {
	const state = reactive(
		{
			virtualScrollY: 0,
			lastRoute: '',
			ressourcesLoaded: false,
			gamestate: 'home',
			gamestatestep: 0,
			noEventPlayer: false,
			isTransitioning: false,
			isAudioMuted: false,
			isOverlayVisible: false,
			isTutoVisible: false,
			isCountdownPlaying: false,
			altimetre: {
				scores: {
					wingsuit: 0,
					ski: 0,
					kayak: 0,
				},
				translate: {
					wingsuit: 0,
					ski: 0,
					kayak: 0,
				},
				altitude: 4000,
			},
			sucess: {
				wingsuit: false,
				ski: false,
				kayak: false,
			},
		}
	)

	function resetScores() {
		state.altimetre.scores.wingsuit = 0
		state.altimetre.scores.ski = 0
		state.altimetre.scores.kayak = 0
	}

	//
	//
	//
	return {
		state,
		resetScores
	}
})

export default useStore
