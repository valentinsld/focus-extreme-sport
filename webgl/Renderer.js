import {
  WebGLRenderer,
  sRGBEncoding,
  NoToneMapping,
  PCFSoftShadowMap,
  PMREMGenerator
} from 'three'
import WebGL from './index.js'

export default class Renderer {
  constructor() {
    this.WebGL = new WebGL()
    this.debug = this.WebGL.debug
    this.stats = this.WebGL.stats
    this.sizes = this.WebGL.sizes
    this.scene = this.WebGL.currentScene
    this.transi = this.WebGL.sceneTransi
    this.camera = this.WebGL.camera

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({ title: 'renderer', expanded: false })
    }

    this.setInstance()
  }

  setInstance() {
    this.clearColor = '#001e26'

    // Renderer
    this.instance = new WebGLRenderer({
      alpha: false,
      antialias: true,
      canvas: this.WebGL.canvas,
    })
    this.instance.domElement.style.position = 'absolute'
    this.instance.domElement.style.top = 0
    this.instance.domElement.style.left = 0
    this.instance.domElement.style.width = '100%'
    this.instance.domElement.style.height = '100%'

    this.instance.setClearColor(this.clearColor, 1)
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)

    this.instance.useLegacyLights = false
    // this.instance.gammaOutPut = true
    this.instance.outputEncoding = sRGBEncoding
    this.instance.shadowMap.type = PCFSoftShadowMap
    this.instance.shadowMap.enabled = true
    this.instance.shadowMapSoft = true
    this.instance.toneMapping = NoToneMapping
    this.instance.toneMappingExposure = 1

    this.context = this.instance.getContext()

    this.generator = new PMREMGenerator(this.instance)

    // Debug
    if (this.debug) {
      this.debugFolder.addInput(this, 'clearColor').on('change', () => {
        this.instance.setClearColor(this.clearColor)
      })
    }
  }

  resize() {
    // Instance
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender()
    }

    if (this.stats) {
      this.stats.afterRender()
    }
  }

  destroy() {
    this.instance.renderLists.dispose()
    this.instance.dispose()
    this.renderTarget.dispose()
  }
}
