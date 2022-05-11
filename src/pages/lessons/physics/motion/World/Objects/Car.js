import * as THREE from 'three'
import Application from '../../Application'

export default class Car {
  constructor() {
    this.application = new Application()
    this.scene = this.application.scene
    this.resources = this.application.resources
    this.time = this.application.time
    this.debug = this.application.debug
    this.camera = this.application.camera.instance

    this.resources.on('ready', () => {
      // config for fine-tuning parameters of the movement of car and camera
      this.config = {
        wheelRotationSpeed: 0.14,
        carPositionControl: {
          radius: 26.834,
          frequency: 8,
          displacement: 0.1,
        },
        cameraPositionControl: {
          radius: 21.682,
          frequency: 7.9,
          displacement: -0.8,
        },
      }

      this._setupDebugObject()
      this._setModel()
      this._setBakedTexture()
      this._setMaterials()
      this._attachMaterialsToObjects()
      this.scene.add(this.instance)

      // set initial rotation of the car such that it aligns with the road
      this.instance.rotation.set(
        0.0030833538596621783,
        -1.4126736957436858,
        -0.0011939653845882818,
      )
    })

    this.time.on('tick', () => {
      this._update()
    })
  }

  _setModel() {
    this.instance = this.resources.items.carModel.file.scene
  }

  _setBakedTexture() {
    // As the texture was baked in blender, the TOP property is messed up
    // changing FlipY to false otherwise the applied texture is inverted
    this.bakedTexture = this.resources.items.carBakedTexture.file
    this.bakedTexture.flipY = false

    // Better colors (NOTE - For this to work, the renderer should have this encoding as well)
    this.bakedTexture.encoding = THREE.sRGBEncoding
  }

  _setMaterials() {
    this.carMaterial = new THREE.MeshBasicMaterial({
      map: this.bakedTexture,
    })
    this.lightMaterial = new THREE.ShaderMaterial({
      vertexShader: `
            void main()
            {
               vec4 modelPosition = modelMatrix * vec4(position, 1.0);
               vec4 viewPosition = viewMatrix * modelPosition;
               vec4 projectionPosition = projectionMatrix * viewPosition;
            
               gl_Position = projectionPosition;
            }
         `,
      fragmentShader: `
            uniform float uTime;
            void main()
            {
               // blinking lights
               gl_FragColor = vec4(
                  1.0, 0.0, 0.0,
                  1.0
               );
            }
         `,
    })
  }

  _attachMaterialsToObjects() {
    this.wheels = []
    this.instance.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name.toLowerCase().includes('light'))
          child.material = this.lightMaterial
        else child.material = this.carMaterial

        if (child.name.toLowerCase().includes('wheel'))
          this.wheels.push(child)
      }
    })
  }

  _setupDebugObject() {
    this.debugFolder = null
    if (this.debug.active)
      this.debugFolder = this.debug.ui.addFolder('Car')

    if (this.debugFolder != null) {
      this.debugFolder
        .add(this.config, 'wheelRotationSpeed')
        .name('Wheel Rotation Speed')
        .min(-2)
        .max(2)
        .step(0.001)

      this.debugFolder
        .add(this.config.carPositionControl, 'radius')
        .name('Car Radius')
        .min(0)
        .max(30)
        .step(0.001)
      this.debugFolder
        .add(this.config.carPositionControl, 'frequency')
        .name('Car Rotation Frequency')
        .min(0)
        .max(100)
        .step(0.001)
      this.debugFolder
        .add(this.config.carPositionControl, 'displacement')
        .name('Car Path Displacement')
        .min(0)
        .max(10)
        .step(0.001)

      this.debugFolder
        .add(this.config.cameraPositionControl, 'radius')
        .name('Camera Radius')
        .min(0)
        .max(30)
        .step(0.001)
      this.debugFolder
        .add(this.config.cameraPositionControl, 'frequency')
        .name('Camera Rotation Frequency')
        .min(0)
        .max(100)
        .step(0.001)
      this.debugFolder
        .add(this.config.cameraPositionControl, 'displacement')
        .name('Camera Path Displacement')
        .min(0)
        .max(10)
        .step(0.001)
    }
  }

  _moveCarOnTick() {
    // Updating the x and z co-ordinate every tick to make the car move in a circle
    // different parameters are controlled by a config object
    this.instance.position.x
        = this.config.carPositionControl.radius
        * Math.cos(
          this.time.elapsed * 0.00001
            * this.config.carPositionControl.frequency
            + this.config.carPositionControl.displacement,
        )

    this.instance.position.z
        = this.config.carPositionControl.radius
        * Math.sin(
          this.time.elapsed * 0.00001
            * this.config.carPositionControl.frequency
            + this.config.carPositionControl.displacement,
        )

    // handles allignemnt of the car with the road
    this.instance.lookAt(0, 0, 0)

    // rotate the wheels
    this.wheels.forEach(wheel => (wheel.rotation.z -= this.config.wheelRotationSpeed))
  }

  _moveCameraOnTick() {
    // Updating the x and z co-ordinates of the camera at every tick to make the camera move in a circle as well
    this.camera.position.x = this.config.cameraPositionControl.radius
        * Math.cos(
          this.time.elapsed * 0.00001
          * this.config.cameraPositionControl.frequency
          + this.config.cameraPositionControl.displacement,
        )
    this.camera.position.z = this.config.cameraPositionControl.radius
        * Math.sin(
          this.time.elapsed * 0.00001
          * this.config.cameraPositionControl.frequency
          + this.config.cameraPositionControl.displacement,
        )
  }

  _cameraLookAtCar() {
    // after the position change of the camera, have it look at the car
    this.camera.lookAt(this.instance.position)
  }

  _update() {
    if (this.instance !== undefined) {
      this._moveCarOnTick()
      this._moveCameraOnTick()
      this._cameraLookAtCar()
    }
  }
}
