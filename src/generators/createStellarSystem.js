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
import { ParticulateRing } from '../stellarObjects/ParticulateRing.js';
import { Moon } from '../stellarObjects/Moon.js';


function createStellarSystem(stellarData) {

    // init
    const stellarSystem = new THREE.Group();
    stellarSystem.addStellarObject = (o)=> stellarSystem.add(o); // adding this method to the base Group allows the recursion function below to work correctly

    // main light
    const starLight = new THREE.PointLight(0xffffff, stellarData.luminosity, 0, 0.2);
    starLight.position.set(0,0,0);
    scene.add(starLight);

    stellarData.stellarObjects.forEach((objData) => createStellarObject(stellarSystem, objData));

    // background
    scene.background = createSkybox(stellarData.skyboxTexture);

    // user interface
    ui.setSystemName(stellarData.name);
    ui.updateScannerList(stellarData.stellarObjects);

    scene.add(stellarSystem);

    return stellarSystem;
}

function createStellarObject(parent, objData) {

    var newObj = null;
    switch(objData.stellarObjectType) {
        case STELLAR_OBJECT.STAR : 
            newObj = new Star(objData);
            break;
        case STELLAR_OBJECT.PLANET : 
            newObj = new Planet(objData);
            break;
        case STELLAR_OBJECT.MOON :
            newObj = new Moon(objData);
            break;
        case STELLAR_OBJECT.ASTEROID_BELT :
            newObj = new AsteroidBelt(objData);
            break;
        case STELLAR_OBJECT.COGNITIVE_ANOMOLY :
            newObj = new CognitiveAnomoly(objData);
            break;
        case STELLAR_OBJECT.BINARY_SET :
            newObj = new BinaryPair(objData);
            break;
        case STELLAR_OBJECT.PARTICULATE_RING :
            newObj = new ParticulateRing(objData);
            break;
        default : 
            console.log('Error: unknown stellar object type : ' + objData.stellarObjectType);
    }
    parent.addStellarObject(newObj);
    if(objData.children) {
        objData.children.forEach(childData => createStellarObject(newObj, childData));
    }
}

export {createStellarSystem};