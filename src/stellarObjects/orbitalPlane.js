import * as THREE from 'three';

// Builds the groups that orient an orbit in the system, from an orbitalIncline (in degrees):
//   incline.y - longitude of the ascending node: which direction the orbit tilts towards
//   incline.x - inclination: how far the orbit tilts away from the ecliptic
// Objects added to 'plane' orbit by rotating around its local Y axis.
//
// The node rotation needs its own parent group: a single Euler rotation applies Y before X,
// which spins the orbit within its own plane and leaves the tilt direction fixed.
function createOrbitalPlane(orbitalIncline) {
    const node = new THREE.Group();
    node.rotation.y = THREE.MathUtils.degToRad(orbitalIncline?.y ?? 0);

    const plane = new THREE.Group();
    plane.rotation.x = THREE.MathUtils.degToRad(orbitalIncline?.x ?? 0);
    node.add(plane);

    return { node, plane };
}

export { createOrbitalPlane };
