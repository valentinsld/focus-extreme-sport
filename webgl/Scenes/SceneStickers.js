import { Group, AmbientLight } from 'three'
import Background from '../Components/Background.js'
import BaseScene from './BaseScene.js'
import anime from 'animejs'

const LIST_STICKERS = [
  '1_WINGSUIT',
  '2_WINGSUIT',
  '3_WINGSUIT',
  '1_SKI',
  '2_SKI',
  '3_SKI',
  '1_KAYAK',
  '2_KAYAK',
  '3_KAYAK',
  '0_LIKE_A_BOSS'
]

export default class SceneStickers extends BaseScene {
  static singleton

  constructor() {
    if (SceneStickers.singleton) {
      return SceneStickers.singleton
    }
    super() // must be before this
    SceneStickers.singleton = this

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
    this.helmet.scale.set(0.0, 0.0, 0.0)
    this.helmet.visible = false

    this.stickers = {}
    for (const s of LIST_STICKERS) {
      this.stickers[s] = this.helmet.getObjectByName(s)

      this.stickers[s].material.transparent = true
      this.stickers[s].material.opacity = 0
      console.log(this.stickers[s].material)
    }

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

  //
  // EVENTS
  //
  seeHelmet() {
    this.helmet.visible = true

    anime({
      targets: this.helmet.scale,
      x: 1,
      y: 1,
      z: 1,
      duration: 4000,
      ease: 'easeOutElastic',
    })
    anime({
      targets: this.helmet.rotation,
      y: Math.PI * 2,
      duration: 4000,
      ease: 'easeOutElastic',
    })
  }

  seeStickers(stickers) {
    console.log('seeStickers', stickers)

    const arrayMaterial = []
    for (const key in this.stickers) {
      const element = this.stickers[key];
      arrayMaterial.push(element.material)
    }

    anime({
      targets: this.helmet.rotation,
      y: Math.PI * 6,
      duration: 4000,
      ease: 'easeOutElastic',
    })
    anime({
      targets: arrayMaterial,
      opacity: 1,
      duration: 1000,
      ease: 'easeOutElastic',
    })
  }

  destroyScene() {
    if (this.bkg) this.bkg.destroy()
    this.WebGL.camera.speedLine.showLines()
  }
}
