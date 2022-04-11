import Application from "../Application";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

export default class TransformControl {
   constructor() {
      this.application = new Application();
      this.scene = this.application.scene;
      this.resources = this.application.resources;
      this.time = this.application.time;
      this.camera = this.application.camera;
      this.canvas = this.application.canvas;
      this.debug = this.application.debug;

      // the transform control instances currently in the scene will be stored
      // in this property
      this.instances = {}

      // change the mode of the controls (translate, rotate, scale)
      window.addEventListener('keydown', (event) => {
         let instances = this.application.transformControls.instances
         if (Object.keys(instances).length == 0) return
         switch (event.code) {
            case "KeyW":
               for (let [,instanceDetails] of Object.entries(instances)) {
                  instanceDetails.instance.setMode( 'translate' );
               }
               break;
         
            case "KeyR":
               for (let [, instanceDetails] of Object.entries(instances)) {
                  instanceDetails.instance.setMode( 'rotate' );
               }
               break;

            case "KeyS":
               for (let [, instanceDetails] of Object.entries(instances)) {
                  instanceDetails.instance.setMode( 'scale' );
               }
               break;
            case "KeyZ": // does not work for some reason :(
               if (event.metaKey || event.ctrlKey) {
                  for (let [, instanceDetails] of Object.entries(instances)) {
                     instanceDetails.instance.reset();
                  }
               }
               break;
            default:
               break;
         }
      })
   }

   attachToObject(mesh) {
      let newInstanceId = this.createInstance()
      this.instances[newInstanceId].instance.attach(mesh)
      this.scene.add(this.instances[newInstanceId].instance)
   }

   detachFromObject(id) {
      let instance = this.instances[id].instance
      instance.detach(instance.object)
      this.disposeInstance(id)
   }

   createInstance() {
      let newInstance = new TransformControls( this.camera.instance, this.canvas );
      let disableOrbitEventListener = (isBeingDragged) => {
         this.camera.controls.enabled = !isBeingDragged.value
      }
      let logObjectProperties = (transformControlsInstance) => {
         console.log("position", transformControlsInstance.object.position)
         console.log("rotation", transformControlsInstance.object.rotation)
         console.log("scale", transformControlsInstance.object.scale)
      }

      newInstance.addEventListener('dragging-changed', disableOrbitEventListener)
      newInstance.addEventListener('objectChange', () => logObjectProperties(newInstance))
      this.instances[newInstance.id] = {
         instance: newInstance,
         eventListeners: [
            disableOrbitEventListener,
            logObjectProperties,
         ]
      }
      return newInstance.id
   }

   disposeInstance(id) {
      // TODo: REMOVE EVENT LISTENERS HERE
      this.instances[id].instance.dispose()
      delete this.instances[id]
   }
}