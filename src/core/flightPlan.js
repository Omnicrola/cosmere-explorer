import * as THREE from "three";

// Plans camera flights for camera-controls.
//
// During a transition camera-controls damps the look target, and the camera's orbit around
// it (radius, polar angle, azimuth), with the same spring. Starting from rest, every value
// therefore follows the same normalized progress curve s(t) from 0 to 1, and the camera
// path is:
//
//   position(s) = lerp(startTarget, endTarget, s) + spherical(lerp(start, end, s))
//
// That makes the whole path predictable up front, so a flight can be checked for passing
// through a star or planet, and re-planned to swing around it.

const PATH_SAMPLES = 48;
// how far to stay from an obstacle: a multiple of its radius, plus a little for the near plane
const CLEARANCE_FACTOR = 1.3;
const CLEARANCE_MARGIN = 1.0;

// alternative approach directions to try when the preferred one is blocked, in order
const AZIMUTH_OFFSETS = [0, 30, -30, 60, -60, 90, -90, 135, -135, 180].map(THREE.MathUtils.degToRad);
const ELEVATION_STEPS = [0, 25, 50].map(THREE.MathUtils.degToRad);
const MAX_ELEVATION = THREE.MathUtils.degToRad(80);

const tmpSpherical = new THREE.Spherical();
const tmpOffset = new THREE.Vector3();

// wraps an angle into [-PI, PI)
function wrapAngle(angle) {
    return THREE.MathUtils.euclideanModulo(angle + Math.PI, Math.PI * 2) - Math.PI;
}

// the end azimuth closest to the current one, so the camera always turns the short way round
function nearestAzimuth(currentTheta, desiredTheta) {
    return currentTheta + wrapAngle(desiredTheta - currentTheta);
}

function pointOnPath(flight, s, out = new THREE.Vector3()) {
    const { start, end } = flight;
    tmpSpherical.set(
        THREE.MathUtils.lerp(start.radius, end.radius, s),
        THREE.MathUtils.lerp(start.phi, end.phi, s),
        THREE.MathUtils.lerp(start.theta, end.theta, s),
    );
    return out.lerpVectors(start.target, end.target, s).add(tmpOffset.setFromSpherical(tmpSpherical));
}

// how far the path gets inside the clearance of any obstacle (0 = clear).
// Obstacles the path starts or ends inside are ignored, since they can't be avoided.
function pathIntrusion(flight, obstacles) {
    const first = pointOnPath(flight, 0);
    const last = pointOnPath(flight, 1);
    const relevant = obstacles.filter(({ center, radius }) => {
        const clearance = radius * CLEARANCE_FACTOR + CLEARANCE_MARGIN;
        return first.distanceTo(center) > clearance && last.distanceTo(center) > clearance;
    });

    let worst = 0;
    const point = new THREE.Vector3();
    for(let i = 1; i < PATH_SAMPLES; i++) {
        pointOnPath(flight, i / PATH_SAMPLES, point);
        for(const { center, radius } of relevant) {
            const clearance = radius * CLEARANCE_FACTOR + CLEARANCE_MARGIN;
            worst = Math.max(worst, clearance - point.distanceTo(center));
        }
    }
    return worst;
}

// Chooses the end of a flight. 'start' is the camera's current orbit (target, radius,
// phi, theta); the preferred arrival is given as phi/theta around endTarget at endRadius.
// Returns the first candidate whose path stays clear of the obstacles (spheres with
// center and radius), preferring the smallest change from the preferred arrival.
function planFlight({ start, endTarget, endRadius, phi, theta, obstacles = [] }) {
    const preferredElevation = Math.PI / 2 - phi;
    let best = null;

    for(const elevationStep of ELEVATION_STEPS) {
        const elevation = Math.min(preferredElevation + elevationStep, MAX_ELEVATION);
        for(const azimuthOffset of AZIMUTH_OFFSETS) {
            const flight = {
                start,
                end: {
                    target: endTarget,
                    radius: endRadius,
                    phi: Math.PI / 2 - elevation,
                    theta: nearestAzimuth(start.theta, theta + azimuthOffset),
                },
            };
            const intrusion = pathIntrusion(flight, obstacles);
            if(intrusion <= 0) {
                return flight;
            }
            if(!best || intrusion < best.intrusion) {
                best = { flight, intrusion };
            }
        }
    }
    // nothing is fully clear: take the path that gets least close
    return best.flight;
}

export { planFlight, pointOnPath, pathIntrusion, nearestAzimuth, wrapAngle };
