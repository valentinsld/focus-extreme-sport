import { defineStore } from 'pinia'


const useStore = defineStore('store', () => {
	const state = reactive(
		{
			gamestate: 'home',
			gamestatestep: 0,
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
