import * as THREE from "three";
import { sceneContext } from "./sceneContext.js";

// Smoothly moves the orbit controls' target onto the followed object, then keeps it
// there (with auto-rotate) as the object continues along its orbit.

const CAMERA_LERP_SPEED = 2.0;

const targetLocation = new THREE.Vector3();
const startingLocation = new THREE.Vector3();
const currentLocation = new THREE.Vector3();
let cameraLerpAlpha = 0.0;

function updateCamera(delta) {
    const { camera, orbitControls } = sceneContext;

    // autofollow a target object
    if(camera.cameraFollowTarget) {
        // update target position as the target continues on it's orbit
        camera.cameraFollowTarget.getWorldPosition(targetLocation);

        if(cameraLerpAlpha < 1.0) {
            cameraLerpAlpha = THREE.MathUtils.clamp(cameraLerpAlpha + CAMERA_LERP_SPEED * delta, 0, 1);
            currentLocation.lerpVectors(startingLocation, targetLocation, cameraLerpAlpha);
            orbitControls.autoRotate = false;
        } else {
            currentLocation.copy(targetLocation);
            orbitControls.autoRotate = true;
        }

        orbitControls.target.copy(currentLocation);
    }

    orbitControls.update(delta);
}

// begin a new camera travel, starting from a world-space location
function resetCameraTravel(fromWorldLocation) {
    cameraLerpAlpha = 0.0;
    startingLocation.copy(fromWorldLocation);
}

export { updateCamera, resetCameraTravel };
