import { shader as perlin4d } from '../partials/perlin4d.js'

export default [
  {
    old: '#include <clipping_planes_pars_vertex>',
    new: `
         #include <clipping_planes_pars_vertex>
         ${perlin4d}
         uniform float uTime;
         uniform float uBigWavesElevation;
         uniform vec2 uBigWavesFrequency;
         uniform float uBigWaveSpeed;
         varying float vDisplacement;
      `,
  },
  {
    old: '#include <project_vertex>',
    new: `
         vec4 mvPosition = vec4( transformed, 1.0 );
         #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
         #endif

         transformed *= 1.025;
         
         mvPosition = modelMatrix * vec4(transformed, 1.0);

         float displacement =
            sin(transformed.x * uBigWavesFrequency.x + (uTime * uBigWaveSpeed)) *
            sin(transformed.z * uBigWavesFrequency.y + (uTime * uBigWaveSpeed)) *
            uBigWavesElevation;

         vDisplacement = displacement;

         mvPosition.y += displacement * 0.1;

         mvPosition = viewMatrix * mvPosition;
         gl_Position = projectionMatrix * mvPosition;
      `,
  },
]
