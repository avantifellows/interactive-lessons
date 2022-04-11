import * as THREE from 'three'
import Application from '../Application'

export default class Axes {
  constructor(size) {
    this.application = new Application()
    this.scene = this.application.scene

    const axesHelper = new THREE.AxesHelper(size)
    this.scene.add(axesHelper)
  }
}
