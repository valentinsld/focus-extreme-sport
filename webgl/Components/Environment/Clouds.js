import { Object3D, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three';

import WebGL from '~~/webgl';

export default class Clouds {
	constructor(options) {

		// Call all options
		this.webgl = new WebGL()
		this.camera = this.webgl.camera.container
		this.texture = this.webgl.assets.textures;

		this.size = options.size
		this.index = options.index
		this.opacity = options.opacity

		// Set up
		this.container = new Object3D();
		this.container.name = 'Clouds';
		this.properties = []

		this.init()
	}

	init() {

		this.geo = new PlaneGeometry(this.size, this.size)
		this.material = new MeshBasicMaterial({
			transparent: true,
			color: 0xffffff,
			map: this.texture[`cloud_${this.index}`],
			depthTest: true,
			depthWrite: false,
			side: DoubleSide,
			opacity: this.opacity
		})

		this.mesh = new Mesh(this.geo, this.material)

		this.container.add(this.mesh)
	}
}
