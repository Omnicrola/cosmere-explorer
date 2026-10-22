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

// Plays the "zoom in all dramatic-like" entrance: the whole scene scales up from almost
// nothing, so it appears we are approaching from much further away than we are.
// When arriving at a remembered selection, onArrive runs once the scene is at full size,
// so the object is measured correctly. (A wall-clock timer can fire early, because gsap's
// clock slows down during the heavy frames of building a new scene.)
// Otherwise flyToOverview(position) is asked to glide the camera to an overview.
// Returns a function that cancels the warp.
function startWarpIn({ scene, systemGraph, onArrive = null, flyToOverview }) {
    const destination = computeWarpInCameraPosition(scene, systemGraph);

    // a tiny scale rather than zero, which would make every world matrix non-invertible
    scene.scale.setScalar(0.0001);
    const tweens = [
        gsap.to(scene.scale, {
            duration: 1.9,
            delay: 1,
            x: 1.0,
            y: 1.0,
            z: 1.0,
            ease: 'power4.out',
            onComplete: () => onArrive?.(),
        }),
    ];

    if(!onArrive) {
        tweens.push(gsap.delayedCall(1, () => flyToOverview(destination)));
    }

    return () => tweens.forEach((tween) => tween.kill());
}

export { computeWarpInCameraPosition, startWarpIn };
