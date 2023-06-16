import {
	Object3D,
	Vector3
  } from 'three'

import { Sky } from 'three/addons/objects/Sky.js';

import { DegToRad } from '~~/webgl/Utils/Math.js';

import WebGL from '~~/webgl';

export default class SkyCustom {
	constructor(_options) {

		this.WebGL = new WebGL
		this.debug = _options.debug

		this.turbidity = _options.turbidity || 2.1
		this.rayleigh = _options.rayleigh || 2
		this.mieCoefficient = _options.mieCoefficient || 0.165
		this.mieDirectionalG = _options.mieDirectionalG || 1
		this.elevation = _options.elevation || 40
		this.azimuth = _options.azimuth || 254.5


		this.container = new Object3D()
		this.container.name = "Sky"

		this.init()

		if (this.debug) {
			this.debugFolder = this.debug.addFolder({ title: 'sky', expanded: false })
			this.initDebug()
		}
	}

	init() {
		this.sky = new Sky()
		this.sky.scale.setScalar(200)

		this.sun = new Vector3()

		this.skyController = {
			turbidity: this.turbidity,
			rayleigh: this.rayleigh,
			mieCoefficient: this.mieCoefficient,
			mieDirectionalG: this.mieDirectionalG,
			elevation: this.elevation,
			azimuth: this.azimuth,
			exposure: this.WebGL.renderer.instance.toneMappingExposure
		};

		const uniforms = this.sky.material.uniforms;

		uniforms[ 'turbidity' ].value = this.skyController.turbidity;
		uniforms[ 'rayleigh' ].value = this.skyController.rayleigh;
		uniforms[ 'mieCoefficient' ].value = this.skyController.mieCoefficient;
		uniforms[ 'mieDirectionalG' ].value = this.skyController.mieDirectionalG;

		const phi = DegToRad( 90 - this.skyController.elevation );
		const theta = DegToRad( this.skyController.azimuth );

		this.sun.setFromSphericalCoords( 1, phi, theta );

		uniforms[ 'sunPosition' ].value.copy( this.sun );

		this.container.add(this.sky)
	}

	changeSky() {
		const uniforms = this.sky.material.uniforms;

		uniforms[ 'turbidity' ].value = this.skyController.turbidity;
		uniforms[ 'rayleigh' ].value = this.skyController.rayleigh;
		uniforms[ 'mieCoefficient' ].value = this.skyController.mieCoefficient;
		uniforms[ 'mieDirectionalG' ].value = this.skyController.mieDirectionalG;

		const phi = DegToRad( 90 - this.skyController.elevation );
		const theta = DegToRad( this.skyController.azimuth );

		this.sun.setFromSphericalCoords( 1, phi, theta );

		uniforms[ 'sunPosition' ].value.copy( this.sun );

		this.WebGL.renderer.instance.toneMappingExposure = this.skyController.exposure
	  }

	  initDebug() {
		this.debugFolder.addInput(this.skyController, 'turbidity', {min: 0, max: 10, step: 0.001}).on('change', ()=> {
			this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'rayleigh', {min: 0, max: 4, step: 0.001}).on('change', ()=> {
			this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'mieCoefficient', {min: 0, max: 1, step: 0.001}).on('change', ()=> {
			this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'mieDirectionalG', {min: 0, max: 1, step: 0.001}).on('change', ()=> {
			this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'elevation', {min: 0, max: 90, step: 0.1}).on('change', ()=> {
			this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'azimuth', {min: 0, max: 360, step: 0.1}).on('change', ()=> {
			this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'exposure', {min: 0, max: 1, step: 0.001}).on('change', ()=> {
			this.changeSky()
		})
	  }
}
