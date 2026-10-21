import * as THREE from 'three';
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/data/fileResources.js', () => ({ loadAsteroidMeshes: () => [] }));

import { AsteroidBelt } from '../../src/stellarObjects/AsteroidBelt.js';
import { Spinner } from '../../src/stellarObjects/modifiers/Spinner.js';

afterEach(() => vi.restoreAllMocks());

describe('AsteroidBelt.randomizeTransform', () => {
    it.each([0, 0.1, 0.25, 0.5, 0.99])('never produces a negative or zero scale (random=%s, regression)', (r) => {
        vi.spyOn(Math, 'random').mockReturnValue(r);
        const scale = new THREE.Vector3();
        AsteroidBelt.randomizeTransform(100, 10).decompose(new THREE.Vector3(), new THREE.Quaternion(), scale);
        expect(scale.x).toBeGreaterThan(0);
        expect(scale.x).toBeCloseTo(scale.y);
        expect(scale.x).toBeCloseTo(scale.z);
    });

    it('places asteroids within the belt', () => {
        const position = new THREE.Vector3();
        for(let i = 0; i < 50; i++) {
            AsteroidBelt.randomizeTransform(100, 10).decompose(position, new THREE.Quaternion(), new THREE.Vector3());
            const radius = Math.hypot(position.x, position.z);
            expect(radius).toBeGreaterThanOrEqual(100 - 1e-6);
            expect(radius).toBeLessThanOrEqual(110 + 1e-6);
        }
    });
});

describe('Spinner (regression: module failed to import)', () => {
    it('rotates its parent object at spinRate degrees per second', () => {
        const parentObj = new THREE.Object3D();
        new Spinner(90).update(2, { parentObj });
        expect(parentObj.rotation.y).toBeCloseTo(Math.PI);
    });
});
