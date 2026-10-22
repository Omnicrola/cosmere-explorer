import * as THREE from 'three';
import { createSkybox } from './createSkybox.js';
import { STELLAR_OBJECT } from '../data/stellarData.js';
import { Star } from '../stellarObjects/Star.js';
import { Planet } from '../stellarObjects/Planet.js';
import { CognitiveAnomoly } from '../stellarObjects/CognitiveAnomoly.js';
import { BinaryPair } from '../stellarObjects/BinaryPair.js';
import { AsteroidBelt } from '../stellarObjects/AsteroidBelt.js';
import { ParticulateRing } from '../stellarObjects/ParticulateRing.js';
import { Moon } from '../stellarObjects/Moon.js';

const STELLAR_OBJECT_CLASSES = {
    [STELLAR_OBJECT.STAR]: Star,
    [STELLAR_OBJECT.PLANET]: Planet,
    [STELLAR_OBJECT.MOON]: Moon,
    [STELLAR_OBJECT.ASTEROID_BELT]: AsteroidBelt,
    [STELLAR_OBJECT.COGNITIVE_ANOMOLY]: CognitiveAnomoly,
    [STELLAR_OBJECT.BINARY_SET]: BinaryPair,
    [STELLAR_OBJECT.PARTICULATE_RING]: ParticulateRing,
};

// Builds the scene graph for a stellar system. Returns the root group (which includes the
// system's light) and the skybox texture; adding them to the scene is up to the caller.
function createStellarSystem(stellarData, { loadSkybox = createSkybox } = {}) {

    // init
    const stellarSystem = new THREE.Group();
    stellarSystem.addStellarObject = (o)=> stellarSystem.add(o); // adding this method to the base Group allows the recursion function below to work correctly

    // main light
    const starLight = new THREE.PointLight(0xffffff, stellarData.luminosity, 0, 0.2);
    starLight.position.set(0,0,0);
    stellarSystem.add(starLight);

    stellarData.stellarObjects.forEach((objData) => createStellarObject(stellarSystem, objData));

    const skybox = stellarData.skyboxTexture ? loadSkybox(stellarData.skyboxTexture) : null;

    return { group: stellarSystem, skybox };
}

function createStellarObject(parent, objData) {
    const StellarObjectClass = STELLAR_OBJECT_CLASSES[objData.stellarObjectType];
    if(!StellarObjectClass) {
        console.error('Error: unknown stellar object type : ' + objData.stellarObjectType);
        return;
    }

    const newObj = new StellarObjectClass(objData);
    parent.addStellarObject(newObj);
    if(objData.children) {
        objData.children.forEach(childData => createStellarObject(newObj, childData));
    }
}

export { createStellarSystem };
