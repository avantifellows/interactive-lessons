export default [
  {
    old: 'void main() {',
    new: `
          uniform float uColorOffset;
          uniform float uColorMultiplier;
 
          varying float vDisplacement;
          void main() {
       `,
  },
  {
    old: '#include <dithering_fragment>',
    new: `
          // the color to mix with the gl_FragColor.
          // 0.0 is BLACK and 1.0 is WHITE. If the particle is higher, add white to it
          // else take some white away from it. it is smoothed out to avoid sharp edges
          float colorToMix = smoothstep(-1.0, 1.0, vDisplacement);
 
          // the mixing strength to control the dependence on vDisplacement
          float mixingStrength = (vDisplacement + uColorOffset) * uColorMultiplier;
 
          // updating all three channels separately
          gl_FragColor.r = mix(gl_FragColor.r, colorToMix, mixingStrength);
          gl_FragColor.g = mix(gl_FragColor.g, colorToMix, mixingStrength);
          gl_FragColor.b = mix(gl_FragColor.b, colorToMix, mixingStrength);
          gl_FragColor.b -= 0.15;
       `,
  },
]
