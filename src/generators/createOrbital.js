import * as THREE from 'three';

function createOrbital(orbitData) {
    const stellarAnchor = new THREE.Group();
    stellarAnchor.rotation.x = THREE.MathUtils.degToRad(orbitData.orbitalIncline.x);
    stellarAnchor.rotation.y = THREE.MathUtils.degToRad(orbitData.orbitalIncline.y);

    const orbitGroupAnchor = new THREE.Group();
    orbitGroupAnchor.position.x = orbitData.orbitalRadius;
    orbitGroupAnchor.rotation.y = THREE.MathUtils.degToRad(orbitData.orbitStart ?? 0);
    stellarAnchor.add(orbitGroupAnchor);

    const orbitalSpeed = orbitData.orbitalSpeed ?? 0;
    stellarAnchor.userData = {
        update:(deltaTime) => {
            orbitGroupAnchor.rotation.y += deltaTime * orbitalSpeed / 10000;
        },
    };

    return { stellarAnchor, orbitGroupAnchor };
}

export { createOrbital };