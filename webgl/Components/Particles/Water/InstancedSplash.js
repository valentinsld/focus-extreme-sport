import { Object3D, DodecahedronGeometry, RawShaderMaterial, InstancedMesh, DynamicDrawUsage, MathUtils, Matrix4, InstancedBufferAttribute, Vector3, Vector2 } from 'three';

import splashV from '../../../Shaders/Particles/SplashParticles/splashV.vert'
import splashF from '../../../Shaders/Particles/SplashParticles/splashF.frag'

export default class InstancedSplash {
	constructor(options) {

		// Call all options
		// this.debug = options.debug

		this.direction = options.direction || 'default'
		this.spreadMultiplier = options.spreadMultiplier || new Vector3(0.7, 0.7, 0.9)
		this.scales = options.scales || new Vector2(0.0025, 0.006)
		this.gravity = options.gravity || 0.25
		this.velocityMultiplier = options.velocityMultiplier || 1
		this.maxAlphas = options.maxAlphas || new Vector2(0.1, 0.8)
		this.veloRandArr = options.veloRandArr || [{x: 2, y: 2, z: 2}, {x: 5, y: 5, z: 5}]
<<<<<<< HEAD
		this.lifeTime = options.lifeTime || 5
		this.type = options.type || 'default'
=======
>>>>>>> 1e4a1fb (Fix merge)

		this.params = {
			count: options.count || 100,
		}

		// Set up
		this.container = new Object3D();
		this.container.name = 'SplashParticles';

		this.dummy = new Object3D()
		this.count = 0;
		this.properties = []
		this.ages = new Float32Array(this.params.count)

		this.canEmit = true;
		this.isFalling = false;

		this.colorsArr = options.colors

		this.init()
		// if(this.debug) this.initDebug()
	}

	init() {
		this.geo = new DodecahedronGeometry(0.5, 0)

		this.mat = new RawShaderMaterial({
			vertexShader: splashV,
			fragmentShader: splashF,
			transparent: true,
			depthTest: true,
			// blending: AdditiveBlending,
		})

		this.instancedThem(this.geo, this.mat, this.params.count)
	}

	instancedThem(geometry, material, count) {
		if(this.container.mesh) this.container.remove(this.mesh)

		this.mesh = new InstancedMesh(geometry, material, count)

		this.setInstancedMeshProperties()

		this.mesh.instanceMatrix.setUsage(DynamicDrawUsage)
		this.mesh.instanceMatrix.needsUpdate = true
		this.container.add(this.mesh)
	}

	setInstancedMeshProperties() {
		const alphas = []
		const maxAlphas = []

		for (let i = 0; i < this.params.count; i++) {

			const scaleRand = MathUtils.randFloat(this.scales.x , this.scales.y)
			const x = MathUtils.randFloat(-.01 , .01);
			const z = MathUtils.randFloat(-.01 , .01);

			const randIndex = Math.round(MathUtils.randFloat(0 , this.colorsArr.length - 1))

			this.dummy.position.x = x;
			this.dummy.position.y = 0;
			this.dummy.position.z = z;

			this.dummy.scale.set(scaleRand, scaleRand, scaleRand)

			this.dummy.updateMatrix()

			const maxiDummy = new Object3D()

			const newMat4 = new Matrix4()

			newMat4.copy(this.dummy.matrix)

			const gravity =  this.gravity + (Math.random() * 0.06 - 0.001);

			let directionVector;

			switch (this.direction) {
				case 'left':
					directionVector = new Vector3(
						(Math.random() - .25),
						3 + (Math.random() * 0.2),
						-(Math.random() - .25)
					);
					break;

				case 'right':
					directionVector = new Vector3(
						-(Math.random() - .25),
						3 + (Math.random() * 0.2),
						-(Math.random() - .25)
					);
					break;

				case 'back':
					directionVector = new Vector3(
						(Math.random() - .25),
						3 + (Math.random() * 0.2),
						-(Math.random() - .25)
					);
					break;

				default:
					directionVector = new Vector3(
						(Math.random() - .25),
						3 + (Math.random() * 0.2),
						(Math.random() - .25)
					);
					break;
			}

			directionVector.normalize();

			const velocity = new Vector3(0, Math.random() * this.velocityMultiplier, 0);

			this.properties.push({
				mat: newMat4,
				index: randIndex,
				speed: MathUtils.randFloat(7, 14),
				gravity: gravity,
				dirVect: directionVector,
				velocity: velocity,
				maxiDummy: maxiDummy,
				used: false,
				died: false,
				dying: false,
				propulsed: false,
				pos: new Vector3(
					this.dummy.position.x,
					this.dummy.position.y,
					this.dummy.position.z
				),
				scale: new Vector3(
					this.dummy.scale.x,
					this.dummy.scale.y,
					this.dummy.scale.z
				)
				})

<<<<<<< HEAD
			alphas.push(1)
=======
			alphas.push(0)
>>>>>>> 1e4a1fb (Fix merge)
			maxAlphas.push(MathUtils.randFloat(this.maxAlphas.x, this.maxAlphas.y))

			this.mesh.setColorAt(i, this.colorsArr[randIndex])
			this.mesh.setMatrixAt( i, this.dummy.matrix );
		}

		this.mesh.geometry.setAttribute('aAlpha', new InstancedBufferAttribute(new Float32Array(alphas), 1))
		this.mesh.geometry.setAttribute('aMaxAlpha', new InstancedBufferAttribute(new Float32Array(maxAlphas), 1))
		this.mesh.instanceMatrix.needsUpdate = true;
		this.mesh.instanceColor.needsUpdate = true

	}

