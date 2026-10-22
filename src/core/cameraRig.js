import * as THREE from "three";
import CameraControls from "camera-controls";
import { sceneContext } from "./sceneContext.js";
import { planFlight } from "./flightPlan.js";

// Camera movement, built on camera-controls. Flights to an object move the look target
// and the camera's orbit around it (angle and distance) together on critically damped
// springs, so they start and stop together and the camera swings around in an arc,
// rather than whip-panning first and then sliding in a straight line. Flights are planned
// (see flightPlan.js) so they swing around stars and planets instead of through them.

CameraControls.install({ THREE });

// how quickly the camera responds to the user's own mouse/touch input
const USER_SMOOTH_TIME = 0.25;
// flights take longer the further they travel (in seconds of spring smoothing)
const MIN_FLIGHT_SMOOTH_TIME = 0.35;
const MAX_FLIGHT_SMOOTH_TIME = 0.8;
const OVERVIEW_SMOOTH_TIME = 0.9;
// arrive this many times further back than the distance at which the object fills the view
const VIEW_FILL_FACTOR = 2.5;
// arrive looking down on the object from a comfortable angle above its orbital plane
const MIN_ARRIVAL_ELEVATION = THREE.MathUtils.degToRad(10);
const MAX_ARRIVAL_ELEVATION = THREE.MathUtils.degToRad(40);
// once arrived, slowly orbit the followed object
const AUTO_ROTATE_SPEED = (2 * Math.PI) / 60; // radians per second: one turn a minute
const AUTO_ROTATE_FADE_IN = 1.5;               // seconds to reach full speed
// keep the camera from entering the followed object
const MIN_DISTANCE_FACTOR = 1.2;
const FREE_MIN_DISTANCE = 0.1;
// ignore followed-object movement smaller than this (squared world units)
const FOLLOW_EPSILON_SQ = 1e-8;

const rigState = {
    isFlying: false,
    isUserControlling: false,
    autoRotateLevel: 0,
    obstacles: [],
};

const tmpTarget = new THREE.Vector3();
const tmpPosition = new THREE.Vector3();
const tmpSpherical = new THREE.Spherical();

function createCameraControls(camera, domElement) {
    const controls = new CameraControls(camera, domElement);
    controls.smoothTime = USER_SMOOTH_TIME;
    controls.minDistance = FREE_MIN_DISTANCE;

    controls.addEventListener('controlstart', () => {
        // the user grabbed the camera: hand control over, and restart auto-rotate gently later
        rigState.isUserControlling = true;
        rigState.isFlying = false;
        rigState.autoRotateLevel = 0;
        controls.smoothTime = USER_SMOOTH_TIME;
    });
    controls.addEventListener('controlend', () => {
        rigState.isUserControlling = false;
    });
    controls.addEventListener('rest', () => {
        rigState.isFlying = false;
        controls.smoothTime = USER_SMOOTH_TIME;
    });

    resetRigState();
    return controls;
}

function resetRigState() {
    rigState.isFlying = false;
    rigState.isUserControlling = false;
    rigState.autoRotateLevel = 0;
}

// Longer trips get a slightly longer flight, but never so long that it drags.
function flightSmoothTime(travelDistance, arrivalDistance) {
    const scale = Math.log2(1 + travelDistance / Math.max(arrivalDistance, 1e-6));
    return THREE.MathUtils.clamp(MIN_FLIGHT_SMOOTH_TIME + 0.06 * scale, MIN_FLIGHT_SMOOTH_TIME, MAX_FLIGHT_SMOOTH_TIME);
}

// Objects that flights should not pass through (e.g. stars and planets); replaced per system.
function setCameraObstacles(objects) {
    rigState.obstacles = objects;
}

// World-space bounding sphere of an object and its descendants (e.g. atmosphere, rings).
// Built from each mesh's own bounding sphere: going via a bounding box would overestimate
// a planet's radius by about 1.7x and frame it too far away.
function worldBoundingSphere(obj) {
    const result = new THREE.Sphere(obj.getWorldPosition(new THREE.Vector3()), 0);
    obj.updateWorldMatrix(true, true);
    obj.traverse((child) => {
        if(!child.geometry) {
            return;
        }
        if(!child.geometry.boundingSphere) {
            child.geometry.computeBoundingSphere();
        }
        result.union(child.geometry.boundingSphere.clone().applyMatrix4(child.matrixWorld));
    });
    return result;
}

// world-space bounding spheres of the obstacles, other than the one being flown to
function obstacleSpheres(exclude) {
    return rigState.obstacles
        .filter((obj) => obj !== exclude)
        .map(worldBoundingSphere);
}

