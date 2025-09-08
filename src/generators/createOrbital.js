import * as THREE from 'three';

function createOrbital(orbitData) {
    const stellarAnchor = new THREE.Group();
    stellarAnchor.rotation.x = THREE.MathUtils.degToRad(orbitData.orbitalIncline.x);
    stellarAnchor.rotation.y = THREE.MathUtils.degToRad(orbitData.orbitalIncline.y);
    // stellarAnchor.rotation.y = THREE.MathUtils.degToRad(orbitData.orbitStart ?? 0);

    const orbitGroupAnchor = new THREE.Group();
    orbitGroupAnchor.position.x = orbitData.orbitalRadius;
    stellarAnchor.add(orbitGroupAnchor);

    const orbitalSpeed = orbitData.orbitalSpeed ?? 0;
    stellarAnchor.userData = {
        update:(deltaTime) => {
            // stellarAnchor.rotation.y += deltaTime * orbitalSpeed / 1000;
        },
    };

    return { stellarAnchor, orbitGroupAnchor };
}

export { createOrbital };