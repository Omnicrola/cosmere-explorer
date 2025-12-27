import * as THREE from 'three';
import { OrbitalPath } from './OrbitalPath.js';
import { Planet } from './Planet.js';

export class BinaryPair extends THREE.Group {
    constructor(binaryData) {
        super();

        const orbitalData = {
            orbitalRadius : binaryData.separationDistance,
            orbitalIncline : binaryData.orbitalIncline,
            orbitalEccentricity : binaryData.orbitalEccentricity,
            orbitalSpeed : binaryData.orbitalSpeed,
        }

        const p1Data = {...binaryData.children[0], ... orbitalData, orbitStart: 20};
        const p2Data = {...binaryData.children[1], ... orbitalData, orbitStart: 200};

        const anchor = new THREE.Group();
        anchor.rotation.x = THREE.MathUtils.degToRad(binaryData.orbitalIncline.x);
        anchor.rotation.y = THREE.MathUtils.degToRad(binaryData.orbitalIncline.y);

        const orbitalGroup = new THREE.Group();
        anchor.add(orbitalGroup);
        orbitalGroup.position.x = binaryData.orbitalRadius;

        const planet1 = new Planet(p1Data);
        const planet2 = new Planet(p2Data);

        anchor.add(new OrbitalPath(binaryData.orbitalRadius, 0, 0.1));
        orbitalGroup.add(planet1);
        orbitalGroup.add(planet2);

        this.add(anchor);

    }
}