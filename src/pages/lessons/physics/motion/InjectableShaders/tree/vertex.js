export default [
  {
    old: '#include <clipping_planes_pars_vertex>',
    new: `
          #include <clipping_planes_pars_vertex>
          uniform float uTime;
          uniform float uAliveTreeAmplitude;
          uniform float uAliveTreeFrequency;
       `,
  },
  {
    old: '#include <project_vertex>',
    new: `
          vec4 mvPosition = vec4( transformed, 1.0 );
          #ifdef USE_INSTANCING
             mvPosition = instanceMatrix * mvPosition;
          #endif
 
 
         //  transformed.y += uAliveTreeAmplitude * pow(distance(transformed.z, 0.0), 2.0) * sin(uTime * uAliveTreeFrequency);
         //  transformed.y -= uAliveTreeAmplitude * pow(distance(transformed, vec3(0.0)), 2.0) * sin(uTime * uAliveTreeFrequency);
         
         transformed.x += uAliveTreeAmplitude * pow(distance(transformed.y, 0.0), 2.0) * sin(uTime * uAliveTreeFrequency);
         transformed.z += uAliveTreeAmplitude * pow(distance(transformed.y, 0.0), 2.0) * sin(uTime * uAliveTreeFrequency);
 
          mvPosition = modelMatrix * vec4(transformed, 1.0);
          mvPosition = viewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;
       `,
  },
]
