// Makes instanced meshes 'tumble' on the GPU: each instance spins around its own Y axis at
// the speed given by its 'tumbleSpeed' instance attribute (radians per second).
// The CPU only advances a single time uniform per frame, rather than rewriting every
// instance matrix.

const TUMBLE_SPEED_ATTRIBUTE = 'tumbleSpeed';

const TUMBLE_HEADER = /* glsl */`
attribute float tumbleSpeed;
uniform float uTumbleTime;

// rotation around the instance's local Y axis (same convention as Matrix4.makeRotationY)
mat3 tumbleRotation() {
    float angle = tumbleSpeed * uTumbleTime;
    float c = cos(angle);
    float s = sin(angle);
    return mat3(c, 0.0, -s,   0.0, 1.0, 0.0,   s, 0.0, c);
}
`;

// shader chunks the tumble code hooks into; these exist in all of three's lit materials
const INJECTIONS = [
    ['#include <common>', TUMBLE_HEADER],
    ['#include <beginnormal_vertex>', 'objectNormal = tumbleRotation() * objectNormal;'],
    ['#include <begin_vertex>', 'transformed = tumbleRotation() * transformed;'],
];

function injectTumble(vertexShader) {
    return INJECTIONS.reduce((shader, [chunk, code]) => {
        if(!shader.includes(chunk)) {
            throw new Error(`tumble shader: '${chunk}' not found in vertex shader`);
        }
        return shader.replace(chunk, `${chunk}\n${code}`);
    }, vertexShader);
}

// Returns a copy of baseMaterial with tumbling added. Advance it with advanceTumble().
function createTumbleMaterial(baseMaterial) {
    const material = baseMaterial.clone();
    const tumbleTime = { value: 0 };

    material.onBeforeCompile = (shader) => {
        shader.uniforms.uTumbleTime = tumbleTime;
        shader.vertexShader = injectTumble(shader.vertexShader);
    };
    // keep the modified program separate from the un-modified material's program
    material.customProgramCacheKey = () => 'tumble';
    material.userData.tumbleTime = tumbleTime;

    return material;
}

function advanceTumble(material, deltaTime) {
    material.userData.tumbleTime.value += deltaTime;
}

export { createTumbleMaterial, advanceTumble, injectTumble, TUMBLE_SPEED_ATTRIBUTE };
