import * as THREE from 'three';
import { sceneContext } from '../src/core/sceneContext.js';
import { createCameraControls } from '../src/core/cameraRig.js';

// The DOM elements from index.html that the UI modules expect to find.
function mountAppDom() {
    document.body.innerHTML = `
        <select id="system-selector"></select>
        <button id="btn-system-info"><h1 id="system-name"></h1></button>
        <button id="previous-planet"></button>
        <select id="planet-select"></select>
        <button id="next-planet"></button>
        <div id="info-panel" class="panel hidden"></div>
        <canvas id="canvas"></canvas>
    `;
}

// A real scene, camera and camera controls (not connected to any DOM element).
function installSceneContext() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 1, 20000); // same near/far planes as the app
    scene.add(camera);

    const cameraControls = createCameraControls(camera);
    cameraControls.setLookAt(0, 0, 10, 0, 0, 0, false);
    cameraControls.update(0);
    camera.updateMatrixWorld();

    Object.assign(sceneContext, { scene, camera, cameraControls, renderer: null });
    return { scene, camera, cameraControls };
}

// runs the camera for a number of seconds at 60fps, calling onFrame after each frame
function simulateCamera(seconds, updateCamera, onFrame = () => {}) {
    const frames = Math.round(seconds * 60);
    for(let i = 0; i < frames; i++) {
        updateCamera(1 / 60);
        sceneContext.camera.updateMatrixWorld();
        onFrame(i);
    }
}

function makeSelectableSphere(name, radius, position) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshBasicMaterial());
    mesh.name = name;
    mesh.position.copy(position);
    mesh.userData = { isSelectable: true, info: { name, description: '', stellarObjectType: 2 } };
    return mesh;
}

export { mountAppDom, installSceneContext, makeSelectableSphere, simulateCamera };
