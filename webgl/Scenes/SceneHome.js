import { Group } from 'three'
import BaseScene from './BaseScene.js'

export default class SceneHome extends BaseScene {
  static singleton

  constructor() {
    if (SceneHome.singleton) {
      return SceneHome.singleton
    }
    super() // must be before this
    SceneHome.singleton = this

    this.scene = this.WebGL.sceneHome
    this.assets = this.WebGL.assets
    this.camPos = this.WebGL.camera.container.position

    this.init()
  }

  init() {
    this.instance = new Group()

    // TODO : scene

    this.scene.add(this.instance)
  }

  startScene() {
    this.WebGL.camera.target.set(0, 0, 0)
    this.WebGL.camera.current.position.copy(this.WebGL.camera.initPosition)
    this.instance.add(this.WebGL.camera.current)

    // disable lines
    this.WebGL.camera.speedLine.hideLines()
  }

  destroyScene() {
    this.WebGL.camera.speedLine.showLines()
  }
}
