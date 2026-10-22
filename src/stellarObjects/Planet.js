import * as THREE from 'three';
import { StellarObject } from "./StellarObject.js";
import { createPlanetMaterial, createAtmosphericShader } from '../rendering/materials.js';
import { PlanetaryRings } from './PlanetaryRings.js';

export class Planet extends StellarObject {
    constructor(planetData) {
        super(planetData);

        const planetGeo = new THREE.IcosahedronGeometry(planetData.radius, 6);
        const planet = new THREE.Mesh(planetGeo, createPlanetMaterial(planetData));

        const atmosphere = new THREE.Mesh(planetGeo, createAtmosphericShader(planetData));
        atmosphere.scale.setScalar(1.05);

        // ring inclination is relative to the orbital plane, so rings don't follow the axial tilt
        const rings = planetData.rings.visible ? [new PlanetaryRings(planetData.rings)] : [];

        this.createBody([planet, atmosphere], { attachments: rings });
    }
}
