// import * as THREE from 'three'
import Application from '../Application'
import Axes from '../Utils/Axes'
import Car from './Objects/Car'
import LandMass from './Objects/LandMass'

export default class World {
  constructor() {
    this.application = new Application()
    this.scene = this.application.scene
    this.resources = this.application.resources
    this.time = this.application.time
    if (this.application.debug.active)
      this.axes = new Axes(10)
    this.car = new Car()
    this.landMass = new LandMass()
  }
}
