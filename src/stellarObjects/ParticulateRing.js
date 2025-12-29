import * as THREE from 'three';
import { StellarObject } from "./StellarObject.js";


export class ParticulateRing extends StellarObject {
    constructor(objData) {
        super(objData);

        const ringMaterial = createParticleCloudMaterial({
            rimHex: 0x888888,
            scale: 2.0,
            bias: 0.001,
            invert: true,
            power: 2
        });

        const geometry = new THREE.TorusGeometry(objData.ringDiameter, objData.ringRadius, 64, 32);
        const ringMesh = new THREE.Mesh(geometry, ringMaterial);        


        ringMesh.name = objData.id;
        ringMesh.userData = {
            info : objData,
            isSelectable : true,
        };

        this.addStellarObject(ringMesh);
    }
}

function createParticleCloudMaterial({
    rimHex = 0x0088ff, 
    facingHex = 0x000000,
    bias = 0.9,
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
    f = (1.0 - f) / 4.0;
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
  }
  `;
  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
    // wireframe: true,
  });
  return fresnelMat;
}
