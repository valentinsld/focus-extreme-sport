import {Object3D, Mesh, TextureLoader, Vector3, Color} from 'three'
import { MSDFTextGeometry, MSDFTextMaterial } from "three-msdf-text-utils";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import RAFManager from '../Utils/RAFManager.js'

import FontAtlas from '~~/assets/MSDFfonts/roboto-regular.png'
import FontFNT from '~~/assets/MSDFfonts/roboto-regular.json'

import WebGL from '../index.js'

export default class MSDFText {

	constructor(_options = {}) {

	  this.inView = false
	  this.WebGL = new WebGL()
	  this.container = new Object3D
	  this.container.name = 'MSDFText'

	  this.atlas = _options.atlas || FontAtlas
	  this.font = _options.font || FontFNT
	  this.width = _options.width || 500
	  this.align = _options.align || 'center'
	  this.text = _options.text || 'Test text'
	  this.position = _options.position || new Vector3(-3, 0, -2)
	  this.scale = _options.scale || new Vector3(0.02, 0.02, 0.02)
	  this.letterSpacing = _options.letterSpacing || 0
	  this.lineHeight = _options.lineHeight || 0
	  this.isUppercase = _options.isUppercase || false
	  this.color = _options.color || '#ffffff'

	  this.init()
	}

	init() {
		Promise.all([
			this.loadFontAtlas(this.atlas),
		]).then(([atlas]) => {
			this.geometry = new MSDFTextGeometry({
				text: this.isUppercase ? this.text.toUpperCase() : this.text,
				font: this.loadFont(this.font).data,
				width:this.width,
				align: this.align,
				letterSpacing: this.letterSpacing,
				lineHeight: this.lineHeight,
			});

			// const matOption = {
			// 	uniforms: {
			// 		ucolor: {value: new Color("#ffff00")},
			// 	}
			// }

			this.material = new MSDFTextMaterial();
			this.material.uniforms.uMap.value = atlas;
			this.material.uniforms.uColor.value = new Color(this.color);

			this.mesh = new Mesh(this.geometry, this.material);
			this.container.add(this.mesh);
			this.container.rotation.x = Math.PI
			this.container.position.set(this.position.x, this.position.y, this.position.z)
			this.container.scale.set(this.scale.x, this.scale.y, this.scale.z)
		});

	}

	loadFontAtlas(path) {
		const promise = new Promise((resolve, reject) => {
			const loader = new TextureLoader();
			loader.load(path, resolve);
		});
		return promise;
	}

	loadFont(file) {
		const loader = new FontLoader();
		loader.parse(file)

		return loader.parse(file);
	}
}
