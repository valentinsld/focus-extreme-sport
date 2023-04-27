import WebGL from '../index.js'

export default class BaseScene {
  static singleton

  constructor() {
    this.inView = false
    this.WebGL = new WebGL()
    this.assets = this.WebGL.assets

    this.timelineValue = 0
  }

  //
  // Event for scene
  //
  startScene() {
    console.log('You start the scene ' + this.scene.name);
  }

  destroyScene() {
    console.log('You destroy the scene ' + this.scene.name);
  }
}
