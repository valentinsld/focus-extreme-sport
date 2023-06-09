import { Group, PointLight, AxesHelper, Vector3 } from 'three'
import BaseScene from './BaseScene.js'

import TRAC_CAM from '@/assets/modelsCurves/kayak.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../Components/Quote.js'
import { DegToRad } from '../Utils/Math.js'

import datas from "~~/webgl/data/data.json"

const CAM_3P_1 = {
  x: 2.48,
  y: 0.5,
  z: -2.01,
}

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
    this.map = this.assets.models["kayak_map"].scene
    this.kayak = new Group()
    const kayak = this.assets.models["kayak"].scene
    kayak.scale.set(0.022, 0.022, 0.022)
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
    this.quote.container.position.set(0.66, -1.05, -11.20)
    this.quote.container.rotation.y = DegToRad(145)
    this.quote.container.scale.set(.0005, .0005, .0005)
    this.quote.hideQuote()

    this.instance.add(...[this.light, this.map, this.kayak, this.quote.container])
    this.scene.add(this.instance)

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)

      // this.debugQuotePosition = this.WebGL.debug.addInput(this.quote.container, 'position', { step: 0.01 })
    }
  }

  startScene() {
    // 1 - set curves for tracking camera
    this.setCurvesTracking(TRAC_CAM.CURVE_PERSO, TRAC_CAM.CURVE_TARGET, datas.altitude['kayak'].max, datas.altitude['kayak'].min)

    // 2 - add camera to kayak + set position
    this.kayak.add(this.WebGL.camera.setCamera('fpv', new Vector3(0, 0.06, 0)))

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneKayak', (currentTime, dt) => {
      this.timelineValue = (this.timelineValue + dt * 0.022)
      this.setTracking(this.timelineValue, this.kayak)
    })

    // play audio
    this.audioManager.play('kayak-global', true, 1, 3500)

    if (this.WebGL.debug) {
      const cameraDebugFolder = this.WebGL.camera.debugFolder

      this.debugFPV = cameraDebugFolder.addButton({
        title: 'Switch POV',
      }).on('click', () => {
        this.WebGL.camera.setCamera('fpv')
      })

      this.debug3P = cameraDebugFolder.addButton({
        title: 'Switch 3P _1',
      }).on('click', () => {
        this.setCamera3P_1()
      })

      this.debug3P = cameraDebugFolder.addButton({
        title: 'Switch 3P finish',
      }).on('click', () => {
        this.setCamera3P_finish()
      })

      this.cam3p = cameraDebugFolder.addInput(this.WebGL.camera.listCamera['3p'], 'position', {step: 0.01})
    }
  }

  //
  // Cams
  //
  setCamera3P_1() {
    this.WebGL.camera.setCamera('3p', CAM_3P_1, this.kayak.position)
    this.cam3p?.refresh()
  }
  setCamera3P_finish() {
    this.WebGL.camera.setCamera('3p', this.map.getObjectByName('CAM_F').position, this.map.getObjectByName('CAM_F_TARGET').position)
    this.cam3p?.refresh()
    this.quote.showQuote()
  }

  destroyScene() {
    if (this.WebGL.debug) {
      this.debugFPV.dispose()
      this.debug3P.dispose()

      this.cam3p.dispose()
      // this.debugQuotePosition.dispose()
    }

    this.audioManager.stop('kayak-global', 2000)

    RAFManager.remove('SceneKayak')
  }
}
