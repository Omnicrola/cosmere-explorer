import * as THREE from 'three';
import { loadAsteroidMeshes } from '../data/fileResources.js';
import { markSceneGraphChanged } from '../core/updateList.js';
import { createTumbleMaterial, advanceTumble, TUMBLE_SPEED_ATTRIBUTE } from '../rendering/tumbleMaterial.js';

const MIN_ASTEROID_SCALE = 0.2;
const MAX_ASTEROID_SCALE = 1.5;

export class AsteroidBelt extends THREE.Group {
    constructor(asteroidData) {
        super();

        loadAsteroidMeshes().forEach((p) => {
            p.then((mesh) => {
                this.add(AsteroidBelt.createInstancedGroup(mesh, asteroidData.density, asteroidData));
                markSceneGraphChanged(); // its tumble update needs to join the per-frame update list
            }).catch((err) => console.error('Failed to load asteroid mesh', err));
        });
    }

    static createInstancedGroup(mesh, count, asteroidData) {
        const asteroidContainer = new THREE.Group();

        // move the entire group of instanced meshes around their orbital ring
        asteroidContainer.userData.update = (deltaTime) => {
            asteroidContainer.rotation.y += deltaTime * (asteroidData.orbitalSpeed / 200);
        };

        // each belt gets its own copy of the rock geometry, since the per-instance
        // tumble speeds are stored on it
        const geometry = mesh.geometry.clone();
        const tumbleSpeeds = new Float32Array(count);
        const material = createTumbleMaterial(mesh.material);
        const instanceMesh = new THREE.InstancedMesh(geometry, material, count);

        // generate a randomized transform and tumble speed for each asteroid instance
        for(let i=0; i<count; i++) {
            instanceMesh.setMatrixAt(i, AsteroidBelt.randomizeTransform(asteroidData.orbitalRadius, asteroidData.orbitalSpread));
            tumbleSpeeds[i] = Math.random();
        }
        geometry.setAttribute(TUMBLE_SPEED_ATTRIBUTE, new THREE.InstancedBufferAttribute(tumbleSpeeds, 1));

        // make all the asteroids 'tumble' as they orbit (the rotation itself happens in the vertex shader)
        instanceMesh.userData.update = (deltaTime) => {
            advanceTumble(material, deltaTime);
        };

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
