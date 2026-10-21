import * as THREE from 'three';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/data/fileResources.js', () => ({ loadAsteroidMeshes: () => [] }));

import { createOrbitalPlane } from '../../src/stellarObjects/orbitalPlane.js';
import { Planet } from '../../src/stellarObjects/Planet.js';
import { BinaryPair } from '../../src/stellarObjects/BinaryPair.js';
import { createPlanetData, createBinarySet } from '../../src/data/stellarData.js';

// the direction perpendicular to an orbit, in world space
function orbitNormal(object) {
    object.updateWorldMatrix(true, false);
    return new THREE.Vector3(0, 1, 0).transformDirection(object.matrixWorld);
}

function expectVectorClose(actual, expected) {
    expect(actual.x).toBeCloseTo(expected.x);
    expect(actual.y).toBeCloseTo(expected.y);
    expect(actual.z).toBeCloseTo(expected.z);
}

describe('createOrbitalPlane', () => {
    it('leaves an un-inclined orbit in the ecliptic', () => {
        const { node, plane } = createOrbitalPlane(new THREE.Vector2(0, 0));
        expectVectorClose(orbitNormal(plane), new THREE.Vector3(0, 1, 0));
        expect(plane.parent).toBe(node);
    });

    it('tilts the orbit towards the direction given by the ascending node (regression: incline.y ignored)', () => {
        // a 30 degree tilt, with the ascending node rotated 90 degrees
        const { node, plane } = createOrbitalPlane(new THREE.Vector2(30, 90));
        new THREE.Group().add(node);
        expectVectorClose(orbitNormal(plane), new THREE.Vector3(Math.sin(Math.PI / 6), Math.cos(Math.PI / 6), 0));
    });

    it('gives different orbits for different nodes with the same inclination', () => {
        const a = orbitNormal(createOrbitalPlane(new THREE.Vector2(10, 0)).plane);
        const b = orbitNormal(createOrbitalPlane(new THREE.Vector2(10, 120)).plane);
        expect(a.angleTo(b)).toBeGreaterThan(0.1);
    });

    it('treats a missing incline as none', () => {
        expectVectorClose(orbitNormal(createOrbitalPlane(undefined).plane), new THREE.Vector3(0, 1, 0));
    });
});

describe('StellarObject orbits', () => {
    it('applies both the inclination and the ascending node', () => {
        const planet = new Planet(createPlanetData({ id: 'p', radius: 1, orbitalIncline: new THREE.Vector2(30, 90) }));
        expectVectorClose(orbitNormal(planet.orbitCentroid), new THREE.Vector3(0.5, Math.cos(Math.PI / 6), 0));
    });

    it('still places the object at orbitStart along its orbit', () => {
        const planet = new Planet(createPlanetData({ id: 'p', radius: 1, orbitalRadius: 10, orbitStart: 90 }));
        planet.updateMatrixWorld(true);
        const position = planet.objectAnchor.getWorldPosition(new THREE.Vector3());
        expectVectorClose(position, new THREE.Vector3(0, 0, -10));
    });
});

describe('BinaryPair', () => {
    it('does not tilt its members a second time (regression)', () => {
        const pair = createBinarySet({
            orbitalIncline: new THREE.Vector2(20, 45),
            children: [createPlanetData({ id: 'a', radius: 1 }), createPlanetData({ id: 'b', radius: 1 })],
        });
        pair.children.forEach((child) => {
            expect(child.orbitalIncline.x).toBe(0);
            expect(child.orbitalIncline.y).toBe(0);
        });
    });

    it('uses the same orbital plane construction as other objects', () => {
        const pair = new BinaryPair({ orbitalRadius: 50, orbitalIncline: new THREE.Vector2(30, 90), orbitStart: 0 });
        const expected = orbitNormal(createOrbitalPlane(new THREE.Vector2(30, 90)).plane);
        expectVectorClose(orbitNormal(pair.orbitalGroup), expected);
    });
});
