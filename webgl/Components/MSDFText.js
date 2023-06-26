import {Object3D, Mesh, TextureLoader, Vector3, Color, DoubleSide} from 'three'
import { MSDFTextGeometry, MSDFTextMaterial } from "three-msdf-text-utils";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

import FontAtlas from '~~/assets/MSDFfonts/roboto-regular.png'
import FontFNT from '~~/assets/MSDFfonts/roboto-regular.json'
import WebGL from '../index.js';

import fragmentShader from '~~/webgl/Shaders/MSDFText/main.frag'
import vertexShader from '~~/webgl/Shaders/MSDFText/main.vert'

import StrokeFrag from '~~/webgl/Shaders/MSDFText/Stroke.frag'

export default class MSDFText {

	constructor(_options = {}, onPrimiseEnded = null) {

		this.WebGL = new WebGL()

	  this.inView = false
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
	  this.lineHeight = _options.lineHeight || 1
	  this.isUppercase = _options.isUppercase || false
	  this.isSmall = _options.isSmall || false
	  this.color = _options.color || '#ffffff'
	  this.hasStroke = _options.hasStroke || false

	  this.onPrimiseEnded = onPrimiseEnded

	  this.init()
	}

	init() {
		Promise.all([
			this.loadFontAtlas(this.atlas),
			this.loadFont(this.font)
		]).then(([atlas, font]) => {
			const geometry = new MSDFTextGeometry({
				text: this.isUppercase ? this.text.toUpperCase() : this.text,
				font: font.data,
				width:this.width,
				align: this.align,
				letterSpacing: this.letterSpacing,
				lineHeight: this.lineHeight,
				multipage: true,
			});

			const material = new MSDFTextMaterial();
			const uniforms = JSON.parse(JSON.stringify(material.uniforms))
			material.fragmentShader = fragmentShader
			material.vertexShader = vertexShader
			material.uniforms = uniforms
			material.uniforms.uMap.value = atlas
			material.uniforms.uColor.value = new Color(this.color)
			if (this.hasStroke) {
				material.fragmentShader = StrokeFrag
				material.uniforms.uStrokeColor.value = new Color(this.color)
				material.uniforms.uStrokeOutsetWidth.value = 0.0
				material.uniforms.uStrokeInsetWidth.value = 0.1
				material.uniforms.uOpacity.value = 0
				material.uniforms.uStrokeOpacity = {
					value: 1
				}
			}
			material.side = DoubleSide
			material.defines.IS_SMALL = this.isSmall
			// material.depthTest = false

			this.mesh = new Mesh(geometry, material);
			this.container.add(this.mesh);
			this.container.rotation.x = Math.PI

			if (this.onPrimiseEnded) this.onPrimiseEnded(this)
		});

	}

	loadFontAtlas(path) {
		const promise = new Promise((resolve/*, reject*/) => {
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
