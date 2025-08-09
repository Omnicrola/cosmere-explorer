import * as THREE from 'three';
import { createStar } from './createStar.js';
import { createPlanet } from './createPlanet.js';
import { scene } from '../mainScene.js';
import { ui } from '../ui/userInterface.js';


function createStellarSystem(stellarData) {

    // init
    const stellarSystem = new THREE.Group();
    stellarSystem.userData.update = (deltaTime) => {
        stellarSystem.children.forEach((child) => {
            child.userData.update?.(deltaTime);
        });
    };

    // star
    stellarSystem.add(createStar(stellarData));

    const starLight = new THREE.PointLight(0xffffff, stellarData.luminosity, 0, 0.2);
    starLight.position.set(0,0,0);
    scene.add(starLight);

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