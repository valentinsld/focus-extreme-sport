import { Object3D, PlaneGeometry, MeshBasicMaterial, InstancedMesh, Matrix4, Vector3, DoubleSide, MathUtils, AdditiveBlending, DynamicDrawUsage } from 'three';
import Sizes from '~~/webgl/Utils/Sizes';

export default class InstanciedSpeedBis {
	constructor(options) {

		// Call all options
		this.assets = options.assets;
		// this.countAll = options.countAll;
		this.camera = options.camera
		this.debug = options.debug


		this.speedLineParams = {
			count: 150,
			speedMultiplier: 4,
			scaleMultiplier: 1
		  }

		// Set up
		this.container = new Object3D();
		this.container.name = 'Particle';

		this.dummy = new Object3D()
		this.count = 0;
		this.properties = []

		this.init()
		if(this.debug) this.initDebug()
	}

	init() {
		this.geo = new PlaneGeometry(.5,.5)

		this.mat = new MeshBasicMaterial({
			// color: 0xff0000,
			transparent: true,
			side: DoubleSide,
			map: this.assets.textures.speedline,
			blending: AdditiveBlending,
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

	updateParticles() {

	 	this.count += 0.01


		 for (let i = 0; i < this.speedLineParams.count; i++) {
			if(i === 0) {

				console.log(this.speedLineParams.count)
			}
			const targetScale =  Math.sin(this.count * (this.properties[i].speed * this.speedLineParams.speedMultiplier)) + (this.properties[i].speed / 15 + 1)

			// console.log(this.properties[i]);

			this.dummy.matrix.copy(this.properties[i].mat)
			this.dummy.matrix.scale(new Vector3( targetScale ,1, 1))

			this.mesh.setMatrixAt(i, this.dummy.matrix)
		}

		this.mesh.instanceMatrix.needsUpdate = true;
	}

	setInstancedMeshProperties() {
		const screenSize = new Sizes()

		for (let i = 0; i < this.speedLineParams.count; i++) {
			const ang = MathUtils.randFloat(0, Math.PI * 4);
			const scaleXRand = MathUtils.randFloat(1 * this.speedLineParams.scaleMultiplier, 3 * this.speedLineParams.scaleMultiplier)
			const scaleYRand = MathUtils.randFloat(.0005, .005)
			const radius = 0.29;
			const ratio = screenSize.ratio;
			const x = Math.cos(ang) * radius * ratio;
			const y = Math.sin(ang) * radius;

			this.dummy.position.x = x;
			this.dummy.position.y = y;
			this.dummy.position.z = 0;

			this.dummy.rotation.y = Math.PI/2 + ang;
			this.dummy.rotation.x = Math.PI /2
			this.dummy.rotation.z = Math.PI/2

			this.dummy.quaternion.setFromEuler( this.dummy.rotation );

			this.dummy.scale.x = scaleXRand;
			this.dummy.scale.y = scaleYRand;
			this.dummy.scale.z = 1;

			this.dummy.updateMatrix()

			const newMat4 = new Matrix4()

			newMat4.copy(this.dummy.matrix)

			this.properties.push({mat: newMat4, speed: MathUtils.randFloat(2, 5)})


			this.mesh.setMatrixAt( i, this.dummy.matrix );
		}
		this.mesh.instanceMatrix.needsUpdate = true;
	}

	setNumberOfLine(newCount) {
		this.container.remove(this.mesh)
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
