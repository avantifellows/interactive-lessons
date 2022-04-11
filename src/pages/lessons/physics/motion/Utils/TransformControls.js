import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import Application from '../Application'

export default class TransformControl {
  constructor() {
    this.application = new Application()
    this.scene = this.application.scene
    this.resources = this.application.resources
    this.time = this.application.time
    this.camera = this.application.camera
    this.canvas = this.application.canvas
    this.debug = this.application.debug

    // the transform control instances currently in the scene will be stored
    // in this property
    this.instances = {}

    // change the mode of the controls (translate, rotate, scale)
    window.addEventListener('keydown', (event) => {
      const instances = this.application.transformControls.instances
      if (Object.keys(instances).length === 0)
        return
      switch (event.code) {
        case 'KeyW':
          for (const [, instanceDetails] of Object.entries(instances))
            instanceDetails.instance.setMode('translate')

          break

        case 'KeyR':
          for (const [, instanceDetails] of Object.entries(instances))
            instanceDetails.instance.setMode('rotate')

          break

        case 'KeyS':
          for (const [, instanceDetails] of Object.entries(instances))
            instanceDetails.instance.setMode('scale')

          break
        case 'KeyZ': // does not work for some reason :(
          if (event.metaKey || event.ctrlKey) {
            for (const [, instanceDetails] of Object.entries(instances))
              instanceDetails.instance.reset()
          }
          break
        default:
          break
      }
    })
  }

  attachToObject(mesh) {
    const newInstanceId = this.createInstance()
    this.instances[newInstanceId].instance.attach(mesh)
    this.scene.add(this.instances[newInstanceId].instance)
  }

  detachFromObject(id) {
    const instance = this.instances[id].instance
    instance.detach(instance.object)
    this.disposeInstance(id)
  }

  createInstance() {
    const newInstance = new TransformControls(this.camera.instance, this.canvas)
    const disableOrbitEventListener = (isBeingDragged) => {
      this.camera.controls.enabled = !isBeingDragged.value
    }
    const logObjectProperties = (transformControlsInstance) => {
      /* eslint-disable no-console */
      console.log('position', transformControlsInstance.object.position)
      console.log('rotation', transformControlsInstance.object.rotation)
      console.log('scale', transformControlsInstance.object.scale)
      /* eslint-enable no-console */
    }

    newInstance.addEventListener('dragging-changed', disableOrbitEventListener)
    newInstance.addEventListener('objectChange', () => logObjectProperties(newInstance))
    this.instances[newInstance.id] = {
      instance: newInstance,
      eventListeners: [
        disableOrbitEventListener,
        logObjectProperties,
      ],
    }
    return newInstance.id
  }

  disposeInstance(id) {
    // TODo: REMOVE EVENT LISTENERS HERE
    this.instances[id].instance.dispose()
    delete this.instances[id]
  }
}
