import * as dat from "lil-gui";

export default class Debug {
  constructor() {
    this.active = window.location.hash.includes("debug");
    if (this.active) this.ui = new dat.GUI();
  }
}