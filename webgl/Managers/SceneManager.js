import WebGL from '../index'

export default class SceneManager {
	static singleton

	constructor() {
		if (SceneManager.singleton) {
			return SceneManager.singleton
		  }
		SceneManager.singleton = this

		this.webgl = new WebGL()

		this.currentSceneName = 'home'
		this.scenes = this.webgl.sceneArray
		this.oldScene = null
		this.currentScene = this.webgl.currentScene
	}

	startCurrentScene() {
		this.setScene(this.currentSceneName)
	}

	setScene(scene, pauseDelay = .35) {
		this.currentSceneName = scene
		const lowerCase = scene.toLowerCase()
		const newScene = this.scenes.find((scene) => scene.name === lowerCase)
		this.oldScene = this.webgl.currentScene

		if(this.webgl.sceneTransi.scene) {
			this.webgl.sceneTransi.scene.container.children[0].material.animationIn()

			setTimeout(() => {
				this.webgl.sceneTransi.scene.container.children[0].material.animationOut()
				this.webgl.currentScene = newScene
				this.webgl.camera.scene = newScene
				this.webgl.renderer.scene = newScene
				if(this.oldScene.scene && this.oldScene.name !== this.currentSceneName) this.oldScene.scene.destroyScene()
				if(newScene.scene) newScene.scene.startScene()
			}, (this.webgl.sceneTransi.scene.container.children[0].material.duration + pauseDelay) * 1000)
		}
	}
}