	updateParticles(time, dt) {

		for (let i = 0; i < this.params.count; i++) {

			this.ages[ i ] += ((dt) * this.properties[i].speed);

		   this.dummy.matrix.copy(this.properties[i].mat)

		   this.mesh.setMatrixAt(i, this.dummy.matrix)

			this.properties[i].maxiDummy.position.y += this.properties[i].velocity.y * .00125;
			this.properties[i].velocity.y *= .99 * this.spreadMultiplier.y; // between 0 and 0.99 => spread Y
			this.properties[i].velocity.y = Math.max(this.properties[i].velocity.y - (this.properties[i].gravity) , -1);


			this.properties[i].maxiDummy.position.x += this.properties[i].velocity.x * .01;
			this.properties[i].velocity.x *= .99 * this.spreadMultiplier.x; // between 0 and 0.99 => spread X

			// Z displacement for falling effect
			this.properties[i].maxiDummy.position.z += this.properties[i].velocity.z * .01;
			this.properties[i].velocity.z *= .99 * this.spreadMultiplier.z;

			this.dummy.matrix.setPosition( this.properties[i].maxiDummy.position.x, this.properties[i].maxiDummy.position.y, this.properties[i].maxiDummy.position.z)

			// this.properties[i].maxiDummy.scale.x = this.properties[i].scale.x * (this.ages * .1)
			// this.properties[i].maxiDummy.scale.y = this.properties[i].scale.y * (this.ages * .1)
			// this.properties[i].maxiDummy.scale.z = this.properties[i].scale.z * (this.ages * .1)

			// this.dummy.matrix.makeScale(this.properties[i].maxiDummy.scale.x, this.properties[i].maxiDummy.scale.y, this.properties[i].maxiDummy.scale.z)

		   this.mesh.setMatrixAt(i, this.dummy.matrix)

		   if (this.type === 'cloud') {
			   this.mesh.geometry.attributes.aAlpha.setX(i, 1 - ((this.ages[i] * .5) / this.lifeTime))
			} else {
			   this.mesh.geometry.attributes.aAlpha.setX(i, 1 - ((this.ages[i] * 2) / this.lifeTime))
		   }


		   if ( this.ages[ i ] >= this.lifeTime ) {
			   this.ages[ i ] = 0;

			   if(this.canEmit) this.propulseParticle(this.properties[i])
		   }
	   }
	   this.mesh.geometry.attributes.aAlpha.needsUpdate = true

	//    this.container.rotation.set(-this.camera.rotation.x , 0, -this.camera.rotation.z)

	   this.mesh.instanceMatrix.needsUpdate = true;
   }

   propulseParticle(element) {
		element.delay = 0;

		// Starting position of lunching particle
		element.maxiDummy.position.y = 0;
		element.maxiDummy.position.x = element.pos.x;
		element.maxiDummy.position.z = element.pos.z;

		element.velocity.copy(element.dirVect);

		// Multiplier for vector (strength of projection)
		element.velocity.y *= MathUtils.randFloat(this.veloRandArr[0].y, this.veloRandArr[1].y);
		element.velocity.x *= MathUtils.randFloat(this.veloRandArr[0].x, this.veloRandArr[1].x);
		element.velocity.z *= MathUtils.randFloat(this.veloRandArr[0].z, this.veloRandArr[1].z);
	}

	hideSplash() {
		this.mesh.visible = false
	}

<<<<<<< HEAD
	showSplash() {
		this.mesh.visible = true
	}

=======
>>>>>>> 1e4a1fb (Fix merge)
	startEmit() {
		this.canEmit = true;
		this.isFalling = false;
	}

	endEmit() {
		this.canEmit = false;
		this.isFalling = true;
	}

}
