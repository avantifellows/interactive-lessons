import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Resources from "./Utils/Resources";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import sources from "./Utils/sources";
import Debug from "./Utils/Debug";

import * as THREE from "three";
import Stats from "stats.js";
import TransformControl from "./Utils/TransformControls"

let instance = null;

export default class Application {
  constructor(_options) {
    if (instance) return instance;
    instance = this;

    this.canvas = _options.canvas;
    window.webGLApplication = this;

    this.debug = new Debug();
    if (this.debug.active) this.setupStats();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.transformControls = new TransformControl();
    this.world = new World();

    this.sizes.on("resize", () => this.resize());
    this.time.on("tick", () => {
      if (this.debug.active) this.stats.begin();
      this.update();
      if (this.debug.active) this.stats.end();
    });
  }

  setupStats() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
  }
}