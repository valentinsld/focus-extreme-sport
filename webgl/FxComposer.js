import {
	WebGLRenderTarget,
	Vector2,
  } from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import anime from "animejs"

import WebGL from '.'
import postProF from '~~/webgl/Shaders/PostPro/postProF.frag'
import postProV from '~~/webgl/Shaders/PostPro/postProV.vert'

import useStore from '@/stores/index.js'

const store = useStore()

export default class FXComposer {
	constructor() {
		this.webgl = new WebGL()
		this.sizes = this.webgl.sizes
		this.stats = this.webgl.stats
		this.scene = this.webgl.currentScene
		this.camera = this.webgl.camera.current
		this.renderer = this.webgl.renderer.instance
		this.assets = this.webgl.assets

		// Time in ms
		this.duration = 1000;

		this.isUpdatable = false

		this.setInstance()
	}

	setInstance() {
		this.renderPass = new RenderPass(this.scene, this.camera)

		this.renderTarget = new WebGLRenderTarget(
			this.sizes.width,
			this.sizes.height,
			{
				generateMipmaps: true,
				samples: 2
			}
		);

		this.composer = new EffectComposer(this.renderer);

		this.processingShader = {
			uniforms: {
			  tDiffuse: { value: null },
			  uRes: { value: new Vector2(this.sizes.width, this.sizes.height)},
			  opacity: { value: 1.0 },
			  uNoise: { value: this.assets.textures.transition1 },
			  uDpi: { value: this.sizes.pixelRatio },
			  uProgress: { value: 0},
			  uThreshold: {value: .5},
			  uK0: { value: new Vector2(0,0) }, // radial distortion coeff 0
			  uCc: { value: new Vector2(0,0) }, // principal point
			  uFc: { value: new Vector2(1,1) },  // focal length
			  uAlpha_c: { value: 0 }, // skew coeff
			  uAmount: {value: 0},
			  uAngle: {value: 0},
			  uOffset: {value: .75},
			  uDarkness: {value: 0},
			},
			vertexShader: postProV,
			fragmentShader: postProF,
		};

		this.composer.renderToScreen = true;
		this.composer.setSize(this.sizes.width, this.sizes.height);
		this.composer.setPixelRatio(this.sizes.pixelRatio);

		this.postProcessingPass = new ShaderPass(this.processingShader);
    	this.composer.addPass(this.renderPass);
    	this.composer.addPass(this.postProcessingPass);

		console.log();

		this.assets.on('ressourcesReady', ()=> {
			this.postProcessingPass.uniforms.uNoise.value = this.assets.textures.transition1
		})
	}

	async animationIn() {
		this.inTransi = anime({
			targets: this.postProcessingPass.uniforms['uProgress'],
			value: [0, 1],
			duration: this.duration,
			easing: 'cubicBezier(0.22, 1, 0.36, 1)',
		})

	}

	async animationOut() {
		anime({
			targets: this.postProcessingPass.uniforms['uProgress'],
			value: [1, 0],
			duration: this.duration,
			easing: 'cubicBezier(0.22, 1, 0.36, 1)',
		})
		setTimeout(()=> {
			store.state.isTransitioning = false
		}, this.duration * .75)
	}

	resetEffect() {
		this.postProcessingPass.uniforms.uK0.value.x = 0
		this.postProcessingPass.uniforms.uK0.value.y = 0
		this.postProcessingPass.uniforms.uAmount.value = 0;
		this.postProcessingPass.uniforms.uDarkness.value = 0;
	  }

	update() {
		if (this.stats) {
			this.stats.beforeRender()
		}

		this.composer.render();

		if (this.stats) {
			this.stats.afterRender()
		}
	}
}
