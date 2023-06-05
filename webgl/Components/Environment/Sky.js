import {
	Object3D,
	Color,
	SphereBufferGeometry,
	ShaderMaterial,
	BackSide,
	Mesh,
	Vector3
  } from 'three'

import { Sky } from 'three/addons/objects/Sky.js';

import { DegToRad } from '~~/webgl/Utils/Math.js';
import SkyF from '~~/webgl/Shaders/Sky/SkyF.frag'
import SkyV from '~~/webgl/Shaders/Sky/SkyV.vert'

import WebGL from '~~/webgl';

export default class SkyCustom {
	constructor(_options) {

		this.WebGL = new WebGL
		this.debug = _options.debug

		 //Set options for sphere color
		 this.sphereTopColor = _options.sphereTopColor
		 this.sphereBottomColor = _options.sphereBottomColor
		 this.offset = _options.offset
		 this.exponent = _options.exponent


		this.container = new Object3D()
		this.container.name = "Sky"

		this.init()

		// if (this.debug) {
		// 	this.debugFolder = this.debug.addFolder({ title: 'sky', expanded: false })
		// 	this.initDebug()
		// }

		// this.initCustom()
	}

	init() {
		this.sky = new Sky()
		this.sky.scale.setScalar(200)

		this.sun = new Vector3()

		this.skyController = {
		  turbidity: 2.1,
		  rayleigh: 2,
		  mieCoefficient: 0.165,
		  mieDirectionalG: 1,
		  elevation: 40,
		  azimuth: 254.5,
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

	initCustom() {
		this.uniforms = {
			topColor: { value: new Color(this.sphereTopColor) },
			bottomColor: { value: new Color(this.sphereBottomColor) },
			offset: { value: this.offset },
			exponent: { value: this.exponent },
		}

		this.skyGeo = new SphereBufferGeometry(100, 5, 5)
		this.skyMat = new ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: SkyV,
			fragmentShader: SkyF,
			side: BackSide,
		})
		this.sky = new Mesh(this.skyGeo, this.skyMat)

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
		this.debugFolder.addInput(this.skyController, 'turbidity', {min: 0, max: 10, step: 0.001}).on('change', (e)=> {
				this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'rayleigh', {min: 0, max: 4, step: 0.001}).on('change', (e)=> {
				this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'mieCoefficient', {min: 0, max: 1, step: 0.001}).on('change', (e)=> {
				this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'mieDirectionalG', {min: 0, max: 1, step: 0.001}).on('change', (e)=> {
				this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'elevation', {min: 0, max: 90, step: 0.1}).on('change', (e)=> {
				this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'azimuth', {min: 0, max: 360, step: 0.1}).on('change', (e)=> {
				this.changeSky()
		})
		this.debugFolder.addInput(this.skyController, 'exposure', {min: 0, max: 1, step: 0.001}).on('change', (e)=> {
				this.changeSky()
		})
	  }
}
