import * as THREE from 'three'
import anime from 'animejs'
import Raf from '../Utils/Raf.js'

import WebGL from '../index.js'

export default class SceneCube {
  static singleton

  constructor(_options = {}) {
    if (SceneCube.singleton) {
      return SceneCube.singleton
    }
    SceneCube.singleton = this

    this.inView = false
    this.WebGL = new WebGL()
    this.Raf = new Raf()
    this.scene = this.WebGL.scene

    this.init()
  }

  init() {
    this.instance = new THREE.Group()

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0x00dc82,
      })
    )

    this.light = new THREE.PointLight(0xffffff, 14, 12, 1)
    this.light.position.copy(this.WebGL.camera.initPosition)

    this.instance.add(...[this.light, this.cube])
    this.scene.add(this.instance)
  }

  //
  // Animation
  //
  entered() {
    this.inView = true
    this.Raf.suscribe('rotateCube', this.animRotation.bind(this))
  }

  animRotation(e) {
    this.cube.rotation.x = e * 0.4
    this.cube.rotation.y = e * 0.2
  }

  exit() {
    this.inView = false
    this.Raf.unsuscribe('rotateCube', this.animRotation.bind(this))
  }

  //
  // centerCamera
  //
  centerCamera(duration = 1500) {
    const camera = this.WebGL.camera.instance
    const orbitControls = this.WebGL.camera.orbitControls

    anime({
      targets: camera.position,
      x: this.instance.position.x,
      y: 7,
      z: 7,
      easing: 'easeOutQuart',
      duration,
    })
    anime({
      targets: orbitControls.target,
      ...this.instance.position,
      easing: 'easeOutQuart',
      duration,
    })
  }
}
