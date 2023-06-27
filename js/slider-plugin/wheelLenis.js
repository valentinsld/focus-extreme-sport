const WheelControls = (slider, emit, emitStop = 'stop-scroll', emitStart = 'start-scroll') => {
	let touchTimeout
	let position
	let wheelActive

	function dispatch(e, name) {
		position.x -= e.deltaX
		position.y -= e.deltaY
		slider.container.dispatchEvent(
				new CustomEvent(name, {
				detail: {
					x: position.x,
					y: position.y,
				},
			})
		)
	}

	function wheelStart(e) {
		if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
			emit(emitStop)
		}
		position = {
			x: e.pageX,
			y: e.pageY,
		}
		dispatch(e, "ksDragStart")
	}

	function wheel(e) {
		dispatch(e, "ksDrag")
	}

	function wheelEnd(e) {
		emit(emitStart)
		dispatch(e, "ksDragEnd")
	}

	function eventWheel(e) {
		e.preventDefault()
		if (!wheelActive) {
			wheelStart(e)
			wheelActive = true
		}
		if (wheelActive && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
			wheel(e)
		}
		clearTimeout(touchTimeout)
		touchTimeout = setTimeout(() => {
			wheelActive = false
			wheelEnd(e)
		}, 50)
	}

	slider.on("created", () => {
		slider.container.addEventListener("wheel", eventWheel, {
			passive: false,
		})
	})
}

export default WheelControls
