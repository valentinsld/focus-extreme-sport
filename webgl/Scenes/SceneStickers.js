import { Group, AmbientLight } from 'three'
import Background from '../Components/Background.js'
import BaseScene from './BaseScene.js'

import MSDFText from '../Components/MSDFText.js'
import TuskerAtlas from '~~/assets/MSDFfonts/TuskerGrotesk-2500Medium.png'
import TuskerFNT from '~~/assets/MSDFfonts/TuskerGrotesk-2500Medium-msdf.json'

import anime from 'animejs'

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

    this.stickers = {
      wingsuit: [
        this.helmet.getObjectByName('1_WINGSUIT'),
        this.helmet.getObjectByName('2_WINGSUIT'),
        this.helmet.getObjectByName('3_WINGSUIT')
      ],
      ski: [
        this.helmet.getObjectByName('1_SKI'),
        this.helmet.getObjectByName('2_SKI'),
        this.helmet.getObjectByName('3_SKI')
      ],
      kayak: [
        this.helmet.getObjectByName('1_KAYAK'),
        this.helmet.getObjectByName('2_KAYAK'),
        this.helmet.getObjectByName('3_KAYAK')
      ],
      like_a_boss: this.helmet.getObjectByName('0_LIKE_A_BOSS')
    }
    for (const key in this.stickers) {
      const element = this.stickers[key];

      if (element.isMesh) {
        element.material.transparent = true
        element.material.opacity = 0
      } else {
        for (let i = 0; i < element.length; i++) {
          element[i].material.transparent = true
          element[i].material.opacity = 0
        }
      }
    }

    // text
    this.text = new MSDFText({
      font: TuskerFNT,
      atlas: TuskerAtlas,
      text: 'REWARDS',
      lineHeight: 0,
      width: 100,
      align: 'center',
      color: '#000000',
      hasStroke: true,
    }, (that) => {
      const box = that.mesh.geometry.computeBoundingBox()
      that.mesh.position.x -= (box.min.x + box.max.x) / 2
      that.mesh.position.y -= (box.min.y + box.max.y) / 2
    });
    this.text.container.scale.set(0.3, 0.3, 0.3)
    this.text.container.position.set(0, 0, -8)

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

    this.WebGL.camera.current.add(this.text.container)

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

  seeStickers(stickers, duration = 4000, delay = 300) {
    const arrayMaterialEdited = []
    for (const key in this.stickers) {
      const element = this.stickers[key];

      if (element.isMesh) {
        if (stickers.like_a_boss) {
          arrayMaterialEdited.push(element.material)
        }
      } else {
        for (let i = 0; i < stickers[key].length; i++) {
          const index = Number(stickers[key][i]) - 1;

          arrayMaterialEdited.push(element[index].material)
        }
      }
    }

    anime({
      targets: this.helmet.rotation,
      y: Math.PI * 6,
      duration,
      delay,
      ease: 'easeOutElastic',
    })
    anime({
      targets: arrayMaterialEdited,
      opacity: 1,
      duration: duration * 0.2,
      delay,
      ease: 'easeOutElastic',
    })
  }

  destroyScene() {
    if (this.bkg) this.bkg.destroy()
    this.WebGL.camera.speedLine.showLines()
  }
}
