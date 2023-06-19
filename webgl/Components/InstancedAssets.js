import { InstancedMesh, DynamicDrawUsage, Object3D, MeshStandardMaterial } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import WebGL from '..'

export default class InstancedAssets {
	constructor(_options) {

		this.webgl = new WebGL()

		this.generator = this.webgl.renderer.generator
		this.model = _options.model
		this.instances = _options.instances
		this.scaleMultiplier = _options.scaleMultiplier || 1
		this.hdr = _options.hdr
		this.intensity = _options.intensity || .5
		this.hasHdr = _options.hasHdr || false

		this.container = new Object3D()
		this.container.name = _options.name

		this.meshes = []

		this.dummy = new Object3D()

		this.init()
	}

	init() {
		this.chargedModel = this.webgl.assets.models[this.model].scene

		this.chargedModel.traverse((element) => {
			if (element.isMesh) {
				this.meshes.push(element)
			}
		})

		for (let i = 0; i < this.meshes.length; i++) {
			this.geo = this.meshes[i].geometry;
			if(!this.meshes[i].material) {
				this.mat = new MeshStandardMaterial({color: 0xff0000});
			} else {
				this.mat = this.meshes[i].material;

				if(this.hasHdr) {
					new RGBELoader().load(this.hdr, (map) => {
						this.envmap = this.generator.fromEquirectangular(map)
						this.mat.envMap = this.envmap.texture
						this.mat.envMapIntensity = this.intensity
				  })
				}
			}

			this.instancedThem(this.geo, this.mat, this.instances.length)
		}
	}

	instancedThem(geometry, material, count) {
		const mesh = new InstancedMesh(geometry, material, count)

		this.setInstancedMeshProperties(mesh)

		mesh.instanceMatrix.setUsage(DynamicDrawUsage)
		mesh.instanceMatrix.needsUpdate = true

		this.container.add(mesh)
	}

	setInstancedMeshProperties(mesh) {

		for (let i = 0; i < this.instances.length; i++) {

			this.dummy.position.x = this.instances[i].position.x;
			this.dummy.position.y = this.instances[i].position.y;
			this.dummy.position.z = this.instances[i].position.z;

			this.dummy.rotation.x = this.instances[i].rotation.x;
			this.dummy.rotation.y = this.instances[i].rotation.y;
			this.dummy.rotation.z = this.instances[i].rotation.z;

			// this.dummy.rotation.reorder('XZY')

			this.dummy.quaternion.setFromEuler( this.dummy.rotation );

			this.dummy.scale.x = this.instances[i].scale.x * this.scaleMultiplier;
			this.dummy.scale.y = this.instances[i].scale.y * this.scaleMultiplier;
			this.dummy.scale.z = this.instances[i].scale.z * this.scaleMultiplier;

			this.dummy.updateMatrix()

			mesh.setMatrixAt( i, this.dummy.matrix );
		}

		mesh.instanceMatrix.needsUpdate = true;
	}
}
