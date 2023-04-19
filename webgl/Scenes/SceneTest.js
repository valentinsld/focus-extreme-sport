import { Group, Mesh, PointLight } from 'three'
import RAFManager from '../Utils/RAFManager.js'

import WebGL from '../index.js'

export default class SceneTest {
  static singleton

  constructor(_options = {}) {
    if (SceneTest.singleton) {
      return SceneTest.singleton
    }
    SceneTest.singleton = this

    this.inView = false
    this.WebGL = new WebGL()
    this.scene = this.WebGL.scene
    this.assets = _options.assets

    this.init()
  }

  init() {
    this.instance = new Group()

    // this.cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshPhysicalMaterial({
    //     color: 0x00dc82,
    //   })
    // )
    this.testCD = this.assets.models["cd-02"].scene

    this.mesh = new Mesh()
    this.mesh.add(this.testCD)

    this.mesh.rotation.y = Math.PI / 2

    this.light = new PointLight(0xffffff, 14, 12, 1)
    this.light.position.copy(this.WebGL.camera.initPosition)

    this.instance.add(...[this.light, this.mesh])
    this.scene.add(this.instance)

    RAFManager.add("SceneTest", this.animRotation.bind(this))
  }

  //
  // Animation
  //
  animRotation(time) {
    this.mesh.rotation.x = time
    this.mesh.rotation.y = time * 0.8
  }
}
