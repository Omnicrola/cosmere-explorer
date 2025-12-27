import * as THREE from 'three';
import { StellarObject } from "./StellarObject.js";
import { createPlanetMaterial, createAtmosphericShader, createFresnelMaterial } from '../../resources/materials.js';
import { PlanetaryRings } from './PlanetaryRings.js';
import { Moon } from './Moon.js';

export class Planet extends StellarObject {
    constructor(planetData) {
        super(planetData);

        const planetMaterial = createPlanetMaterial(planetData);
        const planetGeo = new THREE.IcosahedronGeometry(planetData.radius, 6);
        const planet = new THREE.Mesh(planetGeo, planetMaterial);

        const atmosphere = new THREE.Mesh(planetGeo, createAtmosphericShader(planetData));
        atmosphere.scale.setScalar(1.05);
        planet.add(atmosphere);
    
        planet.name = planetData.id;
        planet.userData = {
            info : planetData,
            isSelectable : true,
        };

        this.addStellarObject(planet);

        if(planetData.rings.visible) {
            planet.add(new PlanetaryRings(planetData.rings));
        }

        // moons!
        planetData.children.forEach((moonData) => {
            this.addStellarObject(new Moon(moonData));
        });

    }
} 