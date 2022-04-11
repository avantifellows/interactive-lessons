import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Application from './Application'

export default class Camera {
  constructor() {
    this.application = new Application()

    this.sizes = this.application.sizes
    this.time = this.application.time
    this.scene = this.application.scene
    this.canvas = this.application.canvas

    this.setInstance()
    this.setOrbitControls()
    if (this.application.debug.active)
      this.setupDebugUI()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      1000,
    )

    // camera in center
    this.instance.position.set(
      5,
      5,
      5,
    )
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true

    // target on planetPrime
    this.controls.target.set(0, 0, 0)
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }

  setupDebugUI() {
    this.debug = this.application.debug
    this.debugFolder = this.debug.ui.addFolder('Camera')
    this.debugObject = {
      enableCameraPositionLogging: false,
      enableOrbitControls: true,
    }

    const logCameraPosition = () => {
      /* eslint-disable no-console */
      console.log(this.instance.position)
      console.log(this.controls.target)
      /* eslint-enable no-console */
    }

    this.debugFolder
      .add(this.debugObject, 'enableCameraPositionLogging')
      .name('Log Camera Position')
      .onFinishChange((value) => {
        /* eslint-disable-next-line no-console */
        console.log(this.controls)
        if (value)
          this.controls.addEventListener('change', logCameraPosition)
        else this.controls.removeEventListener('change', logCameraPosition)
      })

    this.debugFolder
      .add(this.debugObject, 'enableOrbitControls')
      .name('Orbit Controls')
      .onFinishChange((value) => {
        this.controls.enabled = !!value
      })
  }
}
