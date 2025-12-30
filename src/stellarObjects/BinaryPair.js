import * as THREE from 'three';
import { OrbitalPath } from './OrbitalPath.js';
import { Planet } from './Planet.js';

export class BinaryPair extends THREE.Group {
    constructor(binaryData) {
        super();

        console.log(binaryData)

        const anchor = new THREE.Group();
        anchor.rotation.x = THREE.MathUtils.degToRad(binaryData.orbitalIncline.x);
        anchor.rotation.y = THREE.MathUtils.degToRad(binaryData.orbitalIncline.y);

        this.orbitalGroup = new THREE.Group();
        anchor.add(this.orbitalGroup);
        this.orbitalGroup.position.x = binaryData.orbitalRadius;

        anchor.add(new OrbitalPath(binaryData.orbitalRadius, 0, 0.1));
        
        this.add(anchor);

    }

    addStellarObject(obj) {
        this.orbitalGroup.add(obj);
    }
}