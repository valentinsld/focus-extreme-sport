import Pz from 'pizzicato'
import anime from 'animejs'

import WebGL from '../index'
import RAFManager from '../Utils/RAFManager'

const START_LOWPASS = 100
const END_LOWPASS = 3500

export default class AudioManager {
	static singleton

	constructor() {
		if (AudioManager.singleton) {
			return AudioManager.singleton
		  }
		AudioManager.singleton = this

		this.webgl = new WebGL()
		this.listSounds = this.webgl.assets.sounds
		this.sounds = {}

		this.effetcs = {}
		this.initEffects()

		this.initRAF()
	}

	//
	// EFFETCS
	//
	initEffects() {
		this.effetcs.lowPassFilter = new Pz.Effects.LowPassFilter({
			frequency: END_LOWPASS,
			peak: 10
		});
	}
	setFrequencyLowPass(value) {
		this.effetcs.lowPassFilter.frequency = value * (END_LOWPASS - START_LOWPASS) + START_LOWPASS
	}

	//
	// RAF
	//
	initRAF() {
		RAFManager.add('audio', this.update.bind(this))
	}
	update() {
		this.setFrequencyLowPass(RAFManager.speed)
	}

	//
	// Action
	//
	play(name, loop = false, volume = 1) {
		if (!name) return console.error('No sound name provided')
		if (!this.listSounds[name]) return console.error(`Sound ${name} not found`)

		if (!this.sounds[name]) {
			this.sounds[name] = new Pz.Sound({
				source: 'sound',
				options: {
					sound: {
						getRawSourceNode: () => {
						  var node = Pz.context.createBufferSource();
						  node.buffer = this.listSounds[name];
						  return node;
						}
					},
					loop: loop,
					volume: volume
				}
			})

			for (const key in this.effetcs) {
				if (Object.hasOwnProperty.call(this.effetcs, key)) {
					const element = this.effetcs[key];
					this.sounds[name].addEffect(element)
				}
			}
		}

		this.sounds[name].stop()
		this.sounds[name].loop = loop
		this.sounds[name].volume = volume
		this.sounds[name].play()
	}

	stop(name, duration = 1000, onTransitionEnd = null) {
		if (!name) return console.error('No sound name provided')

		if (!this.sounds[name]) {
			return console.error(`Sound ${name} not playing`)
		} else {
			anime({
				targets: this.sounds[name],
				volume: 0,
				duration,
				easing: 'easeOutQuad',
				complete: () => {
					this.sounds[name].stop()
					if (onTransitionEnd) onTransitionEnd()
				}
			})
		}
	}
}

