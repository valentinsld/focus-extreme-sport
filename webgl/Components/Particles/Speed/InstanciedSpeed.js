import { Object3D, BoxGeometry, RawShaderMaterial, InstancedBufferGeometry, AdditiveBlending, Mesh, InstancedInterleavedBuffer, InterleavedBufferAttribute, DoubleSide } from 'three';

import SpeedLine from './SpeedLines';
import speedLineF from '../../../Shaders/Particles/SpeedLine/speedLineF.frag'
import speedLineV from '../../../shaders/Particles/SpeedLine/speedlineV.vert'

export default class InstanciedSpeed {
	constructor(options) {

		// Call all options
		this.assets = options.assets;
		this.countAll = options.countAll;

		// this.params = {
		// 	gravity: 0.025,
		// 	showedCount: 125,
		// 	floatAmplitude: 1,
		// 	floatFreq: 0.1,
		// 	strengthPropY: 3.5,
		// 	strengthPropX: 6,
		// 	strengthPropZ: 6,
		// 	spreadY: 0.95,
		// 	spreadX: 0.99,
		// 	spreadZ: 0.99,
		// 	speedRot: 0.001,
		// 	minScaleNorm: 0.2,
		// 	maxScaleNorm: 1.2,
		// };

		// Set up
		this.container = new Object3D();
		this.container.name = 'Particle';

		this.usedParticles = []

		this.instancedParticle();
	}

	instancedParticle() {
		this.planeGeo = new BoxGeometry(1, 1, 1);

		// this.mat = new MeshBasicMaterial({
		// 	transparent: true,
		// 	// map: this.assets.textures.speedline,
		// 	// blending: AdditiveBlending,
		// 	color: 0xffffff,
		// 	side: DoubleSide
		// })

		this.mat = new RawShaderMaterial({
			vertexShader: speedLineV,
			fragmentShader: speedLineF,
			side: DoubleSide
		})

		this.geo = new InstancedBufferGeometry();
		this.geo.index = this.planeGeo.index;
		this.geo.attributes.scale = this.planeGeo.attributes.scale;

		this.initAttributes();

		// Create all particles
		for (let i = 0; i < this.countAll; i++) {
			// Call the class Particle.js
			const particle = new SpeedLine({
				count: this.countAll,
				size: 1,
				speed: .5
			});

			particle.index = i

			// Set attributes for instancedBufferGeometry
			this.buffer[ i * this.stride + 0 ] = particle.scale.x;
			this.buffer[ i * this.stride + 1 ] = particle.scale.y;
			this.buffer[ i * this.stride + 2 ] = particle.scale.z;

			this.usedParticles.push(particle)
		}

		console.log(this.geo);
		this.meshParticle = new Mesh(this.geo, this.mat);
		// this.meshParticle.frustumCulled = false;
		console.log(this.meshParticle);
		this.container.add(this.meshParticle);
		this.container.position.set(0,0,0)
	}

	// Initialize attributes for preparing them into the shader.vert
	initAttributes() {
		// Adding number of transformation for each attribute
		// 3 scale
		this.stride = 3;
		this.buffer = new Float32Array(this.countAll * this.stride);
		this.interleavedBuffer = new InstancedInterleavedBuffer(this.buffer, this.stride);
		this.geo.setAttribute('scale', new InterleavedBufferAttribute(this.interleavedBuffer, 3, 0, false));
		this.interleavedBuffer.needsUpdate = true;
	}

	update(time) {
		for (let i = this.usedParticles.length - 1; i >= 0; i--) {
			const element = this.usedParticles[ i ];

			// console.log(element);
			// Update attributes
			this.buffer[ i * this.stride + 0 ] = 1;
			this.buffer[ i * this.stride + 1 ] = 1;
			this.buffer[ i * this.stride + 2 ] = 1;
			element.update(time);
		}

		this.interleavedBuffer.needsUpdate = true;
		// this.meshParticle.geometry.instanceCount = count;
	}
}
