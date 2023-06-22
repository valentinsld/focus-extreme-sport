import { Group, AmbientLight, AxesHelper, Vector3, CurvePath, Fog, ShaderMaterial, Vector2, DoubleSide, Color } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import BaseScene from './BaseScene.js'

import TRAC_CAM from '@/assets/modelsCurves/kayak.json'
import RAFManager from '../Utils/RAFManager.js'
import QuoteBlock from '../Components/Quote.js'
import { DegToRad } from '../Utils/Math.js'

import DirectionalLightSource from '../Components/Environment/DirectionalLight.js'
import SkyCustom from '../Components/Environment/Sky.js';
import RiverF from '@/webgl/Shaders/River/riverF.frag'
import RiverV from '@/webgl/Shaders/River/riverV.vert'
import InstancedSplash from '../Components/Particles/Water/InstancedSplash.js'

import datas from "~~/webgl/data/data.json"
import kayakHdr from '~~/assets/hdr/kayak.hdr'
import InstancedAssets from '../Components/InstancedAssets.js'
import Waterfall from '../Components/Environment/Waterfall.js'

const splashColors = [
  new Color(0x418B84),
	new Color(0x316863),
	new Color(0x347F7A),
  new Color(0x5CBDB6),
]

const CLEAR_COLOR = 0xCFBF48

export default class SceneKayak extends BaseScene {
  static singleton

  constructor() {
    if (SceneKayak.singleton) {
      return SceneKayak.singleton
    }
    super() // must be before this
    SceneKayak.singleton = this

    this.debug = this.WebGL.debug

    this.assets = this.WebGL.assets
    this.generator = this.WebGL.renderer.generator
    this.scene = this.WebGL.sceneKayak
    this.scene.fog = new Fog(0x9bc8fa, 0, 15)
    this.sizes = this.WebGL.sizes

    this.CAM_3P_1 = {
      x: -0.15,
      y: 0.3,
      z: -4.1,
    }

    this.params = {
      colorB: '#418B84', // #668aac
      colorA: '#316863', // #89ADCE
      lineColor: '#347F7A', // #0c2349
    }
    this.time = 0

    this.curveCam_R = new CurvePath()
    this.curveTrack_R = new CurvePath()

    this.pine = []
    this.bush = []
    this.rock = []
    this.deadWood = []
    this.firWood = []
    this.littleTree = []
    this.rockV2 = []

    this.init()

    if(this.debug) {
      this.initDebug()
    }
  }

