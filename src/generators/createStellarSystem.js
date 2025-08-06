import * as THREE from 'three';
import { createStar } from './createStar.js';
import { createPlanet } from './createPlanet.js';


function createStellarSystem(stellarData) {
    // init
    const stellarSystem = new THREE.Group();
    stellarSystem.userData.update = (t) => {
        stellarSystem.children.forEach((child) => {
            child.userData.update?.(t);
        });
    };

    // star
    stellarSystem.add(createStar(stellarData));


    // planets
    stellarData.planets.forEach((p, index) => {
        let planet = createPlanet(p, index);
        stellarSystem.add(planet);
    })


    return stellarSystem;
}

export {createStellarSystem};