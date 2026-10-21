import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mountAppDom, installSceneContext } from '../helpers.js';
import { ui } from '../../src/ui/userInterface.js';
import { allStellarSystems } from '../../src/data/all-systems.js';
import { userSettings } from '../../src/data/userSettings.js';

let onSystemSelected;

beforeEach(() => {
    mountAppDom();
    installSceneContext();
    onSystemSelected = vi.fn();
    ui.init({ onSystemSelected });
    ui.updateScannerList(allStellarSystems[0].stellarObjects);
});

const change = (el, value) => {
    el.value = value;
    el.dispatchEvent(new Event('change'));
};

describe('planet drop-down', () => {
    it('choosing "-- Select --" clears the selection instead of crashing (regression)', () => {
        const select = document.getElementById('planet-select');
        expect(() => change(select, '-1')).not.toThrow();
        expect(userSettings.currentSelection).toBeNull();
        expect(window.location.search).not.toContain('planet=');
    });

    it('lists every object with an id, starting with the placeholder', () => {
        const options = [...document.getElementById('planet-select').options];
        expect(options[0].value).toBe('-1');
        expect(options.length).toBeGreaterThan(1);
    });
});

describe('info panel buttons', () => {
    it('closing the system info panel with nothing selected does not crash (regression)', () => {
        userSettings.currentSystem = allStellarSystems[0].id;
        document.getElementById('btn-system-info').click();

        const panel = document.getElementById('info-panel');
        expect(panel.classList.contains('hidden')).toBe(false);
        expect(panel.querySelector('h1.name').textContent).toContain(allStellarSystems[0].name);

        expect(() => panel.querySelector('[data-action="close"]').click()).not.toThrow();
        expect(panel.classList.contains('hidden')).toBe(true);
    });

    it('copy-link handles a rejected clipboard write', async () => {
        const writeText = vi.fn().mockRejectedValue(new Error('denied'));
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

        userSettings.currentSystem = allStellarSystems[0].id;
        document.getElementById('btn-system-info').click();
        document.querySelector('[data-action="copy-link"]').click();
        await Promise.resolve();
        await Promise.resolve();

        expect(writeText).toHaveBeenCalled();
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });
});

describe('system selector', () => {
    it('lists every system and reports the chosen one', () => {
        const selector = document.getElementById('system-selector');
        expect(selector.options.length).toBe(allStellarSystems.length);

        const target = allStellarSystems[2];
        userSettings.currentSelection = 'something';
        change(selector, target.id);

        expect(onSystemSelected).toHaveBeenCalledWith(target);
        expect(userSettings.currentSystem).toBe(target.id);
        expect(userSettings.currentSelection).toBeNull();
    });

    it('ignores unknown system ids', () => {
        const selector = document.getElementById('system-selector');
        const option = document.createElement('option');
        option.value = 'bogus';
        selector.appendChild(option);
        change(selector, 'bogus');
        expect(onSystemSelected).not.toHaveBeenCalled();
    });
});
