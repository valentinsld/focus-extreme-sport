import { RawShaderMaterial, Vector2 } from 'three';
import { animate } from 'motion';

import Sizes from '~~/webgl/Utils/Sizes.js';
import RAFManager from '~~/webgl/Utils/RAFManager.js';

import layerFrag from './LayerFrag.frag'
import { bigTriangleVertexShader } from './bigTriangle.js';

export default class LayerMaterial extends RawShaderMaterial {
	constructor(props = {}) {
		super()
		this.size = new Sizes()

		this.fragmentShader = layerFrag
		this.vertexShader = bigTriangleVertexShader;
		this.transparent = true;
		this.inProgressValue = this.outProgressValue = 0

		// Time in seconds
		this.duration = 1 * .5;

		this.assets = props.assets

		this.uniforms = {
			res: {
				value: new Vector2(),
			},
			noiseTex: {
				value: this.assets.textures.transition1,
			},
			progress: {
				value: 0.,
			},
			threshold : {
				value: .09,
			}

		};
		this.depthTest = false;
		// this.depthWrite = false;

		this.update = this.update.bind(this);

		RAFManager.add("LayerMaterialUpdate", this.update.bind(this));
	}

	async animationIn() {
		this?.outProgressTween?.stop();
		this?.inProgressTween?.stop();
		this.uniforms.progress.value = 0;
		this.inProgressValue = 0

		this.inProgressTween = animate((progress) => {
			this.inProgressValue = progress
		},
		{
			duration: this.duration,
			easing: '[0.22, 1, 0.36, 1]'
		})

	}

	async animationOut() {
		this.inProgressValue = 1

		this.outProgressTween = animate((progress) => {
			this.inProgressValue = 1 - progress
		},
		{
			duration: this.duration,
			easing: '[0.22, 1, 0.36, 1]'
		})
	}

	update() {
		this.uniforms.res.value.x = this.size.width * this.size.pixelRatio;
		this.uniforms.res.value.y = this.size.height * this.size.pixelRatio;

		this.uniforms.progress.value = this.inProgressValue;
	}
}
