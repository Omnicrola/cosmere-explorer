import * as THREE from 'three';
import { createPlanet } from './createPlanet.js';
import { scene } from '../mainScene.js';
import { ui } from '../ui/userInterface.js';
import { createSkybox } from './createSkybox.js';
import { createAsteroids } from './createAsteroids.js';
import { STELLAR_OBJECT } from '../data/stellarData.js';
import { createBinaryPlanets } from './createBinaryPair.js';
import { Star } from '../stellarObjects/Star.js';
import { CognitiveAnomoly } from '../stellarObjects/CognitiveAnomoly.js';


function createStellarSystem(stellarData) {

    // init
    const stellarSystem = new THREE.Group();

    // main light
    const starLight = new THREE.PointLight(0xffffff, stellarData.luminosity, 0, 0.2);
    starLight.position.set(0,0,0);
    scene.add(starLight);

    // other stellar objects
    stellarData.stellarObjects.forEach((objData) => {
        switch(objData.stellarObjectType) {
            case STELLAR_OBJECT.STAR : 
                stellarSystem.add(new Star(objData));
                break;
            case STELLAR_OBJECT.PLANET : 
                stellarSystem.add(createPlanet(objData));
                break;
            case STELLAR_OBJECT.ASTEROID_BELT :
                stellarSystem.add(createAsteroids(objData));
                break;
            case STELLAR_OBJECT.COGNITIVE_ANOMOLY :
                stellarSystem.add(new CognitiveAnomoly(objData));
                break;
            case STELLAR_OBJECT.BINARY_SET :
                stellarSystem.add(createBinaryPlanets(objData));
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