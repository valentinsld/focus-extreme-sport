import { Object3D, SphereGeometry, RawShaderMaterial, InstancedMesh, DynamicDrawUsage, MathUtils, Matrix4, InstancedBufferAttribute, Vector3, Color } from 'three';

import splashV from '../../../Shaders/Particles/SplashKayak/splashV.vert'
import splashF from '../../../Shaders/Particles/SplashKayak/splashF.frag'

export default class InstanciedKayakSplash {
	constructor(options) {

		// Call all options
		// this.debug = options.debug

		this.direction = options.direction
		this.spreadMultiplier = options.spreadMultiplier || new Vector3(0.7, 0.7, 0.9)

		this.params = {
			count: 100,
		  }

		// Set up
		this.container = new Object3D();
		this.container.name = 'KayakSplashParticle';

		this.dummy = new Object3D()
		this.count = 0;
		this.properties = []
		this.ages = new Float32Array(this.params.count)

		this.colorsArr =  [
			new Color(0x418B84),
			new Color(0x316863),
			new Color(0x347F7A),
			new Color(0x5CBDB6),
		]

		this.init()
		// if(this.debug) this.initDebug()
	}

	init() {
		this.geo = new SphereGeometry(0.5, 32, 16)

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

			const scaleRand = MathUtils.randFloat(.0025 , .006)
			const x = MathUtils.randFloat(-.01 , .01);
			const z = MathUtils.randFloat(-.01 , .01);

			const randIndex = Math.round(MathUtils.randFloat(0 , 3))

			this.dummy.position.x = x;
			this.dummy.position.y = 0;
			this.dummy.position.z = z;

			this.dummy.scale.set(scaleRand, scaleRand, scaleRand)

			this.dummy.updateMatrix()

			const maxiDummy = new Object3D()

			const newMat4 = new Matrix4()

			newMat4.copy(this.dummy.matrix)

			const gravity =  0.25 + (Math.random() * 0.06 - 0.001);

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
			}

			directionVector.normalize();

			const velocity = new Vector3(0, Math.random(), 0);

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

			alphas.push(0)
			maxAlphas.push(MathUtils.randFloat(.1, .8))

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

		   this.mesh.setMatrixAt(i, this.dummy.matrix)

		   this.mesh.geometry.attributes.aAlpha.setX(i, MathUtils.smoothstep(MathUtils.clamp(this.ages[i], 1, 5), 0, 1))

		   if ( this.ages[ i ] >= 5 ) {
			   this.ages[ i ] = 0;

				this.propulseParticle(this.properties[i])
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
		element.velocity.y *= MathUtils.randFloat(2,5);
		element.velocity.x *= MathUtils.randFloat(2,5);
		element.velocity.z *= MathUtils.randFloat(2,5);
	}

}
