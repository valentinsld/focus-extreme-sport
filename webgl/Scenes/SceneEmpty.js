/* eslint-disable @typescript-eslint/no-empty-function */
import BaseScene from './BaseScene.js'

export default class SceneEmpty extends BaseScene {
  static singleton

  constructor() {
    if (SceneEmpty.singleton) {
      return SceneEmpty.singleton
    }
    super() // must be before this
    SceneEmpty.singleton = this

    this.scene = this.WebGL.sceneEmpty

    this.init()
  }

  init() {}

  startScene() {
    this.WebGL.renderer.instance.setClearColor(0xffffff, 1)
  }

  destroyScene() {}
}
