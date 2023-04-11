import * as THREE from 'three'
import RAFManager from '../Utils/RAFManager.js'

import WebGL from '../index.js'
import { getVisibleHeightAtZDepth, getVisibleWidthAtZDepth } from '../Utils/ScreenInformations.js'

export default class TransitionPlane {
	static singleton

	constructor(_options = {}) {
	  if (TransitionPlane.singleton) {
		return TransitionPlane.singleton
	  }
	  TransitionPlane.singleton = this

	  this.inView = false
	  this.WebGL = new WebGL()
	  this.camera = _options.camera

	  this.init()
	}

	init() {

		this.transitionGeo = new THREE.PlaneGeometry(getVisibleWidthAtZDepth(0.01, this.camera), getVisibleHeightAtZDepth(0.01, this.camera))

	}
}
