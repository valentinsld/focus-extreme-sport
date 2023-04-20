import debounce from '@/webgl/Utils/Debounce'
import useStore from '@/stores/index.js'

class NoEventKeyboard {
	constructor({ delay = 6000 }) {
		this.delay = delay
		this.store = useStore()

		this.debounceNoEvent = debounce(this.noEvent, this.delay, false, this)
	}

	action() {
		this.store.state.noEventPlayer = false

		this.debounceNoEvent()
	}

	noEvent() {
		this.store.state.noEventPlayer = true

		// TODO add event Fredo qui parle à la radio
	}
}

export default NoEventKeyboard;
