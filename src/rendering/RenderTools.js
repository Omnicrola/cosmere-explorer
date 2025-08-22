import * as THREE from "three";
import { ShaderPass } from 'jsm/postprocessing/ShaderPass.js';

function createMixPass(bloomComposer) {
    const mixPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: `
            varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
            `,
            fragmentShader: `
            uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;
			void main() {
				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
			}
            `,
            defines: {}
        } ), 'baseTexture'
    );
    mixPass.needsSwap = true;

    return mixPass;
}

// used to traverse the scene before the bloom pass
function disableTransmissionMeshes(obj) {
    if(obj.isMesh) {
        if(obj.material && obj.material.transmission > 0) {
            obj.layers.disable(0);
            obj.layers.enable(1);
        }
    }
}

function enableTransmissonMeshes(obj) {
    if(obj.isMesh) {
        if(obj.material && obj.material.transmission > 0) {
            obj.layers.enable(0);
            obj.layers.disable(1);
        }
    }
}
export { 
    createMixPass,
    disableTransmissionMeshes,
    enableTransmissonMeshes
 };