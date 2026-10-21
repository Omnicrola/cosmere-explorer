import * as THREE from 'three';
import { loadAsteroidMeshes } from '../data/fileResources.js';

const MIN_ASTEROID_SCALE = 0.2;
const MAX_ASTEROID_SCALE = 1.5;

// scratch objects reused by every tumble update, to avoid per-frame allocations
const TUMBLE_AXIS = new THREE.Vector3(0, 1, 0);
const rotationMatrix = new THREE.Matrix4();
const extractionMatrix = new THREE.Matrix4();

export class AsteroidBelt extends THREE.Group {
    constructor(asteroidData) {
        super();

        loadAsteroidMeshes().forEach((p) => {
            p.then((mesh) => {
                this.add(AsteroidBelt.createInstancedGroup(mesh, asteroidData.density, asteroidData));
            }).catch((err) => console.error('Failed to load asteroid mesh', err));
        });
    }

    static createInstancedGroup(mesh, count, asteroidData) {
        const asteroidContainer = new THREE.Group();

        // move the entire group of instanced meshes around their orbital ring
        asteroidContainer.userData.update = (deltaTime) => {
            asteroidContainer.rotation.y += deltaTime * (asteroidData.orbitalSpeed / 200);
        };

        const instanceMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, count);

        const tumblers = [];
        // generate a randomized transform for each asteroid instance
        for(let i=0; i<count; i++) {
            instanceMesh.setMatrixAt(i, AsteroidBelt.randomizeTransform(asteroidData.orbitalRadius, asteroidData.orbitalSpread));
            tumblers.push(Math.random());
        }

        // make all the asteroids 'tumble' as they orbit
        instanceMesh.userData.update = (deltaTime) => {
            for(let i=0; i<count; i++ ) {
                instanceMesh.getMatrixAt(i, extractionMatrix);
                rotationMatrix.makeRotationAxis(TUMBLE_AXIS, tumblers[i] * deltaTime);
                extractionMatrix.multiply(rotationMatrix);
                instanceMesh.setMatrixAt(i, extractionMatrix);
            }
            instanceMesh.instanceMatrix.needsUpdate = true;
        }

        asteroidContainer.add(instanceMesh);
        return asteroidContainer;
    }

    static randomizeTransform(orbitalRadius, orbitalSpread) {

        const matrix = new THREE.Matrix4();
        const radius = orbitalRadius + (Math.random() * orbitalSpread);
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.random() * 5 - 2.5;
        const z = Math.sin(angle) * radius;
        const position = new THREE.Vector3(x,y,z);

        const quaternion = new THREE.Quaternion().random();

        // always positive: a negative scale turns the rock inside-out
        const scale = new THREE.Vector3().setScalar(
            MIN_ASTEROID_SCALE + Math.random() * (MAX_ASTEROID_SCALE - MIN_ASTEROID_SCALE));

        matrix.compose(position, quaternion, scale);
        return matrix;
    }
}
