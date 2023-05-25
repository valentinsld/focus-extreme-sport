import { PlaneGeometry, Mesh, RawShaderMaterial, Color } from 'three'
// import RAFManager from '../Utils/RAFManager.js'

import WebGL from '../index.js'
import { getVisibleHeightAtZDepth, getVisibleWidthAtZDepth } from '../Utils/ScreenInformations.js'

import vertexShader from '../Shaders/HomeBackground/HomeBackground.vert'
import fragmentShader from '../Shaders/HomeBackground/HomeBackground.frag'
import Sizes from '../Utils/Sizes.js'
import RAFManager from '../Utils/RAFManager.js'

export default class HomeBackground {
	static singleton

	constructor() {
		this.inView = false
		this.WebGL = new WebGL()
		this.sizes = new Sizes()
		this.camera = this.WebGL.camera.current

		this.params = {
			colorA: '#5c80a2', // #46698B
			colorB: '#89ADCE',
			posX: 1,
			size2: 3,
			scaleY2: 3,
			intensity: 0.96,
		}

		this.init()
	}

	init() {

		const geometry = new PlaneGeometry(getVisibleWidthAtZDepth(0.01, this.camera), getVisibleHeightAtZDepth(0.01, this.camera))
		const material = new RawShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uResolution: { value: [this.sizes.width, this.sizes.height] },
				uColorA: { value: new Color(this.params.colorA) },
				uColorB: { value: new Color(this.params.colorB) },
				// TODO remove
				uPosX: { value: this.params.posX},
				uSize2: { value: this.params.size2},
				uScaleY2: { value: this.params.scaleY2},
				uIntensity: { value: this.params.intensity},
			},
			vertexShader,
			fragmentShader
		})

		this.instance = new Mesh(geometry, material)
		this.instance.position.z = -0.1

		if(this.WebGL.debug) {
			this.debugFolder = this.WebGL.debug.addFolder({ title: 'Home Background', expanded: true })

			// colors
			this.debugFolder.addInput(this.params, 'colorA').on('change', () => {
				material.uniforms.uColorA.value = new Color(this.params.colorA)
			})
			this.debugFolder.addInput(this.params, 'colorB').on('change', () => {
				material.uniforms.uColorB.value = new Color(this.params.colorB)
			})

			// posX
			this.debugFolder.addInput(this.params, 'posX').on('change', () => {
				material.uniforms.uPosX.value = this.params.posX
			})

			// size2
			this.debugFolder.addInput(this.params, 'size2').on('change', () => {
				material.uniforms.uSize2.value = this.params.size2
			})

			// scaleY2
			this.debugFolder.addInput(this.params, 'scaleY2').on('change', () => {
				material.uniforms.uScaleY2.value = this.params.scaleY2
			})

			// intensity
			this.debugFolder.addInput(this.params, 'intensity').on('change', () => {
				material.uniforms.uIntensity.value = this.params.intensity
			})
		}

		this.camera.add(this.instance)

		// Resize
		this.sizes.on('resize', () => {
			material.uniforms.uResolution.value = [this.sizes.width, this.sizes.height]
		})

		// update
		RAFManager.add('HomeBackground', this.update.bind(this))
	}

	update(t) {
		this.instance.material.uniforms.uTime.value = t * 0.5
	}

	destroy() {
		RAFManager.remove('HomeBackground')
	}
}