// Which direction to view an object from: keep the direction the camera is already coming
// from (so it doesn't swing around to some unrelated side), but bring the elevation into a
// pleasant range. Returns spherical angles (phi from straight up, theta around the up axis).
function computeArrivalAngles(camera, target) {
    tmpSpherical.setFromVector3(tmpPosition.copy(camera.position).sub(target));

    // straight above or below the target the horizontal direction is meaningless,
    // so fall back to the direction the camera is facing
    const horizontal = Math.hypot(tmpPosition.x, tmpPosition.z);
    if(horizontal < 1e-3 * Math.max(tmpSpherical.radius, 1e-6)) {
        const forward = camera.getWorldDirection(new THREE.Vector3());
        tmpSpherical.theta = Math.atan2(-forward.x, -forward.z);
    }

    const elevation = THREE.MathUtils.clamp(Math.PI / 2 - tmpSpherical.phi, MIN_ARRIVAL_ELEVATION, MAX_ARRIVAL_ELEVATION);
    return { phi: Math.PI / 2 - elevation, theta: tmpSpherical.theta };
}

// Fly to and start following a scene object.
function flyToObject(obj) {
    const { camera, cameraControls: controls } = sceneContext;

    const sphere = worldBoundingSphere(obj);
    const target = obj.getWorldPosition(new THREE.Vector3());
    // never closer than the camera's near plane allows, or the surface gets clipped away
    const minDistance = sphere.radius * MIN_DISTANCE_FACTOR + camera.near;
    const distance = Math.max(controls.getDistanceToFitSphere(sphere.radius) * VIEW_FILL_FACTOR, minDistance);
    const { phi, theta } = computeArrivalAngles(camera, target);

    const flight = planFlight({
        start: {
            target: controls.getTarget(new THREE.Vector3()),
            radius: controls.distance,
            phi: controls.polarAngle,
            theta: controls.azimuthAngle,
        },
        endTarget: target,
        endRadius: distance,
        phi,
        theta,
        obstacles: obstacleSpheres(obj),
    });

    const travel = flight.start.target.distanceTo(target) + Math.abs(flight.start.radius - distance);
    controls.smoothTime = flightSmoothTime(travel, distance);
    controls.minDistance = minDistance;
    rigState.isFlying = true;
    rigState.autoRotateLevel = 0;
    camera.cameraFollowTarget = obj;

    controls.moveTo(target.x, target.y, target.z, true);
    controls.rotateTo(flight.end.theta, flight.end.phi, true);
    controls.dollyTo(distance, true);
}

// Stop following, easing the camera back a little so the user can see they've let go.
function stopFollowing() {
    const { camera, cameraControls: controls } = sceneContext;
    rigState.autoRotateLevel = 0;
    controls.minDistance = FREE_MIN_DISTANCE;
    if(!camera.cameraFollowTarget) {
        return;
    }
    camera.cameraFollowTarget = null;
    controls.smoothTime = MIN_FLIGHT_SMOOTH_TIME;
    controls.dollyTo(controls.distance * 1.5, true);
}

// Place the camera instantly (no transition), clearing any follow target.
function jumpTo(position, target) {
    const { camera, cameraControls: controls } = sceneContext;
    camera.cameraFollowTarget = null;
    resetRigState();
    controls.minDistance = FREE_MIN_DISTANCE;
    controls.smoothTime = USER_SMOOTH_TIME;
    controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false);
}

// Glide to an overview of the system.
function flyToOverview(position, target = new THREE.Vector3()) {
    const { cameraControls: controls } = sceneContext;
    rigState.isFlying = true;
    controls.smoothTime = OVERVIEW_SMOOTH_TIME;
    controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, true);
}

// Called every frame from the render loop.
function updateCamera(delta) {
    const { camera, cameraControls: controls } = sceneContext;
    const followed = camera.cameraFollowTarget;

    if(followed) {
        // keep the target centered as it moves along its orbit
        followed.getWorldPosition(tmpTarget);
        if(tmpTarget.distanceToSquared(controls.getTarget(tmpPosition, true)) > FOLLOW_EPSILON_SQ) {
            controls.moveTo(tmpTarget.x, tmpTarget.y, tmpTarget.z, true);
        }

        // after arriving, ease into a slow orbit around the object (paused while the user drags)
        if(!rigState.isFlying && !rigState.isUserControlling) {
            rigState.autoRotateLevel = Math.min(1, rigState.autoRotateLevel + delta / AUTO_ROTATE_FADE_IN);
            controls.rotate(AUTO_ROTATE_SPEED * rigState.autoRotateLevel * delta, 0, true);
        }
    }

    controls.update(delta);
}

export {
    createCameraControls,
    flyToObject,
    flyToOverview,
    stopFollowing,
    jumpTo,
    updateCamera,
    computeArrivalAngles,
    worldBoundingSphere,
    setCameraObstacles,
    flightSmoothTime,
    rigState,
    AUTO_ROTATE_SPEED,
    VIEW_FILL_FACTOR,
    MIN_ARRIVAL_ELEVATION,
    MAX_ARRIVAL_ELEVATION,
};
