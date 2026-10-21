import { describe, it, expect } from 'vitest';
import { escapeHtml, safeUrl, formatStat } from '../../src/util/html.js';

describe('escapeHtml', () => {
    it('escapes markup characters', () => {
        expect(escapeHtml(`<img src=x onerror="alert('x')">&`))
            .toBe('&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;');
    });

    it('treats null and undefined as empty', () => {
        expect(escapeHtml(null)).toBe('');
        expect(escapeHtml(undefined)).toBe('');
    });
});

describe('safeUrl', () => {
    it('keeps http and https links', () => {
        expect(safeUrl('https://coppermind.net/wiki/Roshar')).toBe('https://coppermind.net/wiki/Roshar');
    });

    it('neutralizes script and data urls', () => {
        expect(safeUrl('javascript:alert(1)')).toBe('#');
        expect(safeUrl('data:text/html,<b>x</b>')).toBe('#');
    });

    it('handles missing or malformed urls', () => {
        expect(safeUrl(undefined)).toBe('#');
        expect(safeUrl('not a url')).toBe('#');
    });
});

describe('formatStat', () => {
    it('shows ?? for unknown values instead of NaN or undefined', () => {
        expect(formatStat(undefined)).toBe('??');
        expect(formatStat(null)).toBe('??');
        expect(formatStat(undefined, { scale: 100000, locale: true })).toBe('??');
        expect(formatStat('abc')).toBe('??');
    });

    it('keeps zero as a real value', () => {
        expect(formatStat(0)).toBe('0');
    });

    it('applies scale and locale formatting', () => {
        expect(formatStat(2, { scale: 1000 })).toBe('2000');
        expect(formatStat(7, { scale: 100000, locale: true })).toBe((700000).toLocaleString());
    });
});
