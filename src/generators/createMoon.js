import * as THREE from 'three';
import { createPlanetMaterial } from '../../resources/materials.js';
import { createOrbitalRing } from './createRings.js';

const basic_1U_sphere = new THREE.IcosahedronGeometry(1, 6);

function createMoon(moonData) {
    const moonGroup = new THREE.Group();

    const moonMat = createPlanetMaterial(moonData);
    
    const moon = new THREE.Mesh(basic_1U_sphere, moonMat);
    moon.name = moonData.id;
    moon.userData.info = moonData;
    
    moon.scale.setScalar(moonData.radius);
    moon.position.x =  moonData.orbitalRadius;
    moon.rotation.y = Math.random() * Math.PI * 2; // set to a random position along it's orbit

    const orbitalRing = createOrbitalRing(moonData.orbitalRadius, 1.0, .4, 2);
    orbitalRing.visible = false;
    
    let _showOrbitalRing = false;
    moonGroup.userData = {
        isSelectable: true,
        get showOrbitalRing() { return _showOrbitalRing; },
        set showOrbitalRing(val) {
            _showOrbitalRing = val;
            orbitalRing.visible = val;
        }
    }

    moonGroup.add(orbitalRing);
    moonGroup.add(moon);
    moonGroup.rotation.x = THREE.MathUtils.degToRad(moonData.orbitalInclination.x);
    moonGroup.rotation.y = THREE.MathUtils.degToRad(moonData.orbitalInclination.y);

    return moonGroup;
}

export { createMoon };