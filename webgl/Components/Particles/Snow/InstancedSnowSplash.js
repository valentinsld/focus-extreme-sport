import { Vector3, Object3D, Color, SphereGeometry, MeshBasicMaterial, FrontSide, InstancedMesh, DynamicDrawUsage, MathUtils, Matrix4 } from 'three';

// import splashV from '../../../Shaders/Particles/SplashParticles/splashV.vert'
import splashF from '../../../Shaders/Particles/SplashParticles/splashF.frag'

export default class InstancedSnowSplash {
	constructor(options) {

		this.direction = options.direction
		this.spreadMultiplier = options.spreadMultiplier || new Vector3(0.7, 0.7, 0.9)

		this.params = {
			count: 100,
		}

		// Set up
		this.container = new Object3D();
		this.container.name = 'SplashSkiParticle';

		this.dummy = new Object3D()
		this.properties = []
		this.ages = new Float32Array(this.params.count)

		this.colorsArr =  [
			new Color(0x418B84),
			new Color(0x316863),
			new Color(0x347F7A),
			new Color(0x5CBDB6),
		]

		this.init()

	}

	init() {
		this.geo = new SphereGeometry(0.5, 32, 16)

		this.mat = new MeshBasicMaterial({
			transparent: false,
			opacity: 1,
			side: FrontSide,
		})

		this.mat.onBeforeCompile = (shader) => {
			// add custom shader chunks
			shader.vertexShader = shader.vertexShader.replace(
				'#include <common>',
				'#include <common>\nattribute float aAlpha;\nvarying float vAlpha;\nattribute float aMaxAlpha;\nvarying float vMaxAlpha;\nvarying vec3 vInstanceColor;'
			)
			shader.vertexShader = shader.vertexShader.replace(
				'void main() {',
				`void main() {
					vAlpha = aAlpha;
					vMaxAlpha = aMaxAlpha;
					vInstanceColor = instanceColor;`
			)

			shader.fragmentShader = splashF
		}

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
}
