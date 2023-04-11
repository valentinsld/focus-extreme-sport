import { AxesHelper, Scene} from "three";
import { Pane } from "tweakpane";

import RAFManager from "./Utils/RAFManager.js";
import Sizes from "./Utils/Sizes.js";
import Stats from "./Utils/Stats.js";
import Assets from "./Utils/Loader.js"

import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import EventEmitter from "./Utils/EventEmitter.js";

import SceneTest from '~~/webgl/Scenes/SceneTest';
import Store from '~~/webgl/Utils/Store.js';

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
      this.initCube();
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
      this.scene.add(axesHelper);

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
    this.scene = new Scene();
  }

  setCamera() {
    this.camera = new Camera();
  }

  setRenderer() {
    this.renderer = new Renderer();
  }

  initCube() {
    new SceneTest({ assets: this.assets });
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
