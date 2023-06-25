import anime from "animejs"

import { Group, AmbientLight, AxesHelper, Vector3, AnimationMixer, MathUtils, FogExp2 } from 'three'
// import { Sky } from 'three/addons/objects/Sky.js';

import BaseScene from './BaseScene.js'
import TRAC_CAM from '@/assets/modelsCurves/wingsuit.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../Components/Quote.js'
import DirectionalLightSource from '../Components/Environment/DirectionalLight.js'

import SkyCustom from '../Components/Environment/Sky.js'
import Clouds from '../Components/Environment/Clouds.js'

import datas from "~~/webgl/data/data.json"
import InstancedAssets from '../Components/InstancedAssets.js'

const CLEAR_COLOR = 0xd6eeff
const CAM2_POS = new Vector3(6.25, 0.86, -1.85)

export default class SceneWingsuit extends BaseScene {
  static singleton

  constructor() {
    if (SceneWingsuit.singleton) {
      return SceneWingsuit.singleton
    }
    super() // must be before this
    SceneWingsuit.singleton = this

    this.scene = this.WebGL.sceneWingsuit
    this.generator = this.WebGL.renderer.generator
    this.debug = this.WebGL.debug

    this.scene.fog = new FogExp2(0x9bc8fa, 0.025)

    this.envmap = this.assets.hdrs.snowy_park_01_1k.texture

    this.ices = []
    this.deadWood = []

    this.init()
    // Debug
    // if (this.debug) {
    //   this.debugFolder = this.debug.addFolder({ title: 'wingsuit', expanded: false })
    //   this.initDebug()
    // }
  }

  init() {
    // MAP
    this.map = this.assets.models["wingsuit_map"].scene

    this.map.traverse((element) => {
      if(element.name.includes('SNOW_DEAD_WOOD')) {
				this.deadWood.push(element)
			}

      if(element.name.includes('ICE')) {
				this.ices.push(element)
			}

      if (element.isMesh) {
        element.matrixAutoUpdate = false
      }
		})

    this.initInstancedAssets()

    // character
    this.characterContainer = new Group()
    this.character = this.assets.models["wingsuit_character"].scene
    this.character.scale.set(0.01, 0.01, 0.01)
    this.character.position.set(0, -0.02, -0.012)
    this.character.children[0].rotation.set(0, -Math.PI * 0.5, 0)

    this.mixerCharacter = new AnimationMixer(this.character);
    this.mixerCharacter.clipAction(this.assets.models["wingsuit_character"].animations[0]).play();
    this.characterContainer.add(this.character)

    this.map.traverse((element) => {
      if (element.isMesh) {
        element.material.envMap = this.envmap
        element.material.envMapIntensity = .5
        // element.castShadow = true
        // element.receiveShadow = true
      }
      if(element.name.includes("SKY")) {
        element.material.envMapIntensity = .8
      }
    })
    this.character.traverse((element) => {
      if (element.isMesh) {
        element.material.envMap = this.envmap
        element.material.envMapIntensity = .2
        // element.castShadow = true
        // element.receiveShadow = true
      }
    })

    // light
    this.ambientLight = new AmbientLight(CLEAR_COLOR, 0.5)

    this.dirLight = new DirectionalLightSource({
      color: 0xffffff,
      // 0xAECDE5
      intensity: 1,
      positions: new Vector3(-70, 60, -20),
      // castShadow: true,
      // shadowMapSize: 2048,
      // shadowBias: -0.004
    })

    // position camera 3p
    this.map.getObjectByName('CAM_F').position.y += 0.05
    this.map.getObjectByName('CAM_2').position.y -= 0.9

    // this.initSky();
    this.sky = new SkyCustom({
      debug: this.debug,
      sphereTopColor: 0x0096ff,
      sphereBottomColor: 0xa2dcfc,
      offset: 20,
      exponent: 2,
    })

    this.sky.container.position.set(0, -50, 0)

    this.cl1 = new Clouds({
      index: Math.round(MathUtils.randFloat(1,6)),
      size: MathUtils.randFloat(8,12),
      opacity: MathUtils.randFloat(0.35, 0.6),
    })
    this.cl1.container.position.set(-12, 7, 5)
    this.cl1.container.rotation.x = -Math.PI / 4

    this.cl2 = new Clouds({
      index: Math.round(MathUtils.randFloat(1,6)),
      size: MathUtils.randFloat(5,8),
      opacity: MathUtils.randFloat(.35, .6),
    })
    this.cl2.container.position.set(-5, 7, 5)
    this.cl2.container.rotation.x = -Math.PI / 2
    this.cl2.container.rotation.z = -Math.PI / 4
    this.cl2.container.rotation.y = -Math.PI / 4

    this.cl3 = new Clouds({
      index: Math.round(MathUtils.randFloat(1,6)),
      size: MathUtils.randFloat(8,12),
      opacity: MathUtils.randFloat(.35, .6),
    })
    this.cl3.container.position.set(-7, 5, 7)
    this.cl3.container.rotation.x = -Math.PI / 2

    this.cl4 = new Clouds({
      index: Math.round(MathUtils.randFloat(1,6)),
      size: MathUtils.randFloat(8,12),
      opacity: MathUtils.randFloat(.35, .6),
    })
    this.cl4.container.position.set(-12, 7, 8.5)
    this.cl4.container.rotation.x = -Math.PI / 2

    // add quote
    this.quote = new QuoteBlock({
      contentWidth: 1000,
      contentLineHeight: 50,
      quoteContent: 'On est autour des 200 kilomètres heure, mais si on prend de la vitesse on peut passer les 250, ça va très vite',

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
    this.instance.add(...[
      this.map,
      this.characterContainer,
      this.ambientLight,
      this.quote.container,
      this.dirLight.container,
      this.sky.container,
      this.cl1.container,
      this.cl2.container,
      this.cl3.container,
      this.cl4.container,
    ])

    this.scene.add(this.instance)

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)
    }
  }

