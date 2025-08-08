import * as THREE from 'three';
import { createStar } from './createStar.js';
import { createPlanet } from './createPlanet.js';
import { scene } from '../mainScene.js';
import { ui } from '../ui/userInterface.js';


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

    ui.setSystemName(stellarData.name);
    ui.createPlanetList(stellarData.planets);

    scene.add(stellarSystem);

    return stellarSystem;
}

export {createStellarSystem};