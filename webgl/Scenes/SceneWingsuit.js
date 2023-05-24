import { Group, AmbientLight, AxesHelper, Vector3, AnimationMixer } from 'three'
import BaseScene from './BaseScene.js'
import anime from "animejs"

import TRAC_CAM from '@/assets/modelsCurves/wingsuit.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../Components/Quote.js'

const CLEAR_COLOR = 0x93CBE5

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
    // MAP
    this.map = this.assets.models["wingsuit_map"].scene

    // character
    this.characterContainer = new Group()
    this.character = this.assets.models["wingsuit_character"].scene
    this.character.scale.set(0.001, 0.001, 0.001)
    this.character.position.set(-0.01, -0.03, 0)
    this.mixerCharacter = new AnimationMixer(this.character);
    this.mixerCharacter.clipAction(this.assets.models["wingsuit_character"].animations[0]).play();
    this.characterContainer.add(this.character)

    // light
    this.ambientLight = new AmbientLight(CLEAR_COLOR, 0.7)

    // position camera 3p
    this.map.getObjectByName('CAM_F').position.y += 0.05
    this.map.getObjectByName('CAM_2').position.y -= 0.9

    // add quote
    this.quote = new QuoteBlock({
      contentWidth: 1000,
      contentLineHeight: 50,
      quoteContent: 'Quand on est en vitesse moyenne, on est autour des 200 kilomètres heure, mais si on prend de la vitesse on peut passer les 250 donc ça va très vite',

      authorWidth: 1000,
      quoteAuthor: 'Fred Fugen',
      authorColor: '#C4FE1F',

      jobWidth: 1000,
      quoteJob: 'Spécialiste de la chute libre',
    })
    this.quote.container.position //.set(17.48, -5, -4.89)
      .copy(this.map.getObjectByName('CAM_F_TARGET').position)
      .sub(new Vector3(-0.54, 0.5, 0.081))

    this.quote.container.rotation.y = 1.53
    this.quote.container.scale.set(.0005, .0005, .0005)
    this.quote.hideQuote()

    // add to scene
    this.scene.add(...[this.map, this.characterContainer, this.ambientLight, this.quote.container])

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)
    }
  }

  startScene() {
    // 1 - set curves for tracking camera
    this.setCurvesTracking(TRAC_CAM.CURVE_CAM, TRAC_CAM.CURVE_TARGET, 4000, 2600)

    // 2 - add camera to wingsuit + set position
    this.characterContainer.add(this.WebGL.camera.setCamera('fpv', new Vector3(0.1, 0.1, -0.3)))

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneWingsuit', (currentTime, dt) => {
      this.timelineValue = Math.min((this.timelineValue + dt * 0.028 * this.getSpeed(this.timelineValue)), 1)
      this.setTracking(this.timelineValue, this.characterContainer)

      // animation mixer character
      this.mixerCharacter.update(dt);
    })

    // set clearColor scene
    this.WebGL.renderer.instance.setClearColor(CLEAR_COLOR, 1)

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

  setCamera3P_2() {
    this.WebGL.camera.setCamera('3p', this.map.getObjectByName('CAM_2').position, this.map.getObjectByName('CAM_2_TARGET').position)

    anime({
      targets: this.map.getObjectByName('CAM_2_TARGET').position,
      x: '+=1.5',
      delay: 500,
      duration: 2000,
      easing: 'easeOutSine'
    })
  }
  setCamera3P() {
    this.WebGL.camera.setCamera('3p', this.map.getObjectByName('CAM_F').position, this.map.getObjectByName('CAM_F_TARGET').position)
    this.quote.showQuote()
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
    .add({
      targets: this.WebGL.camera.listCamera['fpv'].position,
      x: [0.1, 0],
      y: [0.1, 0],
      z: [-0.3, 0],
      duration: 3300,
      easing: 'easeOutQuint',
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
