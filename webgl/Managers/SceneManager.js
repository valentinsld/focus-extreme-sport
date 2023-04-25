import WebGL from '../index'

export default class SceneManager {
	static singleton

	constructor() {
		if (SceneManager.singleton) {
			return SceneManager.singleton
		  }
		SceneManager.singleton = this

		this.webgl = new WebGL()

		this.scenes = this.webgl.sceneArray
		this.oldScene = null
		this.currentScene = this.webgl.currentScene
	}

	setScene(scene, pauseDelay = .35) {
		const capitalized = scene.charAt(0).toUpperCase() + scene.slice(1)
		const newScene = this.scenes.find((scene) => scene.name === capitalized)
		this.oldScene = this.webgl.currentScene

		if(newScene.scene) newScene.scene.startScene()

		if(this.webgl.sceneTransi.scene) {
			this.webgl.sceneTransi.scene.container.children[0].material.animationIn()

			setTimeout(() => {
				this.webgl.sceneTransi.scene.container.children[0].material.animationOut()
				this.webgl.currentScene = newScene
				this.webgl.camera.scene = newScene
				this.webgl.renderer.scene = newScene
				if(this.oldScene.scene) this.oldScene.scene.destroyScene()
			}, (this.webgl.sceneTransi.scene.container.children[0].material.duration + pauseDelay) * 1000)

		}

	}
}
