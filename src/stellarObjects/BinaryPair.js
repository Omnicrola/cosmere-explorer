import * as THREE from 'three';
import { OrbitalPath } from './OrbitalPath.js';
import { createOrbitalPlane } from './orbitalPlane.js';

export class BinaryPair extends THREE.Group {
    constructor(binaryData) {
        super();

        const { node, plane } = createOrbitalPlane(binaryData.orbitalIncline);

        // positions the pair's shared center along its orbit
        const orbitCentroid = new THREE.Group();
        orbitCentroid.rotation.y = THREE.MathUtils.degToRad(binaryData.orbitStart ?? 0);
        plane.add(orbitCentroid);

        this.orbitalGroup = new THREE.Group();
        orbitCentroid.add(this.orbitalGroup);
        this.orbitalGroup.position.x = binaryData.orbitalRadius;

        plane.add(new OrbitalPath(binaryData.orbitalRadius, 0, 0.1));

        this.add(node);

    }

    addStellarObject(obj) {
        this.orbitalGroup.add(obj);
    }
}
