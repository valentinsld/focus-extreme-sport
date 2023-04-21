import { defineStore } from 'pinia'

import webglStore from '~~/webgl/Utils/Store'

const useStore = defineStore('store', () => {
	const state = reactive(
		{
			gamestate: 'home',
			gamestatestep: 0,
		}
	)

	watch(() => state.gamestate, (gamestate) => {
		webglStore.state = gamestate
	})

	//
	//
	//
	return {
		state
	}
})

export default useStore
