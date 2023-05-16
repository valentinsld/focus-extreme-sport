import { Group, Mesh, PointLight } from 'three'
import RAFManager from '../Utils/RAFManager.js'

import WebGL from '../index.js'

export default class SceneHome {
  static singleton

  constructor() {
    if (SceneHome.singleton) {
      return SceneHome.singleton
    }
    SceneHome.singleton = this

    this.inView = false
    this.WebGL = new WebGL()
    this.scene = this.WebGL.sceneHome
    this.assets = this.WebGL.assets

    this.init()
  }

  init() {
    this.instance = new Group()

    this.testCD = this.assets.models["cd-02"].scene

    this.mesh = new Mesh()
    this.mesh.add(this.testCD)

    this.mesh.rotation.y = Math.PI / 2

    this.light = new PointLight(0xffffff, 14, 12, 1)
    this.light.position.copy(this.WebGL.camera.initPosition)

    this.instance.add(...[this.light, this.mesh])
    this.scene.add(this.instance)
  }

  //
  // Animation
  //
  animRotation(time) {
    this.mesh.rotation.x = time
    this.mesh.rotation.y = time * 0.8
  }

  startScene() {
    //TODO : add function to start the scene (spline, RAFadd, etc..)
    console.log('You start the scene' + this.scene.name);

    this.WebGL.camera.target.set(0, 0, 0)
    this.WebGL.camera.current.position.copy(this.WebGL.camera.initPosition)
    this.instance.add(this.WebGL.camera.current)

    // RAFManager.add("SceneHome", this.animRotation.bind(this))
  }

  destroyScene() {
    //TODO : add function to destroy the scene (spline, RAFremove, etc..)
    console.log('You destroy the scene' + this.scene.name);
    // RAFManager.remove("SceneHome")
  }
}
