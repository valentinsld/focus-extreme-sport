import { PerspectiveCamera, Object3D, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import WebGL from './index.js'
import InstanciedSpeed from './Components/Particles/Speed/InstanciedSpeed.js'
import AudioManager from './Managers/AudioManager.js'

export default class Camera {
  constructor() {
    // Options
    this.WebGL = new WebGL()
    this.debug = this.WebGL.debug
    this.sizes = this.WebGL.sizes
    this.scene = this.WebGL.currentScene
    this.assets = this.WebGL.assets
    this.audio = new AudioManager()

    this.container = new Object3D()
    this.container.name = "CameraContainer"

    this.initPosition = {
      x: 0,
      y: 7,
      z: 7,
    }

    this.rotationCam = 0
    this.current = null
    this.listCamera = {}

    this.initCameras()
    this.setOrbitControls()

    this.setSpeedLines()
  }

  //
  // Cameras
  //
  initCameras() {
    // Camera FPV
    this.current = this.initCamera('fpv')

    // Camera 3P
    this.initCamera('3p')

    // Camera debug
    if (this.WebGL.debug) {
      this.initCamera('debug')

      this.debugFolder = this.debug.addFolder({ title: 'Cameras', expanded: false })

      this.debugFolder.addButton({
        title: 'Use Debug Camera',
      }).on('click', () => {
        const pos = new Vector3()
        this.current.getWorldPosition(pos)
        const target = (new Vector3()).copy(this.orbitControls.target)
        this.setCamera('debug', pos, target)
      })

      this.debugFolder.addSeparator();
    }
  }

  initCamera(name = 'fpv') {
    this.listCamera[name] = new PerspectiveCamera(
      name === '3p' ? 40 : 100,
      this.sizes.width / this.sizes.height,
      0.01,
      80
    )
    this.listCamera[name].name = name
    this.listCamera[name].rotation.reorder('YXZ')
    this.listCamera[name].position.copy(this.initPosition)

    return this.listCamera[name]
  }

  setCamera(name = 'fpv', position, target = undefined) {
    this.current = this.listCamera[name]
    this.WebGL.fxComposer.renderPass.camera = this.current

    if (position) {
      this.current.position.copy(position)
      this.current.rotation.x = 0
      this.current.rotation.y = 0
      this.current.rotation.z = 0
    }

    this.orbitControls.object = this.current
    this.orbitControls.target = target || this.target
    this.orbitControls.update()

    this.orbitControls.enabled = (name === 'debug')

    if (name === 'fpv') {
      this.speedLine.showLines()
      this.audio.changeGlobalVolume(1)
    } else {
      this.audio.playRandomSwitch()
      this.speedLine.hideLines()
      this.audio.changeGlobalVolume(0.15)
      this.WebGL.fxComposer.resetEffect()
    }

    return this.current
  }

  enableOrbitControlsForStickers() {
    this.orbitControls.enabled = true
    this.orbitControls.enableZoom = false
    this.orbitControls.enablePan = false
  }
  disableOrbitControl() {
    this.orbitControls.enabled = false
  }

  setOrbitControls() {
    this.orbitControls = new OrbitControls(this.current, this.WebGL.canvas)
    this.orbitControls.enabled = false
    this.orbitControls.screenSpacePanning = true
    this.orbitControls.enableKeys = false
    this.orbitControls.zoomSpeed = 0.25
    this.orbitControls.enableDamping = true
    this.target = new Vector3()
    this.orbitControls.target = this.target
    this.orbitControls.update()
  }

  //
  // Events
  //
  setSpeedLines() {
    this.speedLine = new InstanciedSpeed({
      assets: this.assets,
      camera: this.current,
      debug: this.debug
    })

    this.speedLine.container.position.z = -.05

    this.listCamera['fpv'].add(this.speedLine.container)
  }

  resize() {
    for (const name in this.listCamera) {
        const cam = this.listCamera[name];
        cam.aspect = this.sizes.ratio
        cam.updateProjectionMatrix()
    }
  }

  update(dt) {
    this.orbitControls.update()
    this.listCamera.fpv.rotation.z -= this.rotationCam

    if(this.speedLine) this.speedLine.updateParticles(dt)
  }

  destroy() {
    this.orbitControls.destroy()
  }
}
