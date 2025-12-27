import * as THREE from 'three';
import { createRingMaterial } from '../../resources/materials.js';

export class PlanetaryRings extends THREE.Group {
    constructor(ringData) {
        super();

        const ringMaterial = createRingMaterial(ringData.albedoMap, ringData.alphaMap);
        const geometry = new THREE.TorusGeometry(ringData.radius, ringData.spread, 12, 48);
        const ringMesh = new THREE.Mesh(geometry, ringMaterial);

        ringMesh.scale.z = 0.01;
        ringMesh.rotation.x = THREE.MathUtils.degToRad(90) + THREE.MathUtils.degToRad(ringData.inclination);

        this.add(ringMesh);
    }
}