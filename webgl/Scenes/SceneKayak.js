import { Group, PointLight, AxesHelper } from 'three'
import WebGL from '../index.js'

import TRAC_CAM from '@/assets/modelsCurves/river.json'
import RAFManager from '../Utils/RAFManager.js'


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

    this.instance.add(...[this.light, this.map, this.kayak])
    this.scene.add(this.instance)

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)
    }
  }

  startScene() {
    console.log('You start the scene ' + this.scene.name);

    // set curves for tracking camera
    this.WebGL.camera.setCurvesTracking(TRAC_CAM.KAYAK_CURVE, TRAC_CAM.TRACKING_CURVE)

    // add camera to kayak + set position
    this.kayak.add(this.WebGL.camera.instance)
    this.WebGL.camera.instance.position.set(0, 0.06, 0)

    // init animation with percent
    this.percent = 0
    RAFManager.add('sceneIntro', (currentTime, dt) => {
      this.percent = (this.percent + dt * 0.03) % 1
      this.WebGL.camera.setTracking(this.percent, this.kayak)
    })
  }

  destroyScene() {
    //TODO : add function to destroy the scene (spline, RAFremove, etc..)
    console.log('You destroy the scene ' + this.scene.name);

    RAFManager.remove('sceneIntro')
  }
}
