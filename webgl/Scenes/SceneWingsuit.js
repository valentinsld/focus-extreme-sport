import { Group, PointLight, AxesHelper, Vector3, MeshLambertMaterial, DoubleSide } from 'three'
import BaseScene from './BaseScene.js'

import TRAC_CAM from '@/assets/modelsCurves/wingsuit.json'
import RAFManager from '../Utils/RAFManager.js'

export default class SceneWingsuit extends BaseScene {
  static singleton

  constructor() {
    if (SceneWingsuit.singleton) {
      return SceneWingsuit.singleton
    }
    super() // must be before this
    SceneWingsuit.singleton = this

    this.scene = this.WebGL.sceneWingsuit

    this.init()
  }

  init() {
    console.log('INIT SCENE WINGSUIT')
    this.instance = new Group()

    this.map = this.assets.models["wingsuit_map"].scene
    // TODO remove
    const LanscapeMaterial = new MeshLambertMaterial({
      color: 0xffffff,
      side: DoubleSide
    })
    this.map.traverse((obj) => {
      if (obj.name.includes("Landscape")) {
        obj.material = LanscapeMaterial
      }
    })

    this.character = new Group()
    // const character = this.assets.models["wingsuit_character"].scene
    // this.character.add(character)

    this.light = new PointLight(0xffffff)
    this.character.add(this.light)

    this.instance.add(...[this.map, this.character])
    this.scene.add(this.instance)

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)
    }
  }

  startScene() {
    console.log('You start the scene ' + this.scene.name);

    // 1 - set curves for tracking camera
    this.WebGL.camera.setCurvesTracking(TRAC_CAM.WING_CURVE_PERSO, TRAC_CAM.WING_CURVE_CAM)

    // 2 - add camera to kayak + set position
    this.character.add(this.WebGL.camera.setCamera('fpv', new Vector3(0, 0.06, 0)))

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneWingsuit', (currentTime, dt) => {
      this.timelineValue = (this.timelineValue + dt * 0.03) % 1
      this.WebGL.camera.setTracking(this.timelineValue, this.character)
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

    RAFManager.remove('SceneWingsuit')
  }
}
