import * as THREE from 'three';
import { createStar } from './createStar.js';
import { createPlanet } from './createPlanet.js';
import { scene } from '../mainScene.js';
import { ui } from '../ui/userInterface.js';
import { createSkybox } from './createSkybox.js';
import { createAsteroids } from './createAsteroids.js';
import { STELLAR_OBJECT } from '../data/stellarData.js';
import { createCognitiveAnomoly } from './createCognitiveAnomoly.js';
import { createBinaryPlanets } from './createBinaryPair.js';


function createStellarSystem(stellarData) {

    // init
    const stellarSystem = new THREE.Group();
    stellarSystem.userData.update = (deltaTime) => {
        stellarSystem.children.forEach((child) => {
            child.userData.update?.(deltaTime);
        });
    };

    // main light
    const starLight = new THREE.PointLight(0xffffff, stellarData.luminosity, 0, 0.2);
    starLight.position.set(0,0,0);
    scene.add(starLight);

    // other stellar objects
    stellarData.stellarObjects.forEach((objData) => {
        switch(objData.stellarObjectType) {
            case STELLAR_OBJECT.STAR : 
                stellarSystem.add(createStar(objData));
                break;
            case STELLAR_OBJECT.PLANET : 
                stellarSystem.add(createPlanet(objData));
                break;
            case STELLAR_OBJECT.ASTEROID_BELT :
                scene.add(createAsteroids(objData));
                break;
            case STELLAR_OBJECT.COGNITIVE_ANOMOLY :
                scene.add(createCognitiveAnomoly(objData));
                break;
            case STELLAR_OBJECT.BINARY_SET :
                scene.add(createBinaryPlanets(objData));
                break;
            default : 
                console.log('Error: unknown stellar object type : ');
        }
    });
    scene.add(createAsteroids(stellarData.asteroidBelt));

    // background
    scene.background = createSkybox(stellarData.skyboxTexture);

    // user interface
    ui.setSystemName(stellarData.name);
    ui.updateScannerList(stellarData.stellarObjects);

    scene.add(stellarSystem);

    return stellarSystem;
}

export {createStellarSystem};