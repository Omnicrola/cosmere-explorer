import * as THREE from "three";
import atmo_fragmentShader from './shaders/atmo_fragment.glsl.js';
import atmo_vertexShader from './shaders/atmo_vertex.glsl.js';
import fresnel_fragmentShader from './shaders/fresnel_fragment.glsl.js';
import fresnel_vertexShader from './shaders/fresnel_vertex.glsl.js';

const texLoader = new THREE.TextureLoader();

// Glow that depends on how edge-on the surface is to the camera.
//   backSide       - render the inside of the mesh (for a halo drawn around an object)
//   invertFalloff  - brightest facing the camera, fading towards the rim (a hazy cloud)
//   intensity      - overall brightness/opacity multiplier
function createFresnelMaterial({
    rimHex = 0x0088ff,
    facingHex = 0x000000,
    bias = 0.2,       // size of the *rim*
    scale = 1.5,
    power = 4,
    backSide = false,
    invertFalloff = false,
    intensity = 1.0,
} = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(rimHex) },
      color2: { value: new THREE.Color(facingHex) },
      fresnelBias: { value: bias },
      fresnelScale: { value: scale },
      fresnelPower: { value: power },
      intensity: { value: intensity },
    },
    defines: invertFalloff ? { INVERT_FALLOFF: '' } : {},
    vertexShader: fresnel_vertexShader,
    fragmentShader: fresnel_fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: backSide ? THREE.BackSide : THREE.FrontSide,
  });
}

// make material for a planet surface
function createPlanetMaterial(planetData, pathOverride = './resources/textures/') {
  if(planetData.textureMap){
    const albedoMap = texLoader.load(pathOverride + planetData.textureMap);
    const oceanMap = planetData.oceanMap ? texLoader.load(pathOverride + planetData.oceanMap) : null;


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
    return new THREE.MeshStandardMaterial({color: planetData.color});
  }
}

// planetary atmosphere halo
function createAtmosphericShader(planetData) {

  let atmosphereColor = planetData.atmosphericColor;

  let atmosMat = new THREE.ShaderMaterial({
    vertexShader: atmo_vertexShader,
    fragmentShader: atmo_fragmentShader,
    uniforms: {
      atmOpacity: { value: 0.7 },
      atmPowFactor: { value: 4.1 },
      atmMultiplier: { value: 9.5 },
      atmo_rgb : { value: atmosphereColor },
    },
    blending: THREE.AdditiveBlending, 
    side: THREE.BackSide 
  });
  return atmosMat;
}

// planetary rings 
function createRingMaterial(albedoMapFile, alphaMapFile) {
  const albedoMap = texLoader.load(`./resources/textures/${albedoMapFile}`);
      const ringMaterial = new THREE.MeshStandardMaterial({
            map: albedoMap,
            alphaMap: texLoader.load(`./resources/textures/${alphaMapFile}`),
            transparent: true,
            roughness: 0.6,
            metalness: 0.5,
            emissive: 0xffffff,
            emissiveMap: albedoMap,
            emissiveIntensity: 0.05
          });

    return ringMaterial;
}

export { createPlanetMaterial, createFresnelMaterial, createAtmosphericShader, createRingMaterial };