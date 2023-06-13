import { Group, AmbientLight, AxesHelper, Vector3, Mesh, BoxGeometry, MeshBasicMaterial } from 'three'
import BaseScene from './BaseScene.js'
import anime from "animejs"

import TRAC_CAM from '@/assets/modelsCurves/ski.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../Components/Quote.js'

import datas from "~~/webgl/data/data.json"

const CLEAR_COLOR = 0x93CBE5

const CAM_F = new Vector3(19.8, 1.85, 4.1)
const QUOTE_POS = new Vector3(18.60, 1.70, 3.90)
const CAM_F_TARGET = new Vector3(QUOTE_POS.x, QUOTE_POS.y, 3.98)

export default class SceneSki extends BaseScene {
  static singleton

  constructor() {
    if (SceneSki.singleton) {
      return SceneSki.singleton
    }
    super() // must be before this
    SceneSki.singleton = this

    this.scene = this.WebGL.sceneSki

    this.init()
  }

  init() {
    // MAP
    this.map = this.assets.models["ski_map"].scene

    // character
    this.characterContainer = new Group()
    this.character = new Group()
    const box = new BoxGeometry(0.1, 0.2, 0.1)
    this.characterAnimation = new Mesh(box, new MeshBasicMaterial({ color: 0xff0000 }))
    this.character.position.set(0, 0.1, 0)
    this.character.add(this.characterAnimation)
    this.characterContainer.add(this.character)

    // light
    this.ambientLight = new AmbientLight(CLEAR_COLOR, 0.7)


    // add quote
    this.quote = new QuoteBlock({
      contentWidth: 1000,
      contentLineHeight: 50,
      quoteContent: 'Tu joues avec la montagne, la montagne n’est jamais pareil, tu t’adaptes au terrain : c’est un sport d’improvisation',

      authorWidth: 1000,
      quoteAuthor: 'Richard Permin',
      authorColor: '#C4FE1F',

      jobWidth: 1000,
      quoteJob: 'Spécialiste de la chute libre',
    })
    this.quote.container.position.copy(QUOTE_POS)

    this.quote.container.rotation.y = 1.2
    this.quote.container.scale.set(.0005, .0005, .0005)
    this.quote.hideQuote()

    // add to scene
    this.scene.add(this.map, this.characterContainer, this.ambientLight, this.quote.container)

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.scene.add(axesHelper)

      // this.WebGL.debug.addInput(this.quote.container, 'position')
    }
  }

  startScene() {
    // 1 - set curves for tracking camera
    TRAC_CAM.CURVE_PERSO.forEach(curve => {
      curve.ro *= 0.3
    })
    this.setCurvesTracking(TRAC_CAM.CURVE_PERSO, TRAC_CAM.CURVE_TARGET_BIS, datas.altitude['ski'].max, datas.altitude['ski'].min)

    // 2 - add camera to wingsuit + set position
    this.setCameraFPV()

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneSki', (currentTime, dt) => {
      this.timelineValue = Math.min((this.timelineValue + dt * 0.022 * this.getSpeed(this.timelineValue)), 1)
      this.setTracking(this.timelineValue, this.characterContainer)
    })

    // play audio
    this.audioManager.play('ski-global', true, 1, 3500)

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

  //
  // Cameras
  //

  setCameraFPV () {
    this.characterContainer.add(this.WebGL.camera.setCamera('fpv', new Vector3(0, 0.2, 0)))
  }
  setCameraTravelling () {
    const addVector = new Vector3(-0.3, -0.05, -2)
    this.WebGL.camera.setCamera('3p', addVector, this.characterContainer.position)

    RAFManager.add('ski-travelling', () => {
      this.characterContainer.getWorldPosition(this.WebGL.camera.current.position).add(addVector)
    })
  }
  removeCameraTravelling () {
    RAFManager.remove('ski-travelling')
    this.setCameraFPV()
  }

  setCameraQteFigure () {
    this.WebGL.camera.setCamera('3p', this.map.getObjectByName('CAM_2').position, this.map.getObjectByName('CAM_2_TARGET').position)
  }

  setCamera3P() {
    RAFManager.setSpeed(0.25)
    this.WebGL.camera.setCamera('3p', CAM_F, CAM_F_TARGET)
    this.quote.showQuote()
  }

  //
  // End QTE
  //
  animationSucessQTE () {
    requestAnimationFrame(() => {
      RAFManager.setSpeed(0.1)
    })

    const delay = 700
    const duration = 4900
    anime.timeline({
      easing: 'linear'
    })
    .add({
      targets: this.characterAnimation.rotation,
      duration: duration + delay * 0.5,
      x: `+=${Math.PI * -2}}`,
      easing: 'cubicBezier(0.2, 0.1, 0.85, 1)', // 'easeInOutQuad',
      complete: () => {
        setTimeout(() => {
          RAFManager.setSpeed(0.45)
        }, 500);
      }
    }, delay * 0.3)
    .add({
      targets: this.characterAnimation.position,
      duration: duration,
      y: 0.05,
      easing: 'linear',
    }, 0)
    .add({
      targets: this.characterAnimation.position,
      duration: duration * 0.4,
      y: 0,
      easing: 'easeInSine',
    }, duration)
  }

  animationFailsQTE () {
    RAFManager.setSpeed(0.3)

    setTimeout(() => {
      RAFManager.setSpeed(1)
    }, 5000);
  }

  //
  // DESTROY SCENE
  //
  destroyScene() {
    if (this.WebGL.debug) {
      this.debugFPV.dispose()
      this.debug3P.dispose()
    }

    this.audioManager.stop('ski-global', 2000)

    RAFManager.remove('SceneSki')
  }
}