  init() {
    // map
    this.map = this.assets.models["kayak_map"].scene

    this.map.traverse((element) => {
			if(element.name.includes('High_Sapin')) {
				this.pine.push(element)
			}

      if(element.name.includes('Bush')) {
				this.bush.push(element)
			}

      if(element.name.includes('Rock_V1')) {
				this.rock.push(element)
			}

      if(element.name.includes('Rock_V2')) {
				this.rockV2.push(element)
			}

      if(element.name.includes('Dead_Wood')) {
				this.deadWood.push(element)
			}

      if(element.name.includes('Fir_Wood')) {
				this.firWood.push(element)
			}

      if(element.name.includes('Little_Tree')) {
				this.littleTree.push(element)
			}
		})

    this.initInstancedAssets()

    this.initWater()

    // kayak
    this.characterContainer = new Group()
    this.character = this.assets.models["kayak_character"].scene
    this.character.scale.set(0.008, 0.008, 0.008)
    this.character.rotation.y = -Math.PI *0.5
    this.characterContainer.add(this.character)

    this.setAnimation(
      this.character,
      this.assets.models["kayak_character"].animations[1],
      this.assets.models["kayak_character"].animations[0],
      new Vector3(0, 0.035, 0),
      new Vector3(-0.02, 0, -0.01)
    )

    new RGBELoader().load(kayakHdr, (map) => {
		  this.envmap = this.generator.fromEquirectangular(map)
      this.map.traverse((element) => {
        if (element.isMesh) {
          element.material.envMap = this.envmap.texture
          element.material.envMapIntensity = .25
          // element.castShadow = true
          // element.receiveShadow = true
        }
      })
      this.characterContainer.traverse((element) => {
        if (element.isMesh) {
          element.material.envMap = this.envmap.texture
          element.material.envMapIntensity = .25
          // element.castShadow = true
          // element.receiveShadow = true
        }
      })
    })

     // light
     this.ambientLight = new AmbientLight(CLEAR_COLOR, 0.5)

     this.dirLight = new DirectionalLightSource({
       color: 0xCFA071,
       // 0xAECDE5
       intensity: 1,
       positions: new Vector3(-70, 60, -20),
       castShadow: true,
       shadowMapSize: 2048,
       shadowBias: -0.004,
       target: new Vector3(0, 0, -10)
     })

    // this.initSky();
    this.sky = new SkyCustom({
      debug: this.debug,
      sphereTopColor: 0x0096ff,
      sphereBottomColor: 0xa2dcfc,
      offset: 20,
      exponent: 2,
    })

    this.sky.container.position.set(0, -50, 0)

    this.initKayakSplash()

    this.quote = new QuoteBlock({
      contentWidth: 1000,
      contentLineHeight: 50,
      quoteContent: 'En état de flow, c\'est comme si les secondes se rallongent. C\'est fou d\'arriver à changer le temps',

      authorWidth: 1000,
      quoteAuthor: 'NOURIA NEWMAN',
      authorColor: '#C4FE1F',

      jobWidth: 1000,
      quoteJob: 'Kayakiste professionnelle',
    })
    this.quote.container.position.set(0.66, -1.05, -11.25)
    this.quote.container.rotation.y = DegToRad(145)
    this.quote.container.scale.set(.0005, .0005, .0005)
    this.quote.hideQuote()

    this.waterfall = new Waterfall({

    })

    this.waterfall.container.position.set(0.65,-.95, -11.55)
    this.waterfall.hideWaterfall()

    this.instance.add(...[
      this.ambientLight,
      this.map,
      this.characterContainer,
      this.quote.container,
      this.dirLight.container,
      this.sky.container,
      this.waterfall.container
    ])
    this.scene.add(this.instance)

    if(this.WebGL.debug) {
      // three js add helper lines
      const axesHelper = new AxesHelper(5)
      this.instance.add(axesHelper)

      // this.debugQuotePosition = this.WebGL.debug.addInput(this.quote.container, 'position', { step: 0.01 })
    }
  }
  initWater() {

    this.map.traverse((child) => {
      if(child.name.includes("LEVELDESIGN")) {
        child.traverse((element) => {
          if(element.name.includes("EAU")) {
            this.water = element.children[1];
          }
        })
      }

      if (child.isMesh) {
        child.matrixAutoUpdate = false
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
        uRotation: { value: -45.},

        fogColor: { value: new Color(0x9bc8fa)},
        fogNear: { value: 0},
        fogFar: { value: 15},

      },
      defines: {
        USE_FOG: true
      },
    })

    this.water.position.y += .005
  }

  initKayakSplash() {
    this.splashLeft = new InstancedSplash({
      direction: 'left',
      colors: splashColors
    })
    this.splashLeft.container.position.set(0.025, -0.02,.08)

    this.splashRight = new InstancedSplash({
      direction: 'right',
      colors: splashColors
    })
    this.splashRight.container.position.set(-0.025, -0.02,.08)

    this.splashBack = new InstancedSplash({
      direction: 'back',
      spreadMultiplier: new Vector3(.85, .7, .85),
      colors: splashColors
    })
    this.splashBack.container.position.set(-0.0125, -0.01,-.07)
    // this.splashRight.container.rotation.y = Math.PI
    this.characterContainer.add(this.splashRight.container, this.splashLeft.container, this.splashBack.container)
  }

