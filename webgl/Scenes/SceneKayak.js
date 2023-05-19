import { Group, PointLight, AxesHelper, Vector3 } from 'three'
import WebGL from '../index.js'

import TRAC_CAM from '@/assets/modelsCurves/river.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../components/Quote.js'

import GothamAtlas from '~~/assets/MSDFfonts/Gotham-BookItalic.png'
import GothamFNT from '~~/assets/MSDFfonts/Gotham-BookItalic.json'
export default class SceneIntro {
  static singleton

  constructor() {
    if (SceneIntro.singleton) {
      return SceneIntro.singleton
    }
    SceneIntro.singleton = this

    this.inView = false
    this.WebGL = new WebGL()
    this.scene = this.WebGL.sceneKayak
    this.assets = this.WebGL.assets

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
      contentLineHeight: 40,
      quoteContent: '\" [Tu sais jamais ce qu\'il y a comme rapide,] c\'est bien d\'avoir peur, c\'est un super voyant qui permet de rester concentré. Je reste contente d\'avoir peur, ça te sauve la vie. \"',

      authorWidth: 1000,
      quoteAuthor: 'NOURIA NEWMAN',

      jobWidth: 1000,
      quoteJob: 'Kayakiste professionnelle',
    })
    this.quote.container.position.set(0, .5, 0)
    this.quote.container.scale.set(.001, .001, .001)

    this.instance.add(...[this.light, this.map, this.kayak, this.quote.container])
    this.scene.add(this.instance)

    this.WebGL.camera.setSpeedLines()

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)
    }
  }

  startScene() {
    console.log('You start the scene ' + this.scene.name);

    // 1 - set curves for tracking camera
    this.WebGL.camera.setCurvesTracking(TRAC_CAM.KAYAK_CURVE, TRAC_CAM.TRACKING_CURVE)

    // 2 - add camera to kayak + set position
    this.kayak.add(this.WebGL.camera.setCamera('fpv', new Vector3(0, 0.06, 0)))

    // 3- init animation with percent
    this.percent = 0
    RAFManager.add('sceneIntro', (currentTime, dt) => {
      this.percent = (this.percent + dt * 0.03) % 1
      this.WebGL.camera.setTracking(this.percent, this.kayak)
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
    //TODO : add function to destroy the scene (spline, RAFremove, etc..)
    console.log('You destroy the scene ' + this.scene.name);

    RAFManager.remove('sceneIntro')
  }
}
