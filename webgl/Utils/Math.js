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

export {DegToRad, normalizeValue, clamp}
