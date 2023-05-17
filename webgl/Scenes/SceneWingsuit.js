import { Group, PointLight, AmbientLight, AxesHelper, Vector3, MeshLambertMaterial, DoubleSide, AnimationMixer } from 'three'
import BaseScene from './BaseScene.js'
import anime from "animejs"

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

    this.characterContainer = new Group()
    this.character = this.assets.models["wingsuit_character"].scene
    this.character.scale.set(0.001, 0.001, 0.001)
    this.character.position.set(-0.01, -0.03, 0)
    // this.WebGL.debug.addInput(this.character.scale, 'x', { step: 0.001, min: 0, max: 0.02}).on('change', () => {
    //   this.character.scale.set(this.character.scale.x, this.character.scale.x, this.character.scale.x)
    // })
    // this.WebGL.debug.addInput(this.character.position, 'x', {step: 0.01, min: -2, max: 2})
    // this.WebGL.debug.addInput(this.character.position, 'y', {step: 0.01, min: -2, max: 2})
    // this.WebGL.debug.addInput(this.character.position, 'z', {step: 0.01, min: -2, max: 2})
    // play animation character
    this.mixerCharacter = new AnimationMixer(this.character);
    this.mixerCharacter.clipAction(this.assets.models["wingsuit_character"].animations[0]).play();

    this.characterContainer.add(this.character)

    // TODO remove
    this.light = new PointLight(0xffffff, 14, 12, 1)
    this.light.position.set(0, 10, 0)
    this.ambientLight = new AmbientLight(0xffffff, 0.1)
    this.scene.add(this.light, this.ambientLight)

    this.instance.add(...[this.map, this.characterContainer])
    this.scene.add(this.instance)

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)
    }
  }

  startScene() {
    // 1 - set curves for tracking camera
    this.WebGL.camera.setCurvesTracking(TRAC_CAM.WING_CURVE_PERSO, TRAC_CAM.WING_CURVE_CAM)

    // 2 - add camera to wingsuit + set position
    this.characterContainer.add(this.WebGL.camera.setCamera('fpv', new Vector3(0.1, 0.1, -0.3)))

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneWingsuit', (currentTime, dt) => {
      this.timelineValue = Math.min((this.timelineValue + dt * 0.028 * this.WebGL.camera.getSpeed(this.timelineValue)), 1)
      this.WebGL.camera.setTracking(this.timelineValue, this.characterContainer)

      // animation mixer character
      this.mixerCharacter.update(dt);
    })


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
        this.setCamera3P()
      })
    }
  }

  setCamera3P() {
    // TODO Use point from scene
    this.WebGL.camera.setCamera('3p', new Vector3(12.80, -3.6, -4.7), new Vector3(11.80, -3.6, -4.7))
  }

  //
  // animation first QTE
  //
  animationSucessQTE(callback = null) {
    // console.log('success')

    anime.timeline({
      // complete: () => {
      //   if (callback) callback()
      // }
    })
    .add({
      targets: this.character.rotation,
      z: [0, Math.PI * 2],
      delay: 200,
      duration: 2500,
      easing: 'easeInOutElastic(1.8, 2)',
      complete: () => {
        if (callback) callback()
      }
    })
    .add({
      targets: this.WebGL.camera.listCamera['fpv'].position,
      x: [0.1, 0],
      y: [0.1, 0],
      z: [-0.3, 0],
      duration: 3300,
      easing: 'easeOutQuint',
    }, 1800)
  }
  animationFailsQTE(callback = null) {
    // console.log('fails')

    const d = 300
    anime.timeline({
      complete: () => {
        if (callback) callback()
      }
    })
    .add({
      targets: this.character.rotation,
      z: Math.PI * 0.075,
      duration: d,
      easing: 'easeOutSine',
    }, 200)
    .add({
      targets: this.character.rotation,
      z: -Math.PI * 0.075,
      duration: d * 2,
      easing: 'easeInOutSine',
    }, 200 + d)
    .add({
      targets: this.character.rotation,
      z: 0,
      duration: d,
      easing: 'easeOutSine',
    }, 200 + d * 3)
  }

  //
  // DESTROY SCENE
  //
  destroyScene() {
    if (this.WebGL.debug) {
      this.debugFPV.dispose()
      this.debug3P.dispose()
    }

    RAFManager.remove('SceneWingsuit')
  }
}