  initInstancedAssets() {
    this.pineInstanced = new InstancedAssets({
      name: 'pine',
      model: 'instance_pine',
      instances: this.pine,
      scaleMultiplier: .0475,
      hdr: kayakHdr,
      hasHdr: true,
    })

    this.bushInstanced = new InstancedAssets({
      name: 'bush',
      model: 'instance_bush',
      instances: this.bush,
      hdr: kayakHdr
    })

    this.rockInstanced = new InstancedAssets({
      name: 'rock',
      model: 'instance_rock',
      instances: this.rock,
      scaleMultiplier: .0009,
      hdr: kayakHdr,
      hasHdr: true,
    })

    this.rockV2Instanced = new InstancedAssets({
      name: 'rockV2',
      model: 'instance_rock_v2',
      instances: this.rockV2,
      scaleMultiplier: .11,
      hdr: kayakHdr,
      hasHdr: true,
    })

    this.deadWoodInstanced = new InstancedAssets({
      name: 'deadWood',
      model: 'instance_dead_wood',
      instances: this.deadWood,
      scaleMultiplier: .138,
      hdr: kayakHdr,
      hasHdr: true,
    })

    this.firWoodInstanced = new InstancedAssets({
      name: 'firWood',
      model: 'instance_fir_wood',
      instances: this.firWood,
      scaleMultiplier: .05,
      hdr: kayakHdr,
      hasHdr: true,
    })

    this.littleTreeInstanced = new InstancedAssets({
      name: 'littleTree',
      model: 'instance_little_tree',
      instances: this.littleTree,
      scaleMultiplier: .15,
      hdr: kayakHdr,
      hasHdr: true,
    })

    this.instance.add(...[
      this.pineInstanced.container,
      this.bushInstanced.container,
      this.rockInstanced.container,
      this.deadWoodInstanced.container,
      this.firWoodInstanced.container,
      this.littleTreeInstanced.container,
      this.rockV2Instanced.container,
    ])
  }

  startScene() {
    // 1 - set curves for tracking camera
    this.setCurvesTracking(TRAC_CAM.CURVE_PERSO, TRAC_CAM.CURVE_TARGET, datas.altitude['kayak'].max, datas.altitude['kayak'].min)
    this.setCurve(this.curveCam_R, TRAC_CAM.CURVE_PERSO_R)
    this.setCurve(this.curveTrack_R, TRAC_CAM.CURVE_TARGET_R)

    // 2 - add camera to kayak + set position
    this.characterContainer.add(this.WebGL.camera.setCamera('fpv'))

    // 2.1 - play animation
    this.startAnimation()

    // 3- init animation with percent
    this.timelineValue = 0
    RAFManager.add('SceneKayak', (currentTime, dt) => {
      this.timelineValue = (this.timelineValue + dt * 0.022)
      // this.timelineValue = (this.timelineValue + dt * 0)
      this.setTracking(this.timelineValue, this.characterContainer)
      this.splashLeft.updateParticles(currentTime, dt)
      this.splashRight.updateParticles(currentTime, dt)
      this.splashBack.updateParticles(currentTime, dt)
      this.water.material.uniforms.uTime.value += dt
      this.waterfall.update(dt)

      this.updateAnimation(currentTime, dt)
    })

    // manually update of map
    this.map.traverse((element) => {
      if (element.isMesh) {
        element.updateMatrix()
      }
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
  // switch curves
  //
  switchCurve () {
    this.curveCam = this.curveCam_R
    this.curveTrack = this.curveTrack_R

    this.CAM_3P_1.x = 1.45
    this.CAM_3P_1.y = .45
    this.CAM_3P_1.z = -3.85
  }

  //
  // Cams
  //
  setCamera3P_1() {
    this.WebGL.camera.setCamera('3p', this.CAM_3P_1, this.characterContainer.position)
    this.cam3p?.refresh()
  }
  setCamera3P_finish() {
    this.WebGL.camera.setCamera('3p', this.map.getObjectByName('CAM_F').position, this.map.getObjectByName('CAM_F_TARGET').position)
    this.cam3p?.refresh()
    this.WebGL.fxComposer.resetEffect()
    this.quote.showQuote()

    this.setAnimationEnd(0.23, 1)
    this.water.visible = false
    this.waterfall.showWaterfall()
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

  initDebug() {
		// console.log(this.debug);
		this.debugFolder = this.WebGL.debug.addFolder({ title: 'river', expanded: false })

			// colors
			this.debugFolder.addInput(this.params, 'colorA').on('change', () => {
				this.water.material.uniforms.uColorA.value = new Color(this.params.colorA)
			})
			this.debugFolder.addInput(this.params, 'colorB').on('change', () => {
				this.water.material.uniforms.uColorB.value = new Color(this.params.colorB)
			})

			this.debugFolder.addSeparator()

			// colors DARK
			this.debugFolder.addInput(this.params, 'lineColor').on('change', () => {
				this.water.material.uniforms.uLineColor.value = new Color(this.params.lineColor)
			})

	}
}
