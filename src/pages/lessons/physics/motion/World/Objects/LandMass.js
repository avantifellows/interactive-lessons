import * as THREE from 'three'
import Application from '../../Application'

import { injectIntoShader } from '../../Utils/Shaders.js'
import seaMaterialVShader from '../../InjectableShaders/sea/vertex.js'
import seaMaterialFShader from '../../InjectableShaders/sea/fragment.js'
import aliveTreeMaterialVShader from '../../InjectableShaders/tree/vertex.js'

export default class LandMass {
  constructor() {
    this.application = new Application()
    this.scene = this.application.scene
    this.resources = this.application.resources
    this.time = this.application.time
    this.debug = this.application.debug

    this.resources.on('ready', () => {
      this._setModel()
      this._setBakedTexture()
      this._setMaterials()
      this._attachMaterialsToObjects()
      this._injectCustomShaders()
      this.setupDebugObject()
      this.scene.add(this.instance)
      this.time.on('tick', () => {
        this._update()
      })
    })
  }

  _setModel() {
    this.rocksModel = this.resources.items.rocksModel.file.scene
    this.riverModel = this.resources.items.riverModel.file.scene
    this.landMassModel = this.resources.items.landMassModel.file.scene
    this.treesModel = this.resources.items.treesModel.file.scene

    this.instance = new THREE.Group()
    this.instance.add(this.rocksModel)
    this.instance.add(this.riverModel)
    this.instance.add(this.landMassModel)
    this.instance.add(this.treesModel)
  }

  _setBakedTexture() {
    this.bakedTextures = {}
    this.bakedTextures.rocksBakedTexture = this.resources.items.rocksBakedTexture.file
    this.bakedTextures.landMassAndRiverBakedTexture = this.resources.items.landMassAndRiverBakedTexture.file
    this.bakedTextures.treesBakedTexture = this.resources.items.treesBakedTexture.file
    this.bakedTextures.riverBakedTexture = this.resources.items.riverBakedTexture.file

    for (const key in this.bakedTextures) {
      // As the texture was baked in blender, the TOP property is messed up
      // changing FlipY to false otherwise the applied texture is inverted
      this.bakedTextures[key].flipY = false

      // Better colors (NOTE - For this to work, the renderer should have this encoding as well)
      this.bakedTextures[key].encoding = THREE.sRGBEncoding
    }
  }

  _setMaterials() {
    this.rocksMaterial = new THREE.MeshBasicMaterial({
      map: this.bakedTextures.rocksBakedTexture,
    })

    this.riverMaterial = new THREE.MeshBasicMaterial({
      map: this.bakedTextures.riverBakedTexture,
    })

    this.landMassMaterial = new THREE.MeshBasicMaterial({
      map: this.bakedTextures.landMassAndRiverBakedTexture,
    })

    this.treesMaterial = new THREE.MeshBasicMaterial({
      map: this.bakedTextures.treesBakedTexture,
    })
  }

  _attachMaterialsToObjects() {
    this.instance.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === 'landMass')
          child.material = this.landMassMaterial
        else if (child.name.toLowerCase().includes('river'))
          child.material = this.riverMaterial
        else if (child.name === 'rocks')
          child.material = this.rocksMaterial
        else if (child.name === 'trees')
          child.material = this.treesMaterial
      }
    })
  }

  _injectCustomShaders() {
    this.customUniforms = {
      uTime: {
        value: 0.0,
      },
      uBigWavesElevation: {
        value: 1.31,
      },
      uBigWavesFrequency: {
        value: new THREE.Vector2(7.116, 2.658),
      },
      uBigWaveSpeed: {
        value: 1.2,
      },
      uColorOffset: {
        value: -0.145,
      },
      uColorMultiplier: {
        value: 0.062,
      },
      uAliveTreeAmplitude: {
        value: 0.024,
      },
      uAliveTreeFrequency: {
        value: 1.2,
      },
    }

    this.riverMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.customUniforms.uTime
      shader.uniforms.uBigWavesElevation = this.customUniforms.uBigWavesElevation
      shader.uniforms.uBigWavesFrequency = this.customUniforms.uBigWavesFrequency
      shader.uniforms.uBigWaveSpeed = this.customUniforms.uBigWaveSpeed
      shader.uniforms.uColorOffset = this.customUniforms.uColorOffset
      shader.uniforms.uColorMultiplier = this.customUniforms.uColorMultiplier

      shader.vertexShader = injectIntoShader(
        seaMaterialVShader,
        shader.vertexShader,
      )
      shader.fragmentShader = injectIntoShader(
        seaMaterialFShader,
        shader.fragmentShader,
      )
    }

    this.treesMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.customUniforms.uTime
      shader.uniforms.uAliveTreeAmplitude = this.customUniforms.uAliveTreeAmplitude
      shader.uniforms.uAliveTreeFrequency = this.customUniforms.uAliveTreeFrequency

      shader.vertexShader = injectIntoShader(
        aliveTreeMaterialVShader,
        shader.vertexShader,
      )
    }
  }

  setupDebugObject() {
    this.debugObject = {
    }
    this.debugFolder = null
    if (this.debug.active)
      this.debugFolder = this.debug.ui.addFolder('LandMass')

    if (this.debugFolder != null) {
      this.debugFolder
        .add(this.customUniforms.uBigWavesElevation, 'value')
        .min(0)
        .max(10)
        .step(0.001)
        .name('uBigWavesElevation')

      this.debugFolder
        .add(this.customUniforms.uBigWavesFrequency.value, 'x')
        .min(0)
        .max(10)
        .step(0.001)
        .name('uBigWavesFrequencyX')

      this.debugFolder
        .add(this.customUniforms.uBigWavesFrequency.value, 'y')
        .min(0)
        .max(10)
        .step(0.001)
        .name('uBigWavesFrequencyY')

      this.debugFolder
        .add(this.customUniforms.uBigWaveSpeed, 'value')
        .min(0)
        .max(10)
        .step(0.001)
        .name('uBigWaveSpeed')

      this.debugFolder
        .add(this.customUniforms.uColorOffset, 'value')
        .min(-1)
        .max(1)
        .step(0.001)
        .name('uColorOffset')

      this.debugFolder
        .add(this.customUniforms.uColorMultiplier, 'value')
        .min(0)
        .max(1)
        .step(0.001)
        .name('uColorMultiplier')

      this.debugFolder
        .add(this.customUniforms.uAliveTreeAmplitude, 'value')
        .min(-5)
        .max(5)
        .step(0.001)
        .name('uAliveTreeAmplitude')

      this.debugFolder
        .add(this.customUniforms.uAliveTreeFrequency, 'value')
        .min(-5)
        .max(5)
        .step(0.001)
        .name('uAliveTreeFrequency')
    }
  }

  _update() {
    this.customUniforms.uTime.value = this.time.elapsed * 0.001
  }
}
