import { Object3D, ConeGeometry, RawShaderMaterial, InstancedBufferAttribute, InstancedMesh, Matrix4, Vector3, MathUtils, DynamicDrawUsage } from 'three';
import Sizes from '~~/webgl/Utils/Sizes';

import speedLineV from '../../../Shaders/Particles/SpeedLine/speedLineV.vert'
import speedLineF from '../../../Shaders/Particles/SpeedLine/speedLineF.frag'

const PARAMS = {
	count: 100,
	speedMultiplier: 3,
	scaleMultiplier: 1
}

export default class InstanciedSpeed {
	constructor(options) {

		// Call all options
		this.assets = options.assets;
		// this.countAll = options.countAll;
		this.camera = options.camera
		this.debug = options.debug


		this.speedLineParams = {...PARAMS}

		// Set up
		this.container = new Object3D();
		this.container.name = 'Particle';

		this.dummy = new Object3D()
		this.count = 0;
		this.properties = []
		this.ages = new Float32Array(this.speedLineParams.count)

		this.init()
		if(this.debug) this.initDebug()
	}

	init() {
		// this.geo = new BoxGeometry(.5,.5,.5)
		this.geo = new ConeGeometry(.005, 1, 32)

		this.mat = new RawShaderMaterial({
			vertexShader: speedLineV,
			fragmentShader: speedLineF,
			transparent: true,
			depthTest: false,
		})

		this.instancedThem(this.geo, this.mat, this.speedLineParams.count)

		this.container.add(this.mesh)
	}

	instancedThem(geometry, material, count) {
		if(this.container.mesh) this.container.remove(this.mesh)

		this.mesh = new InstancedMesh(geometry, material, count)

		this.setInstancedMeshProperties()

		this.mesh.instanceMatrix.setUsage(DynamicDrawUsage)
		this.mesh.instanceMatrix.needsUpdate = true

		this.container.add(this.mesh)
	}

	updateParticles(dt) {

		 for (let i = 0; i < this.speedLineParams.count; i++) {
			this.ages[ i ] += ((dt * this.speedLineParams.speedMultiplier) * (this.properties[i].speed));

			this.dummy.matrix.copy(this.properties[i].mat)

			this.mesh.setMatrixAt(i, this.dummy.matrix)
			this.dummy.matrix.setPosition( this.properties[i].pos.x, this.properties[i].pos.y, this.properties[i].pos.z + this.ages[i])

			this.mesh.setMatrixAt(i, this.dummy.matrix)

			this.mesh.geometry.attributes.aAlpha.setX(i, MathUtils.smoothstep((this.ages[i] / 10), 0, .8))

			if ( this.ages[ i ] >= 50 ) {
				this.ages[ i ] = 0;

			}
		}
		this.mesh.geometry.attributes.aAlpha.needsUpdate = true

		this.container.rotation.set(-this.camera.rotation.x , 0, -this.camera.rotation.z)

		this.mesh.instanceMatrix.needsUpdate = true;
	}

	setInstancedMeshProperties() {
		const screenSize = new Sizes()
		const alphas = []
		const maxAlphas = []

		for (let i = 0; i < this.speedLineParams.count; i++) {
			const ang = MathUtils.randFloat(0, Math.PI * 2);
			// const scaleXRand = MathUtils.randFloat(.1 , 2)
			// const scaleYRand = MathUtils.randFloat(.001, .02)
			const scaleYRand = MathUtils.randFloat(.5, 2)
			// const scaleZRand = MathUtils.randFloat(.001, .02)
			const radius = MathUtils.randFloat(1, 4);
			const ratio = screenSize.ratio;
			const x = Math.cos(ang) * radius * ratio;
			const y = Math.sin(ang) * radius;

			// const x = MathUtils.randFloat(-5, 5)
			// const y = MathUtils.randFloat(-5, 5)

			this.dummy.position.x = x;
			this.dummy.position.y = y;
			this.dummy.position.z = -10;

			// this.dummy.rotation.y = Math.PI/2 + ang;
			// this.dummy.rotation.x = Math.PI /2
			this.dummy.rotation.x = -Math.PI /2
			// this.dummy.rotation.z = Math.PI/2

			this.dummy.quaternion.setFromEuler( this.dummy.rotation );

			// this.dummy.scale.x = scaleXRand;
			this.dummy.scale.y = scaleYRand;
			// this.dummy.scale.z = scaleZRand;

			this.dummy.updateMatrix()

			const newMat4 = new Matrix4()

			newMat4.copy(this.dummy.matrix)

			this.properties.push({
				mat: newMat4,
				speed: MathUtils.randFloat(5, 10),
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
			maxAlphas.push(MathUtils.randFloat(.25, .8))

			this.mesh.setMatrixAt( i, this.dummy.matrix );
		}

		this.mesh.geometry.setAttribute('aAlpha', new InstancedBufferAttribute(new Float32Array(alphas), 1))
		this.mesh.geometry.setAttribute('aMaxAlpha', new InstancedBufferAttribute(new Float32Array(maxAlphas), 1))
		this.mesh.instanceMatrix.needsUpdate = true;
	}

	setNumberOfLine(newCount = PARAMS.count) {
		this.container.remove(this.mesh)
		this.ages = new Float32Array(this.speedLineParams.count)
		this.speedLineParams.count = newCount
		this.init()
	}

	setSpeed(newSpeed = PARAMS.speedMultiplier) {
		this.speedLineParams.speedMultiplier = newSpeed
	}

	hideLines() {
		this.mesh.visible = false
	}

	showLines() {
		this.mesh.visible = true
	}

	initDebug() {
		this.debugFolder = this.debug.addFolder({ title: 'speedLine' })

		this.debugFolder.addInput(this.speedLineParams, 'speedMultiplier').on('change', (e)=> {
			this.setSpeed(e.value)
    	})

		this.debugFolder.addInput(this.speedLineParams, 'count').on('change', (e)=> {
			this.setNumberOfLine(e.value)
		})

		this.debugFolder.addButton({ title: "Hide speedLines" }).on("click", () => {
			this.hideLines()
		  });

		  this.debugFolder.addButton({ title: "Show speedLines" }).on("click", () => {
			this.showLines()
		  });
	}
}
