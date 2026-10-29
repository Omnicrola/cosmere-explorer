import * as THREE from 'three';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/data/fileResources.js', () => ({ loadAsteroidMeshes: () => [] }));

import { Planet } from '../../src/stellarObjects/Planet.js';
import { Moon } from '../../src/stellarObjects/Moon.js';
import { Star } from '../../src/stellarObjects/Star.js';
import { CognitiveAnomaly } from '../../src/stellarObjects/CognitiveAnomaly.js';
import { ParticulateRing } from '../../src/stellarObjects/ParticulateRing.js';
import { StellarObject } from '../../src/stellarObjects/StellarObject.js';
import {
    createPlanetData, createMoonData, createStarData, createCognitiveAnomalyData,
    createParticulateRing, createRingData,
} from '../../src/data/stellarData.js';
import { allStellarSystems } from '../../src/data/all-systems.js';

const frame = { clock: { elapsedTime: 0 }, camera: null };

// runs every update function in the object's graph, like the render loop does
function tick(root, seconds) {
    root.traverse((obj) => obj.userData.update?.(seconds, frame));
    root.updateMatrixWorld(true);
}

// the direction the surface's north pole points, in world space
function poleDirection(body) {
    body.updateWorldMatrix(true, true);
    const surface = body.children[0].children[0];
    return new THREE.Vector3(0, 1, 0).transformDirection(surface.matrixWorld);
}

const planetData = (overrides = {}) => createPlanetData({ id: 'p', radius: 1, orbitalRadius: 100, ...overrides });

describe('shared body structure', () => {
    const cases = [
        ['Star', () => new Star(createStarData({ id: 'star', radius: 5, colorIndex: 0.6, absoluteMagnitude: 4.8 }))],
        ['Planet', () => new Planet(planetData())],
        ['Moon', () => new Moon(createMoonData({ id: 'm' }))],
        ['CognitiveAnomaly', () => new CognitiveAnomaly(createCognitiveAnomalyData({ id: 'a' }))],
        ['ParticulateRing', () => new ParticulateRing(createParticulateRing({ id: 'r' }))],
    ];

    it.each(cases)('%s extends StellarObject and exposes one selectable body named by id', (_name, make) => {
        const obj = make();
        expect(obj).toBeInstanceOf(StellarObject);
        const selectable = [];
        obj.traverse((o) => o.userData.isSelectable && selectable.push(o));
        expect(selectable).toEqual([obj.body]);
        expect(obj.body.name).toBe(obj.stellarData.id);
        expect(obj.body.userData.info).toBe(obj.stellarData);
        expect(obj.body.parent).toBe(obj.objectAnchor);
    });
});

describe('axial tilt', () => {
    it('leans the surface over by axialTilt', () => {
        const planet = new Planet(planetData({ axialTilt: 30 }));
        const pole = poleDirection(planet.body);
        expect(THREE.MathUtils.radToDeg(pole.angleTo(new THREE.Vector3(0, 1, 0)))).toBeCloseTo(30);
    });

    it('keeps pointing the same way in space as the planet orbits', () => {
        const planet = new Planet(planetData({ axialTilt: 25, orbitalSpeed: 1 }));
        const before = poleDirection(planet.body);
        // a quarter of an orbit
        tick(planet, 31556926 / 4);
        expect(THREE.MathUtils.radToDeg(planet.orbitCentroid.rotation.y)).toBeCloseTo(90);
        expect(poleDirection(planet.body).angleTo(before)).toBeLessThan(1e-6);
    });

    it('does not tilt planetary rings, whose inclination is relative to the orbital plane', () => {
        const ringed = new Planet(planetData({ axialTilt: 40, rings: createRingData({ visible: true, inclination: 0 }) }));
        const rings = ringed.body.children.find((c) => c.constructor.name === 'PlanetaryRings');
        expect(rings).toBeDefined();
        rings.updateWorldMatrix(true, false);
        const ringUp = new THREE.Vector3(0, 1, 0).transformDirection(rings.matrixWorld);
        expect(ringUp.angleTo(new THREE.Vector3(0, 1, 0))).toBeLessThan(1e-6);
    });

    it('defaults to no tilt when the data has none', () => {
        const ring = new ParticulateRing(createParticulateRing({ id: 'r' }));
        expect(poleDirection(ring.body).angleTo(new THREE.Vector3(0, 1, 0))).toBeLessThan(1e-6);
    });
});

describe('spin', () => {
    it('spins the surface at spinRate degrees per second', () => {
        const planet = new Planet(planetData({ spinRate: 10 }));
        tick(planet, 3);
        expect(THREE.MathUtils.radToDeg(planet.bodySurface.rotation.y)).toBeCloseTo(30);
    });

    it('does not spin the rings or the moons', () => {
        const ringed = new Planet(planetData({ spinRate: 10, rings: createRingData({ visible: true }) }));
        const moon = new Moon(createMoonData({ id: 'm', orbitalSpeed: 0 }));
        ringed.addStellarObject(moon);
        const rings = ringed.body.children.find((c) => c.constructor.name === 'PlanetaryRings');
        const ringRotation = rings.rotation.y;

        tick(ringed, 3);
        expect(rings.rotation.y).toBe(ringRotation);
        expect(moon.parent).toBe(ringed.objectAnchor);
    });

    it('leaves moons still by default (tidally locked)', () => {
        const moon = new Moon(createMoonData({ id: 'm' }));
        tick(moon, 10);
        expect(moon.bodySurface.rotation.y).toBe(0);
    });
});

describe('CognitiveAnomaly', () => {
    it('sits at orbitStart on its orbit and stays there (regression: was outside the orbit groups)', () => {
        const anomaly = new CognitiveAnomaly(createCognitiveAnomalyData({ id: 'a', orbitalRadius: 175, orbitStart: 90, orbitalSpeed: 5 }));
        anomaly.updateMatrixWorld(true);
        const start = anomaly.body.getWorldPosition(new THREE.Vector3());
        expect(start.x).toBeCloseTo(0);
        expect(start.z).toBeCloseTo(-175);

        tick(anomaly, 31556926);
        expect(anomaly.body.getWorldPosition(new THREE.Vector3()).distanceTo(start)).toBeLessThan(1e-6);
    });
});

describe('system data', () => {
    function* walk(objects = []) {
        for(const obj of objects) {
            yield obj;
            yield* walk(obj.children);
        }
    }

    it('no longer carries removed fields', () => {
        for(const system of allStellarSystems) {
            for(const obj of walk(system.stellarObjects)) {
                for(const removed of ['planetRadius', 'separationDistance', 'opacity']) {
                    expect(obj, `${obj.id ?? obj.stellarObjectType}.${removed}`).not.toHaveProperty(removed);
                    expect(obj.rings ?? {}).not.toHaveProperty(removed);
                }
            }
        }
    });
});
