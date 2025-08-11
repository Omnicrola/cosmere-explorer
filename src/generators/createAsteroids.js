import * as THREE from 'three';
import { asteroidMeshes } from '../fileResources.js';

function randomizeTransform(orbitalRadius, orbitalSpread) {

    let matrix = new THREE.Matrix4();
    const radius = orbitalRadius + Math.random() * 0.1 - 0.05;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.random() * 5 - 2.5;
    const z = Math.sin(angle) * radius;
    let position = new THREE.Vector3(x,y,z);

    let quaternion = new THREE.Quaternion();
    quaternion.random();

    let scale = new THREE.Vector3().setScalar(Math.random() * 2 - 0.5);

    matrix.compose(position, quaternion, scale);
    return matrix;
}

function createInstancedGroup(mesh, count, asteroidData) {
    const asteroidContainer = new THREE.Group();
    asteroidContainer.userData.update = (deltaTime) => {
        asteroidContainer.rotation.y += deltaTime * (asteroidData.orbitalSpeed / 100);
    };

    const instanceMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, count);
    
    let randomizedMatrix;
    for(let i=0; i<count; i++) {
        randomizedMatrix = randomizeTransform(asteroidData.orbitalRadius, asteroidData.orbitalSpread);
        instanceMesh.setMatrixAt(i, randomizedMatrix);
    }

    asteroidContainer.add(instanceMesh);
    return asteroidContainer;
}

const baseMesh = new THREE.IcosahedronGeometry(10, 1);
const baseMaterial = new THREE.MeshBasicMaterial();
function createAsteroids(asteroidData) {

    const asteroidContainer = new THREE.Group();
    if(!asteroidData) {
        return asteroidContainer;
    }

    asteroidMeshes.forEach((p) => {
        p.then((mesh) => {
            asteroidContainer.add(createInstancedGroup(mesh, asteroidData.density, asteroidData));
        });
    });
    // asteroidContainer.add(createInstancedGroup(baseMesh, asteroidData.density, asteroidData));

    return asteroidContainer;
}

export { createAsteroids }