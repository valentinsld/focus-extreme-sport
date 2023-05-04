import { Scene} from "three";
import { Pane } from "tweakpane";

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
import SceneKayak from './Scenes/SceneKayak.js';

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

    this.setScene();
    this.setDebug();
    this.setCamera();
    this.setRenderer();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.assets.on('ressourcesReady', () => {
      this.ressourcesReady = true
      this.trigger("endLoading");

      this.initTransi();

      this.initSceneHome();
      this.initSceneKayak();

      this.sceneManager.startCurrentScene()
    })

    RAFManager.add("webgl",(currentTime, dt) => {
      this.update.bind(this)
      this.camera.update(dt);

      this.renderer.update();
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
    this.sceneWingsuit.name = 'wingsuit';

    this.sceneKayak = new Scene();
    this.sceneKayak.name = 'kayak';

    this.sceneTransi = new Scene();
    this.sceneTransi.name = 'Transition'

    this.currentScene = this.sceneHome

    this.sceneArray = [this.sceneHome, this.sceneIntro, this.sceneSki, this.sceneWingsuit, this.sceneKayak]
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

  initSceneHome() {
    this.sceneHome.scene = new SceneHome()
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

  destroy() {
    this.renderer.instance.domElement.remove();
    if (this.stats) this.stats.destroy();
    if (this.debug) this.debug.dispose();
  }
}