  initInstancedAssets() {
    this.icesInstanced = new InstancedAssets({
      name: 'ices',
      model: 'instance_ice',
      instances: this.ices,
      scaleMultiplier: .0009,
      hdr: this.envmap,
      intensity: .8,
      hasHdr: true,
    })

    // this.bushInstanced = new InstancedAssets({
    //   name: 'bush',
    //   model: 'instance_bush',
    //   instances: this.bush,
    //   hdr: kayakHdr
    // })

    this.deadWoodInstanced = new InstancedAssets({
      name: 'deadWood',
      model: 'snow_dead_wood_2',
      instances: this.deadWood,
      scaleMultiplier: .25,
      hdr: this.envmap,
      intensity: .8,
      hasHdr: true,
    })


    this.instance.add(...[
      this.icesInstanced.container,
      this.deadWoodInstanced.container,
    ])
  }


  startScene() {
    // 1 - set curves for tracking camera
    this.setCurvesTracking(TRAC_CAM.CURVE_CAM, TRAC_CAM.CURVE_TARGET, datas.altitude['wingsuit'].max, datas.altitude['wingsuit'].min)

    // 2 - add camera to wingsuit + set position
    this.characterContainer.add(this.WebGL.camera.setCamera('fpv', new Vector3(0.1, 0.1, -0.3)))

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneWingsuit', (currentTime, dt) => {
      this.timelineValue = Math.min((this.timelineValue + dt * 0.028 * this.getSpeed(this.timelineValue)), 1)
      this.setTracking(this.timelineValue, this.characterContainer)
      // this.cl1.container.rotation.copy(this.WebGL.camera.current.rotation)
      // this.cl2.container.rotation.copy(this.WebGL.camera.current.rotation)
      // animation mixer character
      this.mixerCharacter.update(dt);
    })

    // manually update of map
    this.map.traverse((element) => {
      if (element.isMesh) {
        element.updateMatrix()
      }
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
    // this.WebGL.camera.setCamera('3p', this.map.getObjectByName('CAM_2').position, this.map.getObjectByName('CAM_2_TARGET').position)
    const CAM2_POS_TARGET = this.map.getObjectByName('CAM_2_TARGET').position
    this.WebGL.camera.setCamera('3p', CAM2_POS, CAM2_POS_TARGET)

    anime({
      targets: CAM2_POS_TARGET,
      x: '+=2',
      y: '-=0.5',
      delay: 500,
      duration: 2000,
      easing: 'easeInOutQuart',
      complete: () => {
        this.WebGL.camera.setCamera()
      }
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
    anime.timeline()
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
      y: {
        value: [0.1, 0],
        duration: 2800
      },
      z: [-0.3, 0],
      duration: 3300,
      easing: 'easeOutQuint',
    }, 1800)
  }
  animationFailsQTE(callback = null) {
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

    this.audioManager.stop('wingsuit-montagne', 2000)

    RAFManager.remove('SceneWingsuit')
  }
}
