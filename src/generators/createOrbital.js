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
    console.log(orbitData.id + ' -- '+orbitalSpeed)
    stellarAnchor.userData = {
        update:(deltaTime) => {
            orbitGroupAnchor.rotation.y += deltaTime * orbitalSpeed / 1000;
            console.log(orbitData.id + ' ry ' + orbitalSpeed+ ' = ' + orbitGroupAnchor.rotation.y);
        },
    };

    return { stellarAnchor, orbitGroupAnchor };
}

export { createOrbital };