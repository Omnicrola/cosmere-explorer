import * as THREE from 'three';
import { ModifierBase } from './ModifierBase.js';

const ZERO = new THREE.Vector3();

export class AutoFaceStar extends ModifierBase {
    constructor(){
        super();

    }

    update(deltaTime, sceneData) {
        sceneData.parentObj.lookAt(ZERO);
    }
}