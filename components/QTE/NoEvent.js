import debounce from '@/webgl/Utils/Debounce'
import useStore from '@/stores/index.js'

class NoEventKeyboard {
	constructor({ delay = 6000 }) {
		this.delay = delay
		this.store = useStore()

		this.debounceNoEvent = debounce(this.noEvent, this.delay, false, this)

		this.isDestroyed = false
	}

	action() {
		this.store.state.noEventPlayer = false

		this.debounceNoEvent()
	}

	noEvent() {
		if (this.isDestroyed) return
		this.store.state.noEventPlayer = true

		// TODO add event Fredo qui parle à la radio
	}

	destroy() {
		this.isDestroyed = true
		this.store.state.noEventPlayer = false
	}
}

export default NoEventKeyboard;
