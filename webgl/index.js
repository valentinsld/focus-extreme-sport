import { Scene } from "three";
import { Pane } from "tweakpane";
import { getGPUTier } from 'detect-gpu';

import RAFManager from "./Utils/RAFManager.js";
import Sizes from "./Utils/Sizes.js";
import Stats from "./Utils/Stats.js";
import Assets from "./Utils/Loader.js"

import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import EventEmitter from "./Utils/EventEmitter.js";

import Store from '~~/webgl/Utils/Store.js';

import SceneManager from './Managers/SceneManager.js';
import SceneTransi from './Scenes/SceneTransi.js';
import SceneHome from '~~/webgl/Scenes/SceneHome.js';
import SceneWingsuit from './Scenes/SceneWingsuit.js';
import SceneKayak from './Scenes/SceneKayak.js';
import FXComposer from './FxComposer.js';
import SceneSki from './Scenes/SceneSki.js';
import SceneStickers from './Scenes/SceneStickers.js';

export default class WebGL extends EventEmitter {
  static instance;

  constructor() {
    super();

    if (WebGL.instance) {
      return WebGL.instance;
    }
    WebGL.instance = this;
    this.canvas = document.querySelector("#canvasWebgl");

    this.started = false;

    this.sizes = new Sizes();
    this.assets = new Assets();
    this.sceneManager = new SceneManager();
    this.ressourcesReady = false

    this.sceneArray = []

    this.setScene();
    this.setDebug();
    this.setCamera();
    this.setRenderer();
    this.setFxComposer();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.initSceneHome()

    this.assets.on('ressourcesReady', async () => {
      this.ressourcesReady = true

      await this.initTransi()

      await this.initSceneWingsuit()
      await this.initSceneSki()
      await this.initSceneKayak()
      await this.initSceneStickers()

      this.sceneManager.startCurrentScene()
      this.trigger("endLoading")
    })

    RAFManager.add("webgl",(currentTime, dt) => {
      this.update.bind(this)
      this.camera.update(dt);
      this.fxComposer.update()

      // this.renderer.update();
    });

    this.started = true;

  }

  setDebug() {
    this.isDebug = window.location.hash === "#debug";
    if (this.isDebug) {
      this.debug = new Pane();
      this.stats = new Stats(true);

      // add speed
      // this.debug.addInput(RAFManager, 'targetSpeed', { min: -4, max: 4 })

      const speedFolder = this.debug.addFolder({ title: 'Speed', expanded: false })

      // change State of xp
      speedFolder.addButton({ title: "Slow speed" }).on("click", () => {
        Store.targetSpeed = 0.05;
        RAFManager.setSpeed(Store.targetSpeed);
      });

      speedFolder.addButton({ title: "Normal Speed" }).on("click", () => {
        Store.targetSpeed = 1;
        RAFManager.setSpeed(Store.targetSpeed);
      });
    }
  }

  setScene() {
    this.sceneHome = new Scene();
    this.sceneHome.name = 'home';

    this.sceneIntro = new Scene();
    this.sceneIntro.name = 'intro';

    this.sceneSki = new Scene();
    this.sceneSki.name = 'ski';

    this.sceneWingsuit = new Scene();
    // this.sceneWingsuit.fog = new Fog(0x001e26, 0, 20)
    this.sceneWingsuit.name = 'wingsuit';

    this.sceneKayak = new Scene();
    this.sceneKayak.name = 'kayak';

    this.sceneTransi = new Scene();
    this.sceneTransi.name = 'Transition'

    this.sceneStickers = new Scene();
    this.sceneStickers.name = 'stickers'

    this.currentScene = this.sceneHome

    this.sceneArray.push(...[this.sceneHome, this.sceneIntro, this.sceneSki, this.sceneWingsuit, this.sceneKayak, this.sceneStickers])
  }

  setSceneManager() {
    this.sceneManager = new SceneManager()
  }

  setCamera() {
    this.camera = new Camera()
  }

  setRenderer() {
    this.renderer = new Renderer()
  }

  setFxComposer() {
    this.fxComposer = new FXComposer()
  }

  initSceneHome() {
    this.sceneHome.scene = new SceneHome()
  }
  initSceneStickers() {
    this.sceneStickers.scene = new SceneStickers()
  }

  initSceneWingsuit() {
    this.sceneWingsuit.scene = new SceneWingsuit()
  }

  initSceneSki() {
    this.sceneSki.scene = new SceneSki()
  }

  initSceneKayak() {
    this.sceneKayak.scene = new SceneKayak()
  }

  initTransi() {
    this.sceneTransi.scene = new SceneTransi()
  }

  update() {
    if (this.stats) this.stats.update();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  async testPerformance() {
    const gpuTier = await getGPUTier();

    this.sizes.testPixelRatioPerformance(gpuTier.fps)
  }

  destroy() {
    this.renderer.instance.domElement.remove();
    if (this.stats) this.stats.destroy();
    if (this.debug) this.debug.dispose();
  }
}
