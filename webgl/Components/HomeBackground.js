import { PlaneGeometry, Mesh, RawShaderMaterial, Color, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Points } from 'three'
// import RAFManager from '../Utils/RAFManager.js'

import WebGL from '../index.js'
import { getVisibleHeightAtZDepth, getVisibleWidthAtZDepth } from '../Utils/ScreenInformations.js'

import vertexShader from '../Shaders/HomeBackground/HomeBackground.vert'
import fragmentShader from '../Shaders/HomeBackground/HomeBackground.frag'
import particlesVertexShader from '../Shaders/HomeBackground/Particules.vert'
import particlesFragmentShader from '../Shaders/HomeBackground/Particules.frag'
import Sizes from '../Utils/Sizes.js'
import RAFManager from '../Utils/RAFManager.js'

const count = 2000

export default class HomeBackground {
	static singleton

	constructor() {
		this.inView = false
		this.WebGL = new WebGL()
		this.sizes = new Sizes()
		this.camera = this.WebGL.camera.current

		this.params = {
			colorA: '#668aac', // #46698B
			colorB: '#89ADCE',
			colorDarkA: '#0c2349',
			colorDarkB: '#18305c',
			animDark: 0,
		}

		this.init()
	}

	init() {
		//
		// PLANE
		//
		const geometry = new PlaneGeometry(getVisibleWidthAtZDepth(0.01, this.camera), getVisibleHeightAtZDepth(0.01, this.camera))
		const material = new RawShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uResolution: { value: [this.sizes.width, this.sizes.height] },
				uColorA: { value: new Color(this.params.colorA) },
				uColorB: { value: new Color(this.params.colorB) },
				uColorDarkA: { value: new Color(this.params.colorDarkA) },
				uColorDarkB: { value: new Color(this.params.colorDarkB) },
				uAnimDark: { value: this.params.animDark },
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

			this.debugFolder.addSeparator()

			// colors DARK
			this.debugFolder.addInput(this.params, 'colorDarkA').on('change', () => {
				material.uniforms.uColorDarkA.value = new Color(this.params.colorDarkA)
			})
			this.debugFolder.addInput(this.params, 'colorDarkB').on('change', () => {
				material.uniforms.uColorDarkB.value = new Color(this.params.colorDarkB)
			})

			// anim
			this.debugFolder.addInput(this.params, 'animDark', { min: 0, max: 1, step: 0.01 }).on('change', () => {
				material.uniforms.uAnimDark.value = this.params.animDark
			})
		}

		this.camera.add(this.instance)

		//
		// ADD particules
		//
		this.particlesGeometry = new BufferGeometry()

		const positions = new Float32Array(count * 3)
		const colors = new Float32Array(count * 3)
		const sizes = new Float32Array(count)
		const randoms = new Float32Array(count)

		for(let i = 0; i < count; i++)
		{
			const i3 = i * 3

			positions[i3] = (Math.random() - 0.5)
			positions[i3 + 1] = (Math.random() - 0.5)
			positions[i3 + 2] = 0

			colors[i3] = 1
			colors[i3 + 1] = 1
			colors[i3 + 2] = 1

			sizes[i] = (Math.random() + 0.5)
			randoms[i] = Math.random()
		}

		this.particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3))
		this.particlesGeometry.setAttribute('color', new BufferAttribute(colors, 3))
		this.particlesGeometry.setAttribute('aSize', new BufferAttribute(sizes, 1))
		this.particlesGeometry.setAttribute('aRandom', new BufferAttribute(randoms, 1))

		const particlesMaterial = new ShaderMaterial({
			vertexShader: particlesVertexShader,
			fragmentShader: particlesFragmentShader,
			blending: AdditiveBlending,
			depthTest: false,
			transparent: true,

			uniforms: {
				uTime: { value: 0 },
				uSize: { value: 25 },
			},
		})

		// Points
		this.particles = new Points(this.particlesGeometry, particlesMaterial)
		this.particles.position.set(-0.25, -0.25, 0)
		this.instance.add(this.particles)


		// Resize
		this.sizes.on('resize', () => {
			material.uniforms.uResolution.value = [this.sizes.width, this.sizes.height]
		})

		// update
		RAFManager.add('HomeBackground', this.update.bind(this))
	}

	update(t) {
		// update time background
		this.instance.material.uniforms.uTime.value = t * 0.1

		// update particules
		this.particles.material.uniforms.uTime.value = t * 0.035
	}

	destroy() {
		RAFManager.remove('HomeBackground')
	}
}
