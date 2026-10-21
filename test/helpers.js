import * as THREE from 'three';
import { vi } from 'vitest';
import { sceneContext } from '../src/core/sceneContext.js';

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

// A real scene and camera, with a minimal stand-in for OrbitControls.
function installSceneContext() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    scene.add(camera);

    const orbitControls = {
        target: new THREE.Vector3(),
        autoRotate: false,
        update: vi.fn(),
    };

    Object.assign(sceneContext, { scene, camera, orbitControls, renderer: null });
    return { scene, camera, orbitControls };
}

function makeSelectableSphere(name, radius, position) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshBasicMaterial());
    mesh.name = name;
    mesh.position.copy(position);
    mesh.userData = { isSelectable: true, info: { name, description: '', stellarObjectType: 2 } };
    return mesh;
}

export { mountAppDom, installSceneContext, makeSelectableSphere };
