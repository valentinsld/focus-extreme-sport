import { defineStore } from 'pinia'

const useStore = defineStore('store', () => {
	const state = reactive(
		{
			ressourcesLoaded: false,
			gamestate: 'wingsuit',
			gamestatestep: 0,
			noEventPlayer: false,
			altimetre: {
				scores: {
					wingsuit: 0,
					ski: 0,
					kayak: 0,
				},
				altitude: 4000,
			},
			isIntroFinished: false,
		}
	)

	//
	//
	//
	return {
		state
	}
})

export default useStore
