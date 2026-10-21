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

// Meshes with transmission (glass-like materials) are excluded from the bloom pass.
// Collected once per system, rather than traversing the whole scene twice per frame.
function collectTransmissionMeshes(root) {
    const meshes = [];
    root.traverse((obj) => {
        if(obj.isMesh && obj.material?.transmission > 0) {
            meshes.push(obj);
        }
    });
    return meshes;
}

// moves meshes between layer 0 (rendered) and layer 1 (hidden from the camera)
function setBloomVisibility(meshes, isVisible) {
    meshes.forEach((obj) => {
        if(isVisible) {
            obj.layers.enable(0);
            obj.layers.disable(1);
        } else {
            obj.layers.disable(0);
            obj.layers.enable(1);
        }
    });
}

export {
    createMixPass,
    collectTransmissionMeshes,
    setBloomVisibility,
 };
