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

	setScene(scene, pauseDelay = .35, onTransitionEnd = null) {
		this.currentSceneName = scene
		const lowerCase = scene.toLowerCase()
		const newScene = this.scenes.find((scene) => scene.name === lowerCase)
		this.oldScene = this.webgl.currentScene

		if (this.oldScene.name === newScene.name) {
			if(this.oldScene.scene) this.oldScene.scene.destroySceneMain()
			if(newScene.scene) newScene.scene.startSceneMain()
			return
		}
		if(this.webgl.sceneTransi.scene) {

			if(this.oldScene.name === 'home') {

				this.webgl.currentScene = newScene
				this.webgl.camera.scene = newScene
				this.webgl.renderer.scene = newScene
				this.webgl.fxComposer.renderPass.scene = newScene
				if(this.oldScene.scene) this.oldScene.scene.destroySceneMain()
				if(newScene.scene) {
					newScene.scene.startSceneMain()
					if (onTransitionEnd) onTransitionEnd(newScene.scene)
				}
			} else {

				this.webgl.fxComposer.animationIn()

				setTimeout(() => {
					this.webgl.currentScene = newScene
					this.webgl.camera.scene = newScene
					this.webgl.renderer.scene = newScene
					this.webgl.fxComposer.renderPass.scene = newScene
					if(this.oldScene.scene) this.oldScene.scene.destroySceneMain()
					if(newScene.scene) {
						newScene.scene.startSceneMain()
						if (onTransitionEnd) onTransitionEnd(newScene.scene)
					}
				}, (this.webgl.fxComposer.duration + pauseDelay * 0.1))
				setTimeout(() => {
					this.webgl.fxComposer.animationOut()
				}, (this.webgl.fxComposer.duration + pauseDelay))

			}

		}
	}
}
