import { lerp } from './Lerp';

const DegToRad = deg => {
	return (deg * Math.PI) / 180
}

const normalizeValue = (value, min, max) => {
	return (value - min) / (max - min);
}

const clamp = (value, min = 0, max = 1) => {
	return Math.min(Math.max(value, min), max);
}

export function damp(a, b, smoothing, dt) {
	return lerp(a, b, 1 - Math.exp(-smoothing * 0.05 * dt));
}

function clampedMap(value, start1, stop1, start2, stop2) {
	const v = start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
	return Math.max(start2, Math.min(stop2, v));
}

export {DegToRad, normalizeValue, clamp, clampedMap}
