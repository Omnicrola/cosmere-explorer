import { describe, it, expect, vi, afterEach } from 'vitest';
import { userSettings, isValidId, recordNavigation, restoreSettingsIntoUrl } from '../../src/data/userSettings.js';

afterEach(() => vi.restoreAllMocks());

const urlParam = (key) => new URLSearchParams(window.location.search).get(key);

function nextPopState() {
    return new Promise((resolve) => window.addEventListener('popstate', resolve, { once: true }));
}

describe('userSettings', () => {
    it('writes the value to the URL and localStorage', () => {
        userSettings.currentSelection = 'roshar';
        expect(urlParam('planet')).toBe('roshar');
        expect(localStorage.getItem('planet')).toBe('roshar');
        expect(userSettings.currentSelection).toBe('roshar');
    });

    it('removes cleared values instead of storing the string "null" (regression)', () => {
        userSettings.currentSelection = 'roshar';
        userSettings.currentSelection = null;
        expect(localStorage.getItem('planet')).toBeNull();
        expect(window.location.search).not.toContain('planet');
        expect(userSettings.currentSelection).toBeNull();
    });

    it('plain setters replace the current history entry', () => {
        const pushState = vi.spyOn(history, 'pushState');
        userSettings.currentSelection = 'roshar';
        userSettings.currentSystem = 'roshar-star';
        expect(pushState).not.toHaveBeenCalled();
    });

    it('reads only from the URL while running, so back/forward state is authoritative', () => {
        localStorage.setItem('system', 'scadrial-star');
        expect(userSettings.currentSystem).toBeNull();
        history.replaceState(null, '', '/?system=roshar-star');
        expect(userSettings.currentSystem).toBe('roshar-star');
    });

    it('keeps other URL parameters when a value changes', () => {
        userSettings.currentSystem = 'roshar-star';
        userSettings.currentSelection = 'roshar';
        userSettings.currentSelection = null;
        expect(urlParam('system')).toBe('roshar-star');
    });
});

describe('recordNavigation', () => {
    it('adds one history entry per navigation, and back returns to the previous state', async () => {
        userSettings.currentSystem = 'roshar-star';
        const pushState = vi.spyOn(history, 'pushState');

        recordNavigation(() => { userSettings.currentSelection = 'roshar'; });
        expect(pushState).toHaveBeenCalledTimes(1);
        expect(urlParam('planet')).toBe('roshar');

        const popped = nextPopState();
        history.back();
        await popped;
        expect(urlParam('system')).toBe('roshar-star');
        expect(urlParam('planet')).toBeNull();
    });

    it('groups several setting changes into a single entry', async () => {
        userSettings.currentSystem = 'roshar-star';
        userSettings.currentSelection = 'roshar';
        const pushState = vi.spyOn(history, 'pushState');
        recordNavigation(() => {
            userSettings.currentSystem = 'scadrial-star';
            userSettings.currentSelection = null;
        });
        expect(pushState).toHaveBeenCalledTimes(1);

        const popped = nextPopState();
        history.back();
        await popped;
        expect(urlParam('system')).toBe('roshar-star');
        expect(urlParam('planet')).toBe('roshar');
    });

    it('adds no entry when nothing changed (e.g. while restoring from back/forward)', () => {
        userSettings.currentSelection = 'roshar';
        const pushState = vi.spyOn(history, 'pushState');
        recordNavigation(() => { userSettings.currentSelection = 'roshar'; });
        expect(pushState).not.toHaveBeenCalled();
    });
});

describe('restoreSettingsIntoUrl', () => {
    it('fills an empty URL from the last visit', () => {
        localStorage.setItem('system', 'scadrial-star');
        localStorage.setItem('planet', 'scadrial');
        restoreSettingsIntoUrl();
        expect(urlParam('system')).toBe('scadrial-star');
        expect(urlParam('planet')).toBe('scadrial');
    });

    it('lets a shared link win over the last visit', () => {
        localStorage.setItem('system', 'scadrial-star');
        localStorage.setItem('planet', 'scadrial');
        history.replaceState(null, '', '/?system=roshar-star&planet=ashyn');
        restoreSettingsIntoUrl();
        expect(urlParam('system')).toBe('roshar-star');
        expect(urlParam('planet')).toBe('ashyn');
    });

    it('does not attach a remembered planet from a different system to a shared link', () => {
        localStorage.setItem('system', 'scadrial-star');
        localStorage.setItem('planet', 'scadrial');
        history.replaceState(null, '', '/?system=roshar-star');
        restoreSettingsIntoUrl();
        expect(urlParam('planet')).toBeNull();
    });

    it('ignores legacy "null" strings left in storage by older versions', () => {
        localStorage.setItem('planet', 'null');
        restoreSettingsIntoUrl();
        expect(urlParam('planet')).toBeNull();
    });
});

describe('isValidId', () => {
    it('rejects empty-ish values', () => {
        for(const value of ['', 'null', 'undefined', null, undefined]) {
            expect(isValidId(value)).toBe(false);
        }
    });

    it('accepts real ids', () => {
        expect(isValidId('roshar')).toBe(true);
    });
});
