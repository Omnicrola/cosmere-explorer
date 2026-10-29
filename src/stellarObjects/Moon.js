import * as THREE from 'three';
import { StellarObject } from "./StellarObject.js";
import { createPlanetMaterial } from '../rendering/materials.js';

export class Moon extends StellarObject {
    constructor(moonData) {
        super(moonData);

        const moonGeo = new THREE.IcosahedronGeometry(moonData.radius, 6);
        const moon = new THREE.Mesh(moonGeo, createPlanetMaterial(moonData));

        this.createBody([moon]);
    }
}
