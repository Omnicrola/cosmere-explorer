import * as THREE from 'three';
import { createPlanet } from './createPlanet.js';
import { createOrbitalRing } from './createRings.js';

function createBinaryPlanets(binaryData) {

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
    orbitalGroup.position.x = binaryData.orbitalDistance;

    const planet1 = createPlanet(p1Data);
    const planet2 = createPlanet(p2Data);

    const orbitalRingMesh = createOrbitalRing(binaryData.orbitalDistance, 0, 0.1);

    anchor.add(orbitalRingMesh);
    orbitalGroup.add(planet1);
    orbitalGroup.add(planet2);


    return anchor;
}

export { createBinaryPlanets };