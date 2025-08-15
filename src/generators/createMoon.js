import * as THREE from 'three';
import { createPlanetMaterial } from '../../resources/materials.js';

const basic_1U_sphere = new THREE.IcosahedronGeometry(1, 6);

function createMoon(moonData, moonIndex, planetIndex) {
    const moonMat = new THREE.MeshStandardMaterial({color: moonData.color});
    
    const moon = new THREE.Mesh(basic_1U_sphere, moonMat);
    moon.name = 'planet-' + (moonIndex+100);
    
    moon.scale.setScalar(moonData.radius);
    moon.position.x =  moonData.orbitalRadius;
    moon.rotation.y = Math.random() * 360;
    
    let _showOrbitalRing = false;
    moon.userData = {
        info: moonData,
        isSelectable: true,
        get showOrbitalRing() { return _showOrbitalRing; },
        set showOrbitalRing(val) {
            _showOrbitalRing = val;
            moon.visible = val;
        }
    }


    return moon;
}

export { createMoon };