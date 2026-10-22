import * as THREE from 'three';
import { describe, it, expect, beforeEach } from 'vitest';
import { installSceneContext, makeSelectableSphere, simulateCamera } from '../helpers.js';
import {
    flyToObject,
    stopFollowing,
    updateCamera,
    setCameraObstacles,
    flightSmoothTime,
    worldBoundingSphere,
    rigState,
    VIEW_FILL_FACTOR,
    MIN_ARRIVAL_ELEVATION,
    MAX_ARRIVAL_ELEVATION,
} from '../../src/core/cameraRig.js';

const STAR_RADIUS = 7;

let scene, camera, controls, star;

beforeEach(() => {
    ({ scene, camera, cameraControls: controls } = installSceneContext());
    star = makeSelectableSphere('star', STAR_RADIUS, new THREE.Vector3());
    scene.add(star);
    scene.updateMatrixWorld(true);
});

function addPlanet(name, position, radius = 1) {
    const planet = makeSelectableSphere(name, radius, position);
    scene.add(planet);
    scene.updateMatrixWorld(true);
    setCameraObstacles(scene.children.filter((c) => c.userData.isSelectable));
    return planet;
}

// places the camera instantly and lets it settle
function startAt(position, target) {
    controls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false);
    simulateCamera(0.2, updateCamera);
}

// flies to an object and records per-frame motion
function recordFlight(obj, seconds = 5) {
    const frames = [];
    let previousDirection = camera.getWorldDirection(new THREE.Vector3());
    let previousPosition = camera.position.clone();
    flyToObject(obj);
    simulateCamera(seconds, updateCamera, () => {
        const direction = camera.getWorldDirection(new THREE.Vector3());
        frames.push({
            turnDegrees: THREE.MathUtils.radToDeg(direction.angleTo(previousDirection)),
            step: camera.position.distanceTo(previousPosition),
            distanceFromStar: camera.position.length(),
        });
        previousDirection = direction;
        previousPosition = camera.position.clone();
    });
    const pathLength = frames.reduce((sum, f) => sum + f.step, 0);
    return { frames, pathLength };
}

const worldPosition = (obj) => obj.getWorldPosition(new THREE.Vector3());

function elevationOf(position, target) {
    const offset = position.clone().sub(target);
    return Math.asin(offset.y / offset.length());
}

describe('flying to an object', () => {
    it('ends centered on the object, framed by the view (not at a fixed distance)', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0), 2);
        startAt(new THREE.Vector3(0, 1000, 100), new THREE.Vector3());
        recordFlight(planet);

        const target = controls.getTarget(new THREE.Vector3());
        expect(target.distanceTo(worldPosition(planet))).toBeLessThan(0.01);
        const expected = controls.getDistanceToFitSphere(2) * VIEW_FILL_FACTOR;
        expect(camera.position.distanceTo(worldPosition(planet))).toBeCloseTo(expected, 1);
    });

    it('eases in and out instead of jumping (regression: expo.out teleport)', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0));
        startAt(new THREE.Vector3(0, 1000, 100), new THREE.Vector3());
        const { frames, pathLength } = recordFlight(planet);

        // the first frame moves only a sliver of the trip, and no frame covers much of it
        expect(frames[0].step / pathLength).toBeLessThan(0.01);
        expect(Math.max(...frames.map((f) => f.step)) / pathLength).toBeLessThan(0.04);
        // and the camera has settled by the end
        expect(frames.at(-1).step / pathLength).toBeLessThan(1e-5);
    });

    it('turns the view gradually (regression: whip-pan before moving)', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0));
        // start beside another planet, looking away from the destination
        startAt(new THREE.Vector3(-185, 3, 0), new THREE.Vector3(-200, 0, 0));
        const { frames } = recordFlight(planet);
        expect(Math.max(...frames.map((f) => f.turnDegrees))).toBeLessThan(4);
    });

    it('swings around the star instead of flying through it (regression)', () => {
        // destination is directly across the star from where the camera is
        const planet = addPlanet('planet', new THREE.Vector3(-200, 0, 0));
        startAt(new THREE.Vector3(215, 3, 0), new THREE.Vector3(200, 0, 0));
        const { frames } = recordFlight(planet);
        expect(Math.min(...frames.map((f) => f.distanceFromStar))).toBeGreaterThan(STAR_RADIUS * 1.2);
    });

    it('arrives from the side the camera was already on', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0));
        // coming in from far out on the +z side...
        startAt(new THREE.Vector3(0, 100, 600), new THREE.Vector3());
        recordFlight(planet);
        // ...arrives on the +z side of the planet, not swung round to the far side
        expect(camera.position.z).toBeGreaterThan(5);
    });

    it('arrives at a comfortable elevation, even from straight overhead or below', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0));

        startAt(new THREE.Vector3(200, 900, 0.01), new THREE.Vector3(200, 0, 0));
        recordFlight(planet);
        expect(elevationOf(camera.position, worldPosition(planet))).toBeLessThanOrEqual(MAX_ARRIVAL_ELEVATION + 1e-3);

        stopFollowing();
        startAt(new THREE.Vector3(260, -80, 0), new THREE.Vector3(200, 0, 0));
        recordFlight(planet);
        expect(elevationOf(camera.position, worldPosition(planet))).toBeGreaterThanOrEqual(MIN_ARRIVAL_ELEVATION - 1e-3);
    });

    it('turns the short way round, even after a long auto-rotate (regression)', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0));
        startAt(new THREE.Vector3(0, 200, 300), new THREE.Vector3());
        // auto-rotate accumulates the azimuth without wrapping it
        controls.azimuthAngle += Math.PI * 10;
        controls.update(0);

        const before = controls.azimuthAngle;
        recordFlight(planet);
        expect(Math.abs(controls.azimuthAngle - before)).toBeLessThanOrEqual(Math.PI + 1e-6);
    });

    it('keeps a moving object centered', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0));
        startAt(new THREE.Vector3(0, 300, 300), new THREE.Vector3());
        recordFlight(planet);

        planet.position.set(205, 0, 3);
        scene.updateMatrixWorld(true);
        simulateCamera(3, updateCamera);
        expect(controls.getTarget(new THREE.Vector3()).distanceTo(worldPosition(planet))).toBeLessThan(0.01);
    });

    it('does not let the user zoom inside the followed object', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0), 3);
        startAt(new THREE.Vector3(0, 300, 300), new THREE.Vector3());
        recordFlight(planet);
        controls.dollyTo(0.5, false);
        // outside the planet, with room for the camera's near clipping plane
        expect(controls.distance).toBeGreaterThan(3 + camera.near);
    });
});

