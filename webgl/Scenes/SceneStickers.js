import { Group, AmbientLight } from 'three'
import Background from '../Components/Background.js'
import BaseScene from './BaseScene.js'

export default class SceneHome extends BaseScene {
  static singleton

  constructor() {
    if (SceneHome.singleton) {
      return SceneHome.singleton
    }
    super() // must be before this
    SceneHome.singleton = this

    this.scene = this.WebGL.sceneStickers
    this.assets = this.WebGL.assets
    this.camPos = this.WebGL.camera.container.position

    this.instance = new Group()
    this.scene.add(this.instance)

    this.init()
  }

  init() {
    // bkg
    this.bkg = new Background({
      hasParticles: false
    })

    this.bkg.instance.position.set(0, 0, -10)
    this.bkg.instance.scale.set(1.5, 1.5, 1.5)

    // helmet
    this.helmet = this.assets.models.helmet.scene

    // lights
    this.ambientLight = new AmbientLight(0xffffff, 1)

    this.instance.add(this.helmet,this.ambientLight)
  }

  startScene() {
    this.WebGL.renderer.instance.setClearColor(0xffffff, 1)

    this.WebGL.camera.target.set(0, 0, 0)
    this.WebGL.camera.current.position.set(0, 3, 3)
    this.instance.add(this.WebGL.camera.current)
    this.WebGL.camera.enableOrbitControls()

    this.bkg.initOnScene()

    // disable lines
    this.WebGL.camera.speedLine.hideLines()
  }

  playDisableWhite() {
    this.bkg.playDisableWhite()
  }
  playDark() {
    this.bkg.playDark()
  }

  destroyScene() {
    if (this.bkg) this.bkg.destroy()
    this.WebGL.camera.speedLine.showLines()
  }
}
