import * as THREE from 'three'
import Application from '../Application'

export default class DummyCube {
  constructor() {
    this.application = new Application()
    this.scene = this.application.scene
    this.resources = this.application.resources
    this.time = this.application.time

    this.geometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshNormalMaterial()

    this.mesh = new THREE.Mesh(
      this.geometry, this.material,
    )
    this.scene.add(this.mesh)
  }
}
