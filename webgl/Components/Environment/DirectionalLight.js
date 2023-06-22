import {
	Object3D,
	DirectionalLight,
	DirectionalLightHelper,
	Vector3
} from 'three'

export default class DirectionalLightSource {
	constructor(options) {
		// Set options
		this.debug = options.debug
		this.color = options.color
		this.intensity = options.intensity
		this.positions = options.positions
		this.castShadow = options.castShadow
		this.shadowMapSize = options.shadowMapSize
		this.shadowBias = options.shadowBias
		this.target = options.target || new Vector3(0, 0, 0)

		// Set up
		this.container = new Object3D()
		this.container.name = 'Directional Light'
		this.params = {
			color: this.color,
			intensity: this.intensity,
			positions: this.positions,
			castShadow: this.castShadow,
			shadowMapSize: this.shadowMapSize,
			shadowBias: this.shadowBias,
		}

		this.createDirectionalLight()

		// this.setDebug()
	}
	createDirectionalLight() {
		this.light = new DirectionalLight(
			this.params.color,
			this.params.intensity
		)

		// Shadows
		// let d = 10
		// this.light.shadow.camera.near = d * 0.01
		// this.light.shadow.camera.far = 300
		// this.light.shadow.camera.right = d
		// this.light.shadow.camera.left = -d
		// this.light.shadow.camera.top = d
		// this.light.shadow.camera.bottom = -d
		// this.light.castShadow = true

		// this.light.castShadow = this.params.castShadow || true
		// if (this.params.shadowMapSize !== undefined) {
		// 	this.light.shadow.mapSize.width = this.params.shadowMapSize
		// 	this.light.shadow.mapSize.height = this.params.shadowMapSize
		// }
		// if (this.params.shadowBias !== undefined) {
		// 	this.light.shadow.bias = this.params.shadowBias
		// }

		this.container.add(this.light)

		this.light.target.position.set(this.target.x, this.target.y, this.target.z)

		// Positions
		this.light.position.x = this.params.positions.x
		this.light.position.y = this.params.positions.y
		this.light.position.z = this.params.positions.z

		const helper = new DirectionalLightHelper(this.light, 5)
		this.container.add(helper)
	}

	setDebug() {
		this.debug.setFolder(this.container.name)
		const gui = this.debug.getFolder(this.container.name)

		gui.addInput(this.light, 'position', {
			label: 'Directional Light',
			x: {
				min: -10000,
				max: 10000,
			},
			y: {
				min: -10000,
				max: 10000,
			},
			z: {
				min: -10000,
				max: 10000,
			},
		})
	}
}
