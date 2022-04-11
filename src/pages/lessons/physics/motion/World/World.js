// import * as THREE from 'three'
import Application from '../Application'
import DummyCube from '../Utils/DummyCube'
// import Grid from "@/Application/World/Objects/Grid";
// import Axes from "../Utils/Axes";

export default class World {
  constructor() {
    this.application = new Application()
    this.scene = this.application.scene
    this.resources = this.application.resources
    this.time = this.application.time
    // this.axes = new Axes(10)
    //  this.grid = new Grid(1000, 500, this.gravityObjects);
    this.dummyCube = new DummyCube()
  }
}
