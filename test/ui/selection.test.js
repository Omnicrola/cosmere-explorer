import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import {
    findNearestSelectable,
    findSelectableAncestor,
    collectSelectableObjects,
    isClickGesture,
    toNormalizedDeviceCoords,
} from '../../src/ui/selection.js';

function selectable(name) {
    const obj = new THREE.Object3D();
    obj.name = name;
    obj.userData.isSelectable = true;
    return obj;
}

describe('findNearestSelectable', () => {
    it('picks the nearest selectable hit, not the farthest (regression)', () => {
        const planet = selectable('planet');
        const star = selectable('star');
        // raycaster results are sorted nearest-first
        const intersects = [{ object: planet, distance: 3 }, { object: star, distance: 10 }];
        expect(findNearestSelectable(intersects)).toBe(planet);
    });

    it('skips hits on non-selectable objects such as orbit lines and asteroids', () => {
        const orbitLine = new THREE.Object3D();
        const star = selectable('star');
        expect(findNearestSelectable([{ object: orbitLine }, { object: star }])).toBe(star);
    });

    it('resolves a hit on an atmosphere or ring to its planet', () => {
        const planet = selectable('planet');
        const atmosphere = new THREE.Object3D();
        planet.add(atmosphere);
        expect(findNearestSelectable([{ object: atmosphere }])).toBe(planet);
    });

    it('returns null when nothing selectable was hit', () => {
        expect(findNearestSelectable([])).toBeNull();
        expect(findNearestSelectable([{ object: new THREE.Object3D() }])).toBeNull();
        expect(findSelectableAncestor(null)).toBeNull();
    });
});

describe('collectSelectableObjects', () => {
    it('finds selectable objects at any depth', () => {
        const root = new THREE.Group();
        const planet = selectable('planet');
        const moon = selectable('moon');
        planet.add(new THREE.Object3D());
        root.add(planet);
        root.add(new THREE.Group().add(moon));
        expect(collectSelectableObjects(root)).toEqual([planet, moon]);
    });
});

describe('isClickGesture', () => {
    it('treats a stationary press as a click', () => {
        expect(isClickGesture({ x: 10, y: 10 }, { x: 12, y: 11 })).toBe(true);
    });

    it('treats a camera drag as not a click (regression)', () => {
        expect(isClickGesture({ x: 10, y: 10 }, { x: 80, y: 40 })).toBe(false);
    });

    it('ignores a pointerup with no matching pointerdown', () => {
        expect(isClickGesture(null, { x: 1, y: 1 })).toBe(false);
    });
});

describe('toNormalizedDeviceCoords', () => {
    it('maps the canvas rect to -1..+1 with y up', () => {
        const rect = { left: 100, top: 50, width: 200, height: 100 };
        const out = toNormalizedDeviceCoords(200, 100, rect, new THREE.Vector2());
        expect(out.x).toBeCloseTo(0);
        expect(out.y).toBeCloseTo(0);

        toNormalizedDeviceCoords(100, 50, rect, out);
        expect(out.x).toBeCloseTo(-1);
        expect(out.y).toBeCloseTo(1);
    });
});
