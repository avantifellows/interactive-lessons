import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter'

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()

    this.sources = sources

    this.items = []
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}

    // draco loader
    this.loaders.dracoLoader = new DRACOLoader()
    this.loaders.dracoLoader.setDecoderPath('/draco/')

    // gltf loader
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)

    // texture loader
    this.loaders.textureLoader = new THREE.TextureLoader()
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === 'GLTFModel') {
        this.loaders.gltfLoader.load(
          source.path,
          file => this.sourceLoaded(source, file),
          () => {},
          (error) => {
            /* eslint-disable-next-line no-console */
            console.log('error while loading source - ', source, error)
          },
        )
      }
      else if (source.type === 'texture') {
        this.loaders.textureLoader.load(source.path, file =>
          this.sourceLoaded(source, file),
        )
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = {
      type: source.type,
      file,
    }
    this.loaded++
    if (this.loaded === this.toLoad)
      this.trigger('ready')
  }
}
