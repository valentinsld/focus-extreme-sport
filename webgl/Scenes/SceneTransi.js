import { BufferGeometry, BufferAttribute, Object3D, Sphere, Vector3, Mesh} from 'three'

import WebGL from '../index.js'
import LayerMaterial from '../Shaders/LayerMaterial/LayerMaterial.js';

const positions = new Int8Array([ -1, -1, 4, -1, -1, 4, ]);
const bigQuadGeo = new BufferGeometry();
bigQuadGeo.setAttribute('position', new BufferAttribute(positions, 2));

export default class SceneTransi {
	static singleton

	constructor() {
		if (SceneTransi.singleton) {
			return SceneTransi.singleton
		  }
		SceneTransi.singleton = this

		this.WebGL = new WebGL()
		this.scene = this.WebGL.sceneTransi

		this.options = _options

		this.container = new Object3D
		this.container.name = "Transition container"

		this.init()
	}

	init() {
		bigQuadGeo.boundingSphere = new Sphere(new Vector3(), 0);
		this.layer = new Mesh(bigQuadGeo, new LayerMaterial({ assets: this.WebGL.assets}));
		this.layer.frustumCulled = false;
		this.layer.renderOrder = 1000;

		this.container.add(this.layer)
		this.scene.add(this.container)
	}
}
