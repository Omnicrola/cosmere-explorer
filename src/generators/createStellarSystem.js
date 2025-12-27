import * as THREE from 'three';
import { scene } from '../mainScene.js';
import { ui } from '../ui/userInterface.js';
import { createSkybox } from './createSkybox.js';
import { STELLAR_OBJECT } from '../data/stellarData.js';
import { Star } from '../stellarObjects/Star.js';
import { Planet } from '../stellarObjects/Planet.js';
import { CognitiveAnomoly } from '../stellarObjects/CognitiveAnomoly.js';
import { BinaryPair } from '../stellarObjects/BinaryPair.js';
import { AsteroidBelt } from '../stellarObjects/AsteroidBelt.js';


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
                stellarSystem.add(new Planet(objData));
                break;
            case STELLAR_OBJECT.ASTEROID_BELT :
                stellarSystem.add(new AsteroidBelt(objData));
                break;
            case STELLAR_OBJECT.COGNITIVE_ANOMOLY :
                stellarSystem.add(new CognitiveAnomoly(objData));
                break;
            case STELLAR_OBJECT.BINARY_SET :
                stellarSystem.add(new BinaryPair(objData));
                break;
            default : 
                console.log('Error: unknown stellar object type : ');
        }
    });

    // background
    scene.background = createSkybox(stellarData.skyboxTexture);

    // user interface
    ui.setSystemName(stellarData.name);
    ui.updateScannerList(stellarData.stellarObjects);

    scene.add(stellarSystem);

    return stellarSystem;
}

export {createStellarSystem};