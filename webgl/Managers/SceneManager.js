import WebGL from '../index'
import RAFManager from '../Utils/RAFManager'

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

	setScene(scene, pauseDelay = .35, onTransitionEnd = null) {
		this.currentSceneName = scene
		const lowerCase = scene.toLowerCase()
		const newScene = this.scenes.find((scene) => scene.name === lowerCase)
		this.oldScene = this.webgl.currentScene

		if (this.oldScene.name === newScene.name) {
			if(this.oldScene.scene) this.oldScene.scene.destroyScene()
			if(newScene.scene) {
				newScene.scene.startScene()
				RAFManager.setSpeed(1) // reset RAF speed
				this.webgl.camera.setCamera() // reset FPV camera
			}
			return
		}
		if(this.webgl.sceneTransi.scene) {

			if(this.oldScene.name === 'home') {

				this.webgl.currentScene = newScene
				this.webgl.camera.scene = newScene
				this.webgl.renderer.scene = newScene
				if(this.oldScene.scene) this.oldScene.scene.destroyScene()
				if(newScene.scene) {
					newScene.scene.startScene()
					if (onTransitionEnd) onTransitionEnd(newScene.scene)
				}
			} else {

				this.webgl.sceneTransi.scene.container.children[0].material.animationIn()

				setTimeout(() => {
					this.webgl.currentScene = newScene
					this.webgl.camera.scene = newScene
					this.webgl.renderer.scene = newScene
					if(this.oldScene.scene) this.oldScene.scene.destroyScene()
					if(newScene.scene) newScene.scene.startScene()
				}, (this.webgl.sceneTransi.scene.container.children[0].material.duration + pauseDelay * 0.1) * 1000)
				setTimeout(() => {
					this.webgl.sceneTransi.scene.container.children[0].material.animationOut()
				}, (this.webgl.sceneTransi.scene.container.children[0].material.duration + pauseDelay) * 1000)

			}

		}
	}
}
