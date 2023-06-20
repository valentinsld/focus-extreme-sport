import Pz from 'pizzicato'

import WebGL from '../index'
import RAFManager from '../Utils/RAFManager'

const START_LOWPASS = 100
const END_LOWPASS = 3500

const RANDOM_QTE_SUCESS = [
	'qte-sucess',
]
const RANDOM_QTE_WRONG = [
	'qte-wrong',
]
const RANDOM_SWITCH = [
	'switch-3p1',
	'switch-3p2',
	'switch-3p3'
]

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

		this.initRAF()
	}

	//
	// EFFETCS
	//
	setFrequencyLowPass(value) {
		const v = value * (END_LOWPASS - START_LOWPASS) + START_LOWPASS
		for (const name in this.sounds) {
			if (this.sounds[name].effects[0]) this.sounds[name].effects[0].frequency = v
		}
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
	play(name, loop = false, volume = 1, duration = 0, effect = true) {
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
						  node.loop = loop;
						  return node;
						},
					},
				}
			})

			if (effect) {
				this.sounds[name].addEffect(new Pz.Effects.LowPassFilter({
					frequency: END_LOWPASS,
					peak: 0.1
				}))
			}
		}

		this.sounds[name].stop()
		this.sounds[name].volume = volume
		this.sounds[name].attack = duration / 1000
		this.sounds[name].play()
	}

	stop(name, duration = 1000, onTransitionEnd = null) {
		if (!name) return console.error('No sound name provided')

		if (!this.sounds[name]) {
			return console.error(`Sound ${name} not playing`)
		} else {
			this.sounds[name].release = duration / 1000
			this.sounds[name].stop()
			setTimeout(() => {
				if (onTransitionEnd) onTransitionEnd()
			}, duration)
		}
	}

	//
	// Random
	//
	playRandomSwitch(volume = 1) {
		const name = RANDOM_SWITCH[Math.floor(Math.random() * RANDOM_SWITCH.length)]
		this.play(name, false, volume, 0, false)
	}
	playRandomQteSuccess(volume = 0.5) {
		const name = RANDOM_QTE_SUCESS[Math.floor(Math.random() * RANDOM_QTE_SUCESS.length)]
		this.play(name, false, volume, 0, false)
	}
	playRandomQteWrong(volume = 0.5) {
		const name = RANDOM_QTE_WRONG[Math.floor(Math.random() * RANDOM_QTE_WRONG.length)]
		this.play(name, false, volume, 0, false)
	}
}

