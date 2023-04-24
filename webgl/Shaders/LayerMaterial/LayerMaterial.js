import { Color, RawShaderMaterial, Vector2 } from 'three';
import { animate } from 'motion';

import Sizes from '~~/webgl/Utils/Sizes.js';
import RAFManager from '~~/webgl/Utils/RAFManager.js';

import layerFrag from './LayerMaterial.frag'
import { bigTriangleVertexShader } from './bigTriangle.js';

export default class LayerMaterial extends RawShaderMaterial {
	constructor(props = {}) {
		super()
		this.size = new Sizes()

		this.fragmentShader = layerFrag
		this.vertexShader = bigTriangleVertexShader;
		this.transparent = true;
		this.inProgressValue = this.outProgressValue = 0

		this.duration = 1

		this.assets = props.assets

		this.uniforms = {
			res: {
				value: new Vector2(),
			},
			color1: {
				value: new Color(0x2A84B0),
			},
			color2: {
				value: new Color(0x16759F),
			},
			color3: {
				value: new Color(0x75B3CE),
			},
			noiseTex: {
				value: this.assets.textures.displacement,
			},
			inProgress: {
				value: 0,
			},
			outProgress: {
				value: 0,
			},
			time: {
				value: 0,
			}

		};
		this.depthTest = false;
		// this.depthWrite = false;

		this.update = this.update.bind(this);

		RAFManager.add("LayerMaterialUpdate", this.update.bind(this));
	}

	async animationIn() {
		this?.outProgressTween?.stop();
		this.uniforms.outProgress.value = 0;
		this.outProgressValue = 0
		this?.inProgressTween?.stop();
		this.uniforms.inProgress.value = 0;
		this.inProgressValue = 0


		this.inProgressTween = animate((progress) => {
			this.inProgressValue = progress
		},
		{
			duration: this.duration,
		})

	}

	async animationOut() {
		this.uniforms.outProgress.value = 0;
		this.outProgressValue = 0

		this.outProgressTween = animate((progress) => {
			this.outProgressValue = progress
		},
		{
			duration: this.duration,
		})
	}

	update() {
		this.uniforms.res.value.x = this.size.width * this.size.pixelRatio;
		this.uniforms.res.value.y = this.size.height * this.size.pixelRatio;

		this.uniforms.inProgress.value = 3.5 * this.inProgressValue;
		this.uniforms.outProgress.value = 3.5 * this.outProgressValue;
	}
}
