import { PerspectiveCamera, Object3D } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import WebGL from './index.js'

export default class Camera {
  constructor() {
    // Options
    this.WebGL = new WebGL()
    this.debug = this.WebGL.debug
    this.sizes = this.WebGL.sizes
    this.scene = this.WebGL.currentScene

    this.container = new Object3D()
    this.container.name = "CameraContainer"

    this.initPosition = {
      x: 0,
      y: 7,
      z: 7,
    }

    this.setInstance()
    this.setOrbitControls()
  }

  setInstance() {
    // Set up
    this.instance = new PerspectiveCamera(
      25,
      this.sizes.width / this.sizes.height,
      0.1,
      150
    )
    this.instance.rotation.reorder('YXZ')
    this.instance.position.copy(this.initPosition)
    this.container = this.instance
    this.scene.add(this.container)
  }

  setOrbitControls() {
    this.orbitControls = new OrbitControls(this.instance, this.WebGL.canvas)
    this.orbitControls.enabled = Boolean(this.debug)
    this.orbitControls.screenSpacePanning = true
    this.orbitControls.enableKeys = false
    this.orbitControls.zoomSpeed = 0.25
    this.orbitControls.enableDamping = true
    this.orbitControls.update()
  }

  resize() {
    this.instance.aspect = this.sizes.ratio
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.orbitControls.update()
  }

  destroy() {
    this.orbitControls.destroy()
  }
}