describe('auto-rotate', () => {
    let planet;
    beforeEach(() => {
        planet = addPlanet('planet', new THREE.Vector3(200, 0, 0));
        startAt(new THREE.Vector3(0, 300, 300), new THREE.Vector3());
    });

    const azimuthChangeOver = (seconds) => {
        const before = controls.azimuthAngle;
        simulateCamera(seconds, updateCamera);
        return controls.azimuthAngle - before;
    };

    it('does not rotate during the flight (regression: auto-rotate kicked in mid-flight)', () => {
        flyToObject(planet);
        simulateCamera(0.3, updateCamera);
        expect(rigState.isFlying).toBe(true);
        expect(rigState.autoRotateLevel).toBe(0);
    });

    it('fades in after arriving, rather than starting at full speed', () => {
        flyToObject(planet);
        for(let frame = 0; rigState.isFlying && frame < 600; frame++) {
            simulateCamera(1 / 60, updateCamera);
        }
        expect(rigState.isFlying).toBe(false);

        const early = azimuthChangeOver(0.25);
        simulateCamera(2, updateCamera);
        const late = azimuthChangeOver(0.25);
        expect(early).toBeLessThan(late);
        expect(late).toBeGreaterThan(0);
    });

    it('pauses while the user drags, and eases back in afterwards', () => {
        recordFlight(planet);
        simulateCamera(2, updateCamera);

        controls.dispatchEvent({ type: 'controlstart' });
        expect(rigState.autoRotateLevel).toBe(0);
        simulateCamera(0.5, updateCamera);
        expect(rigState.autoRotateLevel).toBe(0);

        controls.dispatchEvent({ type: 'controlend' });
        simulateCamera(0.5, updateCamera);
        expect(rigState.autoRotateLevel).toBeGreaterThan(0);
        expect(rigState.autoRotateLevel).toBeLessThan(1);
    });
});

describe('worldBoundingSphere', () => {
    it('fits a sphere tightly, including scaled children such as an atmosphere', () => {
        const planet = addPlanet('planet', new THREE.Vector3(10, 0, 0), 2);
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial());
        atmosphere.scale.setScalar(1.05);
        planet.add(atmosphere);

        const sphere = worldBoundingSphere(planet);
        expect(sphere.center.distanceTo(new THREE.Vector3(10, 0, 0))).toBeLessThan(1e-6);
        expect(sphere.radius).toBeCloseTo(2.1);
    });
});

describe('stopFollowing', () => {
    it('does nothing when nothing is followed', () => {
        const distance = controls.distance;
        expect(() => stopFollowing()).not.toThrow();
        simulateCamera(1, updateCamera);
        expect(controls.distance).toBeCloseTo(distance);
    });

    it('eases the camera back from the object and stops rotating', () => {
        const planet = addPlanet('planet', new THREE.Vector3(200, 0, 0));
        startAt(new THREE.Vector3(0, 300, 300), new THREE.Vector3());
        recordFlight(planet);
        const distance = controls.distance;

        stopFollowing();
        simulateCamera(3, updateCamera);
        expect(camera.cameraFollowTarget).toBeNull();
        expect(controls.distance).toBeCloseTo(distance * 1.5, 1);

        const azimuth = controls.azimuthAngle;
        simulateCamera(1, updateCamera);
        expect(controls.azimuthAngle).toBeCloseTo(azimuth);
    });
});

describe('flightSmoothTime', () => {
    it('is longer for longer trips, within limits', () => {
        const short = flightSmoothTime(5, 10);
        const long = flightSmoothTime(5000, 10);
        expect(long).toBeGreaterThan(short);
        expect(flightSmoothTime(1e9, 1)).toBeLessThanOrEqual(0.8);
        expect(flightSmoothTime(0, 1)).toBeGreaterThanOrEqual(0.35);
    });
});
