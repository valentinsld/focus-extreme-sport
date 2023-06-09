import { Group, AmbientLight, AxesHelper, Vector3, Mesh, BoxGeometry, MeshBasicMaterial } from 'three'
import BaseScene from './BaseScene.js'
// import anime from "animejs"

import TRAC_CAM from '@/assets/modelsCurves/ski.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../Components/Quote.js'

import datas from "~~/webgl/data/data.json"

const CLEAR_COLOR = 0x93CBE5

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
    this.character = new Mesh(new BoxGeometry(0.1, 0.2, 0.1), new MeshBasicMaterial({ color: 0xff0000 }))
    this.character.position.set(0, 0.1, 0)
    this.characterContainer.add(this.character)

    // light
    this.ambientLight = new AmbientLight(CLEAR_COLOR, 0.7)


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
    // this.quote.container.position //.set(17.48, -5, -4.89)
    //   .copy(this.map.getObjectByName('CAM_F_TARGET').position)
    //   .sub(new Vector3(-0.54, 0.5, 0.081))

    // this.quote.container.rotation.y = 1.53
    // this.quote.container.scale.set(.0005, .0005, .0005)
    // this.quote.hideQuote()

    // add to scene
    this.scene.add(...[this.map, this.characterContainer, this.ambientLight/*, this.quote.container*/])

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.scene.add(axesHelper)
    }
  }

  startScene() {
    // 1 - set curves for tracking camera
    this.setCurvesTracking(TRAC_CAM.CURVE_PERSO, TRAC_CAM.CURVE_TARGET, datas.altitude['ski'].max, datas.altitude['ski'].min)

    // 2 - add camera to wingsuit + set position
    this.characterContainer.add(this.WebGL.camera.setCamera('fpv', new Vector3(0, 0.2, 0)))

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneSki', (currentTime, dt) => {
      this.timelineValue = Math.min((this.timelineValue + dt * 0.022 * this.getSpeed(this.timelineValue)), 1)  % 1
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

  setCamera3P() {
    this.WebGL.camera.setCamera('3p', this.map.getObjectByName('CAM_F').position, this.map.getObjectByName('CAM_F_TARGET').position)
    this.quote.showQuote()
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
