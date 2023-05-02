import { Object3D, BoxGeometry, MeshBasicMaterial, MeshNormalMaterial, InstancedMesh, Matrix4, Vector3, Vector2, DoubleSide, MathUtils, AdditiveBlending, DynamicDrawUsage } from 'three';
import Sizes from '~~/webgl/Utils/Sizes';

export default class InstanciedSpeedBis {
	constructor(options) {

		// Call all options
		this.assets = options.assets;
		// this.countAll = options.countAll;
		this.camera = options.camera
		this.debug = options.debug


		this.speedLineParams = {
			count: 20,
			speedMultiplier: 1,
			scaleMultiplier: 1
		  }

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
		this.geo = new BoxGeometry(.5,.5,.5)

		this.mat = new MeshBasicMaterial({
			color: 0xffffff,
			// transparent: true,
			side: DoubleSide,
			// map: this.assets.textures.speedline,
			// blending: AdditiveBlending,
			depthTest: false,
		})

		// this.mat = new MeshNormalMaterial()

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

	updateParticles(time) {

		 for (let i = 0; i < this.speedLineParams.count; i++) {
			this.ages[ i ] += (0.05 * (this.properties[i].speed * this.speedLineParams.speedMultiplier));
			// this.ages[ i ] = ((time * 0.01) * (this.properties[i].speed * this.speedLineParams.speedMultiplier));
			// this.ages[ i ] = time ;

			this.dummy.matrix.copy(this.properties[i].mat)

			// this.dummy.matrix.scale(new Vector3( this.properties[i].scale.x + (this.ages[i] * 0.1) ,1, 1))

			this.mesh.setMatrixAt(i, this.dummy.matrix)
			this.dummy.matrix.setPosition( this.properties[i].pos.x, this.properties[i].pos.y, this.properties[i].pos.z + this.ages[i])

			this.mesh.setMatrixAt(i, this.dummy.matrix)

			if ( this.ages[ i ] >= 10 ) {

				this.ages[ i ] = -1;
				// return;

			}
		}

		this.mesh.instanceMatrix.needsUpdate = true;
	}

	setInstancedMeshProperties() {
		const screenSize = new Sizes()

		for (let i = 0; i < this.speedLineParams.count; i++) {
			const ang = MathUtils.randFloat(0, Math.PI * 2);
			const scaleXRand = MathUtils.randFloat(.5 , 2)
			const scaleYRand = MathUtils.randFloat(.001, .01)
			const scaleZRand = MathUtils.randFloat(.001, .01)
			const radius = 0.29;
			const ratio = screenSize.ratio;
			// const x = Math.cos(ang) * radius * ratio;
			// const y = Math.sin(ang) * radius;

			const x = MathUtils.randFloat(-5, 5)
			const y = MathUtils.randFloat(-5, 5)

			this.dummy.position.x = x;
			this.dummy.position.y = y;
			this.dummy.position.z = -10;

			this.dummy.rotation.y = Math.PI/2 + ang;
			this.dummy.rotation.x = Math.PI /2
			this.dummy.rotation.z = Math.PI/2

			this.dummy.quaternion.setFromEuler( this.dummy.rotation );

			this.dummy.scale.x = scaleXRand;
			this.dummy.scale.y = scaleYRand;
			this.dummy.scale.z = scaleZRand;

			this.dummy.updateMatrix()

			const newMat4 = new Matrix4()

			newMat4.copy(this.dummy.matrix)

			this.properties.push({
				mat: newMat4,
				speed: MathUtils.randFloat(1, 10),
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


			this.mesh.setMatrixAt( i, this.dummy.matrix );
		}
		this.mesh.instanceMatrix.needsUpdate = true;
	}

	setNumberOfLine(newCount) {
		this.container.remove(this.mesh)
		this.ages = new Float32Array(this.speedLineParams.count)
		this.speedLineParams.count = newCount
		this.init()
	}

	setSpeed(newSpeed) {
		this.speedLineParams.speedMultiplier = newSpeed
	}

	hideLines() {
		this.mesh.visible = false
	}

	showLines() {
		this.mesh.visible = true
	}

	initDebug() {
		// console.log(this.debug);
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
