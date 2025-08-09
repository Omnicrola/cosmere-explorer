import * as THREE from "three";
import atmo_fragmentShader from './shaders/atmo_fragment.glsl.js';
import atmo_vertexShader from './shaders/atmo_vertex.glsl.js';

const texLoader = new THREE.TextureLoader();

function createFresnelMaterial({
    rimHex = 0x0088ff, 
    facingHex = 0x000000,
    bias = 0.2,
    scale = 1.5,
    power = 4,
    invert = false
} = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },
    color2: { value: new THREE.Color(facingHex) },
    fresnelBias: { value: bias}, // size of the *rim*
    fresnelScale: { value: scale },
    fresnelPower: { value: power },
  };
  const vs = `
  uniform float fresnelBias;
  uniform float fresnelScale;
  uniform float fresnelPower;
  
  varying float vReflectionFactor;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  
    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  
    vec3 I = worldPosition.xyz - cameraPosition;
  
    vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
  
    gl_Position = projectionMatrix * mvPosition;
  }
  `;
  const fs = `
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying float vReflectionFactor;
  
  void main() {
    float f = clamp( vReflectionFactor, 0.0, 1.0 );
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
  }
  `;
  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: invert?THREE.BackSide : 0

    // wireframe: true,
  });
  return fresnelMat;
}

// make material for a planet surface
function createPlanetMaterial(planetData) {
  if(planetData.textureMap){
    const albedoMap = texLoader.load(`./resources/textures/${planetData.textureMap}`);
    const oceanMap = texLoader.load(`./resources/textures/${planetData.oceanMap}`);


    const planetMaterial = new THREE.MeshStandardMaterial({
      map: albedoMap,
      roughnessMap: oceanMap,
      metalnessMap: oceanMap,
      metalness: 0.1
    });

    planetMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
        float roughnessFactor = roughness;

        #ifdef USE_ROUGHNESSMAP

          vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
          // reversing the black and white values because we provide the ocean map
          texelRoughness = vec4(1.0) - texelRoughness;

          // reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
          roughnessFactor *= clamp(texelRoughness.g, 0.5, 1.0);

        #endif
        `);

    };

    return planetMaterial;

  } else {
    return new THREE.MeshStandardMaterial({color: planetData.planetColor});
  }
}
function createAtmosphericShader(planetData) {

  const params = {
    atmOpacity: { value: 0.7 },
    atmPowFactor: { value: 4.1 },
    atmMultiplier: { value: 9.5 },
  }

  let atmosMat = new THREE.ShaderMaterial({
    vertexShader: atmo_vertexShader,
    fragmentShader: atmo_fragmentShader,
    uniforms: {
      atmOpacity: params.atmOpacity,
      atmPowFactor: params.atmPowFactor,
      atmMultiplier: params.atmMultiplier
    },
    blending: THREE.AdditiveBlending, 
    side: THREE.BackSide 
  });
  return atmosMat;
}

export { createPlanetMaterial, createFresnelMaterial, createAtmosphericShader };