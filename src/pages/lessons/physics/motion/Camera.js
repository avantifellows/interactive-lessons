import * as THREE from 'three'
// NOTE -- make sure to import THREE modules as a `.js` file extension
// reason -- https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

    // camera at some radius from the origin of the scene circle
    this.instance.position.set(
      -18.592536199480108,
      4.5359548000462215,
      -14.327241525090928,
    )
    this.scene.add(this.instance)
  }

  setOrbitControls() {
    // commented out such that the custom camera movement works properly
    // for debugging purposes -- uncomment

    // this.controls = new OrbitControls(this.instance, this.canvas)
    // this.controls.enableDamping = true

    // this.controls.target.set(0, 0, 0)
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    // commented out such that the custom camera movement works properly
    // for debugging purposes -- uncomment

    // this.controls.update()
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
      if ('controls' in this)
        console.log(this.controls.target)
      /* eslint-enable no-console */
    }

    // helper debug button to log the current camera position and orbit control targets
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

    // works only when orbit controls are defined and initialized
    this.debugFolder
      .add(this.debugObject, 'enableOrbitControls')
      .name('Orbit Controls')
      .onFinishChange((value) => {
        this.controls.enabled = !!value
      })
  }
}
