import { Object3D, ShaderMaterial, DoubleSide, Color, Vector2, SphereGeometry, RawShaderMaterial, InstancedMesh, DynamicDrawUsage, MathUtils, Matrix4, Vector3, InstancedBufferAttribute } from 'three'
import WebGL from '~~/webgl'

import WaterfallF from '~~/webgl/Shaders/River/WaterfallF.frag'
import WaterfallV from '~~/webgl/Shaders/River/WaterfallV.vert'

import splashF from '~~/webgl/Shaders/Particles/SplashParticles/splashF.frag'
import splashV from '~~/webgl/Shaders/Particles/SplashParticles/splashV.vert'
import { DegToRad } from '~~/webgl/Utils/Math'
// import Clouds from './Clouds'

export default class Waterfall {
	constructor() {

		this.webgl = new WebGL
		this.assets = this.webgl.assets

		this.container = new Object3D()
		this.container.name = "Waterfall"

		this.params = {
			colorA: '#316863', // #89ADCE
			colorB: '#418B84', // #668aac
			colorC: '#ffffff', // #89ADCE
			colorD: '#347F7A', // #89ADCE
			count: 150,
			speedMultiplier: MathUtils.randFloat(1, 5),
		}

		this.dummy = new Object3D()
		this.time = 0
		this.properties = []
		this.ages = new Float32Array(this.params.count)
		this.colorsArr = []

		this.init()
	}

	init() {
		this.colorsArr.push(
			new Color(this.params.colorA),
			new Color(this.params.colorB),
			new Color(0xA7B6B5),
			new Color(0xaeaeae)
		)

		this.model = this.assets.models.waterfall.scene
		this.plane = this.model.children[0]

		this.plane.material = new ShaderMaterial({
			vertexShader: WaterfallV,
			fragmentShader: WaterfallF,
			transparent: true,
			depthTest: true,
			side: DoubleSide,

			uniforms: {
				uTime: { value: this.time},
				uBigWavesElevation: { value: 0.0025 },
				uBigWavesFrequency: { value: new Vector2(1, -10) },
				uBigWavesSpeed: { value: 0.5 },

				uSmallWavesElevation: { value: 0.05 },
				uSmallWavesFrequency: { value: 5 },
				uSmallWavesSpeed: { value: 0.2 },
				uSmallIterations: { value: 5 },

				uColorA: { value: new Color(this.params.colorA) },
				uColorB: { value: new Color(this.params.colorB) },

				uRotation: { value: -90},

				fogColor: { value: new Color(0x9bc8fa)},
				fogNear: { value: 0},
				fogFar: { value: 15},

			  },
			  defines: {
				USE_FOG: true
			  },
		})

		this.initSplash()

		this.container.add(...[this.model])
	}

	initSplash() {
		this.geo = new SphereGeometry(0.5, 32, 16)

		this.mat = new RawShaderMaterial({
			vertexShader: splashV,
			fragmentShader: splashF,
			transparent: false,
			// depthTest: true,
		})

		this.instancedThem(this.geo, this.mat, this.params.count)
	}

	instancedThem(geometry, material, count) {
		if(this.container.mesh) this.container.remove(this.mesh)

		this.mesh = new InstancedMesh(geometry, material, count)

		this.setInstancedMeshProperties()

		this.mesh.instanceMatrix.setUsage(DynamicDrawUsage)
		this.mesh.instanceMatrix.needsUpdate = true
		this.container.add(this.mesh)
	}

	setInstancedMeshProperties() {
		const alphas = []
		const maxAlphas = []

		for (let i = 0; i < this.params.count; i++) {

			const posX = MathUtils.randFloat(-.5, 1)
			const posZ = MathUtils.randFloat(-.35, .35)

			const randIndex = Math.round(MathUtils.randFloat(0 , this.colorsArr.length - 1))

			const randScale = MathUtils.randFloat(.1, .25)

			this.dummy.position.x = posX;
			this.dummy.position.y = 0;
			this.dummy.position.z = posZ;

			this.dummy.scale.x = randScale;
			this.dummy.scale.y = randScale;
			this.dummy.scale.z = randScale;

			this.dummy.updateMatrix()

			const newMat4 = new Matrix4()

			newMat4.copy(this.dummy.matrix)

			this.properties.push({
				mat: newMat4,
				speed: MathUtils.randFloat(5, 10),
				pos: new Vector3(
					this.dummy.position.x,
					this.dummy.position.y,
					this.dummy.position.z
				),
				scale: new Vector3(
					this.dummy.scale.x,
					this.dummy.scale.y,
					this.dummy.scale.z
				)
				})

			alphas.push(1)
			maxAlphas.push(MathUtils.randFloat(.25, .8))
			this.mesh.setColorAt(i, this.colorsArr[randIndex])
			this.mesh.setMatrixAt( i, this.dummy.matrix );
		}

		this.mesh.geometry.setAttribute('aAlpha', new InstancedBufferAttribute(new Float32Array(alphas), 1))
		// this.mesh.geometry.setAttribute('aMaxAlpha', new InstancedBufferAttribute(new Float32Array(maxAlphas), 1))
		this.mesh.instanceMatrix.needsUpdate = true;

		this.mesh.position.set(-.75, -.85, .1)
		this.mesh.rotation.y = DegToRad(10)
	}

	update(dt) {
		this.time += dt
		this.plane.material.uniforms.uTime.value = this.time

		for (let i = 0; i < this.params.count; i++) {
			this.ages[ i ] += ((this.time * this.params.speedMultiplier) * (this.properties[i].speed));

			this.dummy.matrix.copy(this.properties[i].mat)

			this.mesh.setMatrixAt(i, this.dummy.matrix)
			this.properties[i].pos.y = Math.sin(this.ages[i] * .15) * .15 + .15
			this.dummy.matrix.setPosition( this.properties[i].pos.x, this.properties[i].pos.y, this.properties[i].pos.z)

			this.mesh.setMatrixAt(i, this.dummy.matrix)

			if ( this.ages[ i ] >= 5 ) {
				this.ages[ i ] = 0;

			}
		}
		this.mesh.geometry.attributes.aAlpha.needsUpdate = true

		this.mesh.instanceMatrix.needsUpdate = true;
	}

	hideWaterfall() {
		this.container.visible = false
	}

	showWaterfall() {
		this.container.visible = true
	}
}
