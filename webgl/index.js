import { AxesHelper, Scene} from "three";
import { Pane } from "tweakpane";

import RAFManager from "./Utils/RAFManager.js";
import Sizes from "./Utils/Sizes.js";
import Stats from "./Utils/Stats.js";
import Assets from "./Utils/Loader.js"

import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import EventEmitter from "./Utils/EventEmitter.js";

import SceneHome from '~~/webgl/Scenes/SceneHome.js';
import Store from '~~/webgl/Utils/Store.js';
import SceneManager from './Managers/SceneManager.js';
import SceneIntro from './Scenes/SceneIntro.js';
import SceneTransi from './Scenes/SceneTransi.js';

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
      // TODO REMOVE
      this.initCD();
      this.initCube();
      this.initTransi();
    })

    RAFManager.add("webgl", this.update.bind(this));

    this.started = true;

  }

  setDebug() {
    this.isDebug = window.location.hash === "#debug";
    if (this.isDebug) {
      this.debug = new Pane();
      this.stats = new Stats(true);

      const axesHelper = new AxesHelper(5);
      this.currentScene.add(axesHelper);

      // add speed
      // this.debug.addInput(RAFManager, 'targetSpeed', { min: -4, max: 4 })

      // change State of xp
      this.debug.addButton({ title: "Slow speed" }).on("click", () => {
        Store.targetSpeed = 0.05;
        RAFManager.setSpeed(Store.targetSpeed);
      });

      this.debug.addButton({ title: "Normal Speed" }).on("click", () => {
        Store.targetSpeed = 1;
        RAFManager.setSpeed(Store.targetSpeed);
      });
    }
  }

  setScene() {
    this.sceneHome = new Scene();
    this.sceneHome.name = 'Home';

    this.sceneIntro = new Scene();
    this.sceneIntro.name = 'Intro';

    this.sceneSki = new Scene();
    this.sceneSki.name = 'Ski';

    this.sceneWingsuit = new Scene();
    this.sceneWingsuit.name = 'Wingsuit';

    this.sceneKayak = new Scene();
    this.sceneKayak.name = 'Kayak';

    this.sceneTransi = new Scene();
    this.sceneTransi.name = 'Transition'

    this.currentScene = this.sceneHome

    this.sceneArray = [this.sceneHome, this.sceneIntro, this.sceneSki, this.sceneWingsuit, this.sceneKayak]
  }

  setSceneManager() {
    this.sceneManager = new SceneManager()
  }

  setCamera() {
    this.camera = new Camera();
  }

  setRenderer() {
    this.renderer = new Renderer();
  }

  initCD() {
    this.sceneHome.scene = new SceneHome({ assets: this.assets });
  }

  initCube() {
    this.sceneIntro.scene = new SceneIntro()
  }

  initTransi() {
    this.sceneTransi.scene = new SceneTransi()
  }

  update() {
    if (this.stats) this.stats.update();

    this.camera.update();

    this.renderer.update();
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
