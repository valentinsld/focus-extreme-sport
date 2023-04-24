import { Group, Mesh, PointLight, BoxGeometry, MeshPhysicalMaterial } from 'three'
import RAFManager from '../Utils/RAFManager.js'

import WebGL from '../index.js'

export default class SceneIntro {
  static singleton

  constructor() {
    if (SceneIntro.singleton) {
      return SceneIntro.singleton
    }
    SceneIntro.singleton = this

    this.inView = false
    this.WebGL = new WebGL()
    this.scene = this.WebGL.sceneIntro
    this.assets = this.WebGL.assets

    this.init()
  }

  init() {
    this.instance = new Group()

    this.cube = new Mesh(
      new BoxGeometry(2, 2, 2),
      new MeshPhysicalMaterial({
        color: 0x00dc82,
      })
    )

    this.light = new PointLight(0xffffff, 14, 12, 1)
    this.light.position.copy(this.WebGL.camera.initPosition)

    this.instance.add(...[this.light, this.cube])
    this.scene.add(this.instance)
  }

  //
  // Animation
  //
  animRotation(time) {
    this.cube.rotation.x = time
    this.cube.rotation.y = time * 0.8
  }

  startScene() {
    //TODO : add function to start the scene (spline, RAFadd, etc..)
    console.log('You start the scene' + this.scene.name);
    RAFManager.add("SceneIntro", this.animRotation.bind(this))
  }

  destroyScene() {
    //TODO : add function to destroy the scene (spline, RAFremove, etc..)
    console.log('You destroy the scene' + this.scene.name);
    RAFManager.remove("SceneIntro")
  }
}
