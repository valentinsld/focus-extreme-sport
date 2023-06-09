const DegToRad = deg => {
	return (deg * Math.PI) / 180
}

const normalizeValue = (value, min, max) => {
	return (value - min) / (max - min);
}

const clamp = (value, min = 0, max = 1) => {
	return Math.min(Math.max(value, min), max);
}

export {DegToRad, normalizeValue, clamp}
