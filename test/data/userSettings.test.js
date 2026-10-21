import { describe, it, expect } from 'vitest';
import { userSettings, isValidId } from '../../src/data/userSettings.js';

describe('userSettings', () => {
    it('writes the value to the URL and localStorage', () => {
        userSettings.currentSelection = 'roshar';
        expect(new URLSearchParams(window.location.search).get('planet')).toBe('roshar');
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

    it('does not add browser history entries for every selection (regression)', () => {
        const before = history.length;
        userSettings.currentSelection = 'roshar';
        userSettings.currentSelection = 'ashyn';
        userSettings.currentSystem = 'roshar-system';
        expect(history.length).toBe(before);
    });

    it('prefers the URL over localStorage so shared links win', () => {
        localStorage.setItem('system', 'scadrial-system');
        history.replaceState(null, '', '/?system=roshar-system');
        expect(userSettings.currentSystem).toBe('roshar-system');
    });

    it('falls back to localStorage when the URL has no value', () => {
        localStorage.setItem('system', 'scadrial-system');
        expect(userSettings.currentSystem).toBe('scadrial-system');
    });

    it('ignores legacy "null" strings left in storage by older versions', () => {
        localStorage.setItem('planet', 'null');
        expect(userSettings.currentSelection).toBeNull();
    });

    it('keeps other URL parameters when a value changes', () => {
        userSettings.currentSystem = 'roshar-system';
        userSettings.currentSelection = 'roshar';
        userSettings.currentSelection = null;
        expect(new URLSearchParams(window.location.search).get('system')).toBe('roshar-system');
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
