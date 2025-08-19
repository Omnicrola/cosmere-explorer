import * as THREE from 'three';
import { asteroidMeshes } from '../data/fileResources.js';

function randomizeTransform(orbitalRadius, orbitalSpread) {

    let matrix = new THREE.Matrix4();
    const radius = orbitalRadius + (Math.random() * orbitalSpread);
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
    
    // move the entire group of instanced meshes around their orbital ring
    asteroidContainer.userData.update = (deltaTime) => {
        asteroidContainer.rotation.y += deltaTime * (asteroidData.orbitalSpeed / 200);
    };

    const instanceMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, count);
    
    let randomizedMatrix;
    const tumblers = [];
    // generate a randomized transform for each asteroid instance
    for(let i=0; i<count; i++) {
        randomizedMatrix = randomizeTransform(asteroidData.orbitalRadius, asteroidData.orbitalSpread);
        instanceMesh.setMatrixAt(i, randomizedMatrix);
        tumblers.push(Math.random());
    }

    // make all the asteroids 'tumble' as they orbit
    instanceMesh.userData.update = (deltaTime) => {
        const rotationMatrix = new THREE.Matrix4();
        const axisX = new THREE.Vector3(0, 1, 0);
        let angle = 0;

        const extractionMatrix = new THREE.Matrix4();

        for(let i=0; i<count; i++ ) {
            instanceMesh.getMatrixAt(i, extractionMatrix);
    
            angle = tumblers[i] * deltaTime;
            rotationMatrix.makeRotationAxis(axisX, angle);
            extractionMatrix.multiply(rotationMatrix);

            instanceMesh.setMatrixAt(i, extractionMatrix);
        }
        instanceMesh.instanceMatrix.needsUpdate = true;
    }

    asteroidContainer.add(instanceMesh);
    return asteroidContainer;
}

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

    return asteroidContainer;
}

export { createAsteroids }