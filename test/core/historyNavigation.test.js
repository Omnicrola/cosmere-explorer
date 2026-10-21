import * as THREE from 'three';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mountAppDom, installSceneContext, makeSelectableSphere } from '../helpers.js';
import { restoreFromUrl } from '../../src/core/historyNavigation.js';
import { focusOnStellarObject, clearFocus } from '../../src/ui/interactions.js';
import { userSettings } from '../../src/data/userSettings.js';
import { allStellarSystems } from '../../src/data/all-systems.js';

const [systemA, systemB] = allStellarSystems;
const urlParam = (key) => new URLSearchParams(window.location.search).get(key);

function goBack() {
    const popped = new Promise((resolve) => window.addEventListener('popstate', resolve, { once: true }));
    history.back();
    return popped;
}

let camera, loadSystem, planet, moon;

beforeEach(() => {
    mountAppDom();
    let scene;
    ({ scene, camera } = installSceneContext());
    planet = makeSelectableSphere('planet', 1, new THREE.Vector3(0, 0, 5));
    moon = makeSelectableSphere('moon', 0.5, new THREE.Vector3(3, 0, 5));
    scene.add(planet, moon);
    scene.updateMatrixWorld(true);

    const select = document.getElementById('planet-select');
    for(const id of ['-1', 'planet', 'moon']) {
        select.appendChild(Object.assign(document.createElement('option'), { value: id }));
    }

    loadSystem = vi.fn();
    userSettings.currentSystem = systemA.id;
});

const restore = () => restoreFromUrl({ currentSystem: systemA, loadSystem });

describe('back button', () => {
    it('returns to the previously selected planet', async () => {
        focusOnStellarObject({ selectedId: 'planet' });
        focusOnStellarObject({ selectedId: 'moon' });

        await goBack();
        restore();

        expect(camera.cameraFollowTarget).toBe(planet);
        expect(urlParam('planet')).toBe('planet');
        expect(loadSystem).not.toHaveBeenCalled();
    });

    it('reopens the planet that was showing before the panel was closed', async () => {
        focusOnStellarObject({ selectedId: 'planet' });
        clearFocus();
        expect(camera.cameraFollowTarget).toBeNull();

        await goBack();
        restore();
        expect(camera.cameraFollowTarget).toBe(planet);
    });

    it('goes back to the overview when the previous entry had no selection', async () => {
        focusOnStellarObject({ selectedId: 'planet' });

        await goBack();
        restore();

        expect(camera.cameraFollowTarget).toBeNull();
        expect(document.getElementById('info-panel').classList.contains('hidden')).toBe(true);
    });

    it('reloads the previous system when the system changed', async () => {
        history.pushState(null, '', `/?system=${systemB.id}`);
        await goBack();
        restoreFromUrl({ currentSystem: systemB, loadSystem });
        expect(loadSystem).toHaveBeenCalledWith(systemA);
        expect(localStorage.getItem('system')).toBe(systemA.id);
    });

    it('does not add new history entries while restoring, so forward still works', async () => {
        focusOnStellarObject({ selectedId: 'planet' });
        focusOnStellarObject({ selectedId: 'moon' });

        await goBack();
        const pushState = vi.spyOn(history, 'pushState');
        restore();
        expect(pushState).not.toHaveBeenCalled();
        pushState.mockRestore();

        const forward = new Promise((resolve) => window.addEventListener('popstate', resolve, { once: true }));
        history.forward();
        await forward;
        restore();
        expect(urlParam('planet')).toBe('moon');
        expect(camera.cameraFollowTarget).toBe(moon);
    });

    it('falls back to the first system for an unknown system id', () => {
        history.replaceState(null, '', '/?system=nope');
        restoreFromUrl({ currentSystem: systemB, loadSystem });
        expect(loadSystem).toHaveBeenCalledWith(allStellarSystems[0]);
        expect(urlParam('system')).toBe(allStellarSystems[0].id);
    });
});
