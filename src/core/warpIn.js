import * as THREE from "three";

// Where the camera ends up after warping into a system: above and behind the star,
// far enough back to see the whole system.
// The scene is reset to full scale before measuring; otherwise switching systems while a
// previous warp-in is still shrunk down would measure a tiny system and park the camera
// inside the star.
function computeWarpInCameraPosition(scene, systemGraph, target = new THREE.Vector3()) {
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(systemGraph).getSize(new THREE.Vector3());
    return target.set(0, bounds.x / 6, bounds.x / 4);
}

export { computeWarpInCameraPosition };
