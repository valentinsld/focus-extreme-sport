import { Group, PointLight, AxesHelper, Vector3 } from 'three'
import BaseScene from './BaseScene.js'

import TRAC_CAM from '@/assets/modelsCurves/river.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../Components/Quote.js'
import { DegToRad } from '../Utils/Math.js'

export default class SceneKayak extends BaseScene {
  static singleton

  constructor() {
    if (SceneKayak.singleton) {
      return SceneKayak.singleton
    }
    super() // must be before this
    SceneKayak.singleton = this

    this.scene = this.WebGL.sceneKayak

    this.init()
  }

  init() {
    this.instance = new Group()

    this.map = this.assets.models["river"].scene
    this.kayak = new Group()
    const kayak = this.assets.models["kayak"].scene
    kayak.scale.set(0.03, 0.03, 0.03)
    this.kayak.add(kayak)

    this.light = new PointLight(0xffffff, 14, 12, 1)
    this.light.position.copy(this.WebGL.camera.initPosition)

    this.quote = new QuoteBlock({
      contentWidth: 1000,
      contentLineHeight: 50,
      quoteContent: '\" [Tu sais jamais ce qu\'il y a comme rapide,] c\'est bien d\'avoir peur, c\'est un super voyant qui permet de rester concentré. Je reste contente d\'avoir peur, ça te sauve la vie. \"',

      authorWidth: 1000,
      quoteAuthor: 'NOURIA NEWMAN',
      authorColor: '#C4FE1F',

      jobWidth: 1000,
      quoteJob: 'Kayakiste professionnelle',
    })
    this.quote.container.position.set(0, -1.25, -5)
    this.quote.container.rotation.y = DegToRad(115)
    this.quote.container.scale.set(.0005, .0005, .0005)

    this.instance.add(...[this.light, this.map, this.kayak, this.quote.container])
    this.scene.add(this.instance)

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)
    }
  }

  startScene() {
    // 1 - set curves for tracking camera
    this.WebGL.camera.setCurvesTracking(TRAC_CAM.KAYAK_CURVE, TRAC_CAM.TRACKING_CURVE)

    // 2 - add camera to kayak + set position
    this.kayak.add(this.WebGL.camera.setCamera('fpv', new Vector3(0, 0.06, 0)))

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneKayak', (currentTime, dt) => {
      this.timelineValue = (this.timelineValue + dt * 0.03) % 1
      this.WebGL.camera.setTracking(this.timelineValue, this.kayak)
    })

    // 4 - switch to camera 3p
    // this.WebGL.camera.setCamera('3p', new Vector3(0, 2, 0), this.kayak.position)

    if (this.WebGL.debug) {
      const cameraDebugFolder = this.WebGL.camera.debugFolder

      this.debugFPV = cameraDebugFolder.addButton({
        title: 'Switch POV',
      }).on('click', () => {
        this.WebGL.camera.setCamera('fpv')
      })

      this.debug3P = cameraDebugFolder.addButton({
        title: 'Switch 3P',
      }).on('click', () => {
        this.WebGL.camera.setCamera('3p', new Vector3(0, 2, 0), this.kayak.position)
      })
    }
  }

  destroyScene() {
    RAFManager.remove('SceneKayak')
  }
}
