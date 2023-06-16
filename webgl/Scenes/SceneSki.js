import { Group, AmbientLight, AxesHelper, Vector3, Fog, Color, Vector2, ShaderMaterial, DoubleSide } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import BaseScene from './BaseScene.js'
import anime from "animejs"

import TRAC_CAM from '@/assets/modelsCurves/ski.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../Components/Quote.js'

import datas from "~~/webgl/data/data.json"
import skiHdr from '~~/assets/hdr/snowy_park_01_1k.hdr'
import SkyCustom from '../Components/Environment/Sky.js'
import DirectionalLightSource from '../Components/Environment/DirectionalLight.js'
import InstancedSplash from '../Components/Particles/Water/InstancedSplash.js'

import RiverF from '@/webgl/Shaders/River/riverF.frag'
import RiverV from '@/webgl/Shaders/River/riverV.vert'

const CLEAR_COLOR = 0x93CBE5

const CAM_F = new Vector3(19.8, 1.85, 4.1)
const QUOTE_POS = new Vector3(18.60, 1.70, 3.90)
const CAM_F_TARGET = new Vector3(QUOTE_POS.x, QUOTE_POS.y, 3.98)

const splashColors = [
  new Color(0xD4DBE4),
	new Color(0xCFD7E2),
	new Color(0xA9BCD0),
  new Color(0x97B0C7),
]

export default class SceneSki extends BaseScene {
  static singleton

  constructor() {
    if (SceneSki.singleton) {
      return SceneSki.singleton
    }
    super() // must be before this
    SceneSki.singleton = this

    this.sizes = this.WebGL.sizes
    this.scene = this.WebGL.sceneSki
    this.generator = this.WebGL.renderer.generator

    this.time = 0

    this.params = {
      colorB: '#418B84', // #668aac
      colorA: '#316863', // #89ADCE
      lineColor: '#347F7A', // #0c2349
    }

    this.scene.fog = new Fog(0x9bc8fa, 0, 20)

    this.init()
  }

  init() {
    // MAP
    this.map = this.assets.models["ski_map"].scene

    this.initWater()
    // this.initFinalCloudSnow()

    new RGBELoader().load(skiHdr, (map) => {
		  this.envmap = this.generator.fromEquirectangular(map)
      this.map.traverse((element) => {
        if (element.isMesh) {
          element.material.envMap = this.envmap.texture
          element.material.envMapIntensity = .5
        }
        if(element.name.includes("SKY") || element.name.includes("Cloud")) {
          element.material.envMapIntensity = .8
        }
      })
      this.character.traverse((element) => {
        if (element.isMesh) {
          element.material.envMap = this.envmap.texture
          element.material.envMapIntensity = .2
        }
      })
    })

    // character
    this.characterContainer = new Group()
    this.character = new Group()
    this.characterAnimation = this.assets.models["ski_character"].scene
    this.characterAnimation.scale.set(0.02, 0.02, 0.02)
    this.characterAnimation.children[0].rotation.set(0, -Math.PI * 0.5, 0)

    this.character.add(this.characterAnimation)
    this.characterContainer.add(this.character)

    // light
    this.ambientLight = new AmbientLight(CLEAR_COLOR, 0.5)

    this.dirLight = new DirectionalLightSource({
      color: 0xffffff,
      intensity: 1,
      positions: new Vector3(-70, 60, -20),
    })

    this.sky = new SkyCustom({
      debug: this.debug,
      turbidity: 2.1,
		  rayleigh: 2,
		  mieCoefficient: 0.165,
		  mieDirectionalG: 1,
		  elevation: 70,
		  azimuth: 225,
    })

    this.sky.container.position.set(0, -50, 0)

    this.initSkiSplash()

    // add quote
    this.quote = new QuoteBlock({
      contentWidth: 1000,
      contentLineHeight: 50,
      quoteContent: 'Tu joues avec la montagne, la montagne n\'est jamais pareil, tu t\'adaptes au terrain : c\'est un sport d\'improvisation',

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
    this.scene.add(
      this.map,
      this.dirLight.container,
      this.sky.container,
      this.characterContainer,
      this.ambientLight,
      this.quote.container
    )

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.scene.add(axesHelper)

      // this.WebGL.debug.addInput(this.quote.container, 'position')
    }
  }

  initSkiSplash() {
    this.splashLeft = new InstancedSplash({
      direction: 'back',
      colors: splashColors,
      spreadMultiplier: new Vector3(0.2, 1, .95), // sur une base de .99 * value
      scales: new Vector2(0.01, 0.025),
      veloRandArr: [{x: 2, y: 4, z: 10}, {x: 5, y: 6, z: 15}]
    })
    this.splashLeft.container.position.set(0, -0.1, -0.075)

    this.character.add(...[this.splashLeft.container])
  }

  initFinalCloudSnow() {
    this.finalCloud = new InstancedSplash({
      direction: 'back',
      type: 'cloud',
      colors: splashColors,
      spreadMultiplier: new Vector3(1, 1, 1), // sur une base de .99 * value
      count: 500,
      scales: new Vector2(0.01, 0.3),
      maxAlphas: new Vector2(0.9, 1),
      veloRandArr: [{x: 10, y: 10, z: 10}, {x: 15, y: 15, z: 15}],
      lifeTime: 15,
    })

    this.finalCloud.container.position.set(18.75, 1.5, 4)

    this.scene.add(this.finalCloud.container)
  }

  initWater() {

    this.map.traverse((child) => {
      if(child.name.includes("Plane")) {
        this.water = child
      }
    })

    this.foam = this.water.material.map;

    this.water.material = new ShaderMaterial({
      vertexShader: RiverV,
      fragmentShader: RiverF,
      transparent: false,
      depthTest: true,
      side: DoubleSide,

      uniforms: {
        uTime: { value: this.time},
        uBigWavesElevation: { value: 0.0025 },
        uBigWavesFrequency: { value: new Vector2(1, -10) },
        uBigWavesSpeed: { value: 0.5 },

        uSmallWavesElevation: { value: 0.05 },
        uSmallWavesFrequency: { value: 5 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 5 },

				uResolution: { value: [this.sizes.width, this.sizes.height] },
				uColorA: { value: new Color(this.params.colorA) },
				uColorB: { value: new Color(this.params.colorB) },
				uLineColor: { value: new Color(this.params.lineColor) },

        uFoamTex: { value: this.foam },
        uRotation: { value: -125.0},

        fogColor: { value: new Color(0x9bc8fa)},
        fogNear: { value: 0},
        fogFar: { value: 20},

      },
      defines: {
        USE_FOG: true
      },
    })

    // this.water.position.y += .1
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
      this.water.material.uniforms.uTime.value += dt
      this.splashLeft.updateParticles(currentTime, dt)
      if(this.finalCloud) this.finalCloud.updateParticles(currentTime, dt)
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
    this.characterContainer.add(this.WebGL.camera.setCamera('fpv', new Vector3(0, 0.17, 0.035)))
  }
  setCameraTravelling () {
    const addVector = new Vector3(-0.3, -0.05, -1.8)
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
    this.splashLeft.endEmit()
    const delay = 700
    const duration = 5400
    anime.timeline({
      easing: 'linear'
    })
    .add({
      targets: this.characterAnimation.rotation,
      duration: duration + delay * 0.5,
      x: `+=${Math.PI * -2}}`,
      easing: 'cubicBezier(0.2,0.4,0.7,1.13)', // 'easeInOutQuad',
      complete: () => {
        setTimeout(() => {
          RAFManager.setSpeed(0.45)
          this.splashLeft.startEmit()
        }, 800);
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
