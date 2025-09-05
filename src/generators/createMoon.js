import * as THREE from 'three';
import { createPlanetMaterial } from '../../resources/materials.js';
import { createOrbitalPath } from './createRings.js';
import { createOrbital } from './createOrbital.js';

const basic_1U_sphere = new THREE.IcosahedronGeometry(1, 6);

function createMoon(moonData) {
    const { stellarAnchor, orbitGroupAnchor} = createOrbital(moonData);

    const moonMat = createPlanetMaterial(moonData);
    
    const moon = new THREE.Mesh(basic_1U_sphere, moonMat);
    moon.name = moonData.id;
    moon.userData.info = moonData;
    
    moon.scale.setScalar(moonData.radius);

    const orbitalRing = createOrbitalPath(moonData.orbitalRadius, 1.0, .4, 2);
    // orbitalRing.visible = false;
    
    let _showOrbitalRing = false;
    moon.userData = {
        isSelectable: true,
        hasOrbitalRing: true,
        get showOrbitalRing() { return _showOrbitalRing; },
        set showOrbitalRing(val) {
            _showOrbitalRing = val;
            orbitalRing.visible = val;
        }
    }

    stellarAnchor.add(orbitalRing);
    orbitGroupAnchor.add(moon);

    return stellarAnchor;
}

export { createMoon };