import * as THREE from 'three';
import { describe, it, expect, beforeEach } from 'vitest';
import { mountAppDom, installSceneContext, makeSelectableSphere } from '../helpers.js';
import {
    attachPointerHandlers,
    setSelectableObjects,
    pickObjectAt,
    focusOnStellarObject,
    stopFollowingStellarObject,
    clearFocus,
} from '../../src/ui/interactions.js';
import { updateCamera } from '../../src/core/cameraFollow.js';
import { userSettings } from '../../src/data/userSettings.js';
import { collectSelectableObjects } from '../../src/ui/selection.js';

const RECT = { left: 0, top: 0, width: 100, height: 100 };

let scene, camera, orbitControls, planet, star;

beforeEach(() => {
    mountAppDom();
    ({ scene, camera, orbitControls } = installSceneContext());

    // camera at z=10 looking at the origin: the planet sits directly in front of the star
    star = makeSelectableSphere('star', 2, new THREE.Vector3(0, 0, 0));
    planet = makeSelectableSphere('planet', 1, new THREE.Vector3(0, 0, 5));
    // a larger, non-selectable atmosphere shell around the planet
    planet.add(new THREE.Mesh(new THREE.SphereGeometry(1.2), new THREE.MeshBasicMaterial()));
    scene.add(star, planet);
    scene.updateMatrixWorld(true);
    setSelectableObjects(collectSelectableObjects(scene));

    const select = document.getElementById('planet-select');
    for(const id of ['-1', 'star', 'planet']) {
        const option = document.createElement('option');
        option.value = id;
        select.appendChild(option);
    }
});

describe('pickObjectAt', () => {
    it('selects the nearest object under the pointer, not one behind it (regression)', () => {
        expect(pickObjectAt(50, 50, RECT)).toBe(planet);
    });

    it('returns null when clicking empty space', () => {
        expect(pickObjectAt(2, 2, RECT)).toBeNull();
    });
});

describe('canvas pointer handling', () => {
    let canvas;
    beforeEach(() => {
        canvas = document.getElementById('canvas');
        canvas.getBoundingClientRect = () => RECT;
        attachPointerHandlers(canvas);
    });

    const pointer = (type, x, y) => new MouseEvent(type, { clientX: x, clientY: y, bubbles: true });

    it('selects an object on click', () => {
        canvas.dispatchEvent(pointer('pointerdown', 50, 50));
        canvas.dispatchEvent(pointer('pointerup', 50, 50));
        expect(camera.cameraFollowTarget).toBe(planet);
    });

    it('does not select when the user finishes a camera drag over an object (regression)', () => {
        canvas.dispatchEvent(pointer('pointerdown', 10, 10));
        canvas.dispatchEvent(pointer('pointerup', 50, 50));
        expect(camera.cameraFollowTarget ?? null).toBeNull();
    });

    it('ignores clicks on UI panels over the canvas (regression)', () => {
        document.getElementById('next-planet').dispatchEvent(pointer('pointerdown', 50, 50));
        document.getElementById('next-planet').dispatchEvent(pointer('pointerup', 50, 50));
        expect(camera.cameraFollowTarget ?? null).toBeNull();
    });
});

describe('focusOnStellarObject', () => {
    it('focuses an object by id and remembers the selection', () => {
        expect(focusOnStellarObject({ selectedId: 'planet' })).toBe(true);
        expect(camera.cameraFollowTarget).toBe(planet);
        expect(userSettings.currentSelection).toBe('planet');
        expect(document.getElementById('info-panel').classList.contains('hidden')).toBe(false);
    });

    it('does not throw for an id that is not in the scene, and forgets it (regression)', () => {
        userSettings.currentSelection = 'planet-from-another-system';
        expect(() => focusOnStellarObject({ selectedId: 'planet-from-another-system' })).not.toThrow();
        expect(focusOnStellarObject({ selectedId: 'nope' })).toBe(false);
        expect(userSettings.currentSelection).toBeNull();
        expect(window.location.search).not.toContain('planet=');
    });

    it('does not throw for the "-- Select --" placeholder or empty ids (regression)', () => {
        expect(focusOnStellarObject({ selectedId: '-1' })).toBe(false);
        expect(focusOnStellarObject({ selectedId: null })).toBe(false);
        expect(focusOnStellarObject({ selectedId: '' })).toBe(false);
    });

    it('overrides any in-flight camera tween such as the warp-in (regression)', () => {
        focusOnStellarObject({ selectedId: 'planet' });
        expect(gsap.to).toHaveBeenCalledWith(camera.position, expect.objectContaining({ overwrite: 'auto' }));
    });

    it('starts camera travel from the current look target, not the mesh local position (regression)', () => {
        // a moon whose mesh sits at local (0,0,0) inside an anchor that is far from the origin
        const anchor = new THREE.Group();
        anchor.position.set(100, 0, 0);
        const moon = makeSelectableSphere('moon', 0.5, new THREE.Vector3(0, 0, 0));
        anchor.add(moon);
        scene.add(anchor);
        scene.updateMatrixWorld(true);

        // the camera is currently looking at a planet at x=10
        orbitControls.target.set(10, 0, 0);
        focusOnStellarObject({ stellarObj: moon });

        // after 0.1s the travel is 20% of the way from x=10 to x=100
        updateCamera(0.1);
        expect(orbitControls.target.x).toBeCloseTo(10 + 0.2 * 90);
    });

    it('keeps following the target once the camera has arrived', () => {
        focusOnStellarObject({ stellarObj: planet });
        updateCamera(1);
        planet.position.set(3, 0, 5);
        scene.updateMatrixWorld(true);
        updateCamera(0.016);
        expect(orbitControls.target.x).toBeCloseTo(3);
        expect(orbitControls.autoRotate).toBe(true);
    });
});

describe('stopFollowingStellarObject / clearFocus', () => {
    it('does not throw when nothing is being followed (regression)', () => {
        camera.cameraFollowTarget = null;
        expect(() => stopFollowingStellarObject()).not.toThrow();
        expect(() => clearFocus()).not.toThrow();
    });

    it('clears the selection, drop-down and info panel', () => {
        focusOnStellarObject({ selectedId: 'planet' });
        clearFocus();
        expect(camera.cameraFollowTarget).toBeNull();
        expect(userSettings.currentSelection).toBeNull();
        expect(document.getElementById('planet-select').value).toBe('-1');
        expect(document.getElementById('info-panel').classList.contains('hidden')).toBe(true);
    });
});
