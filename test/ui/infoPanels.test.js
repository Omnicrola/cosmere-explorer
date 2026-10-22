import { describe, it, expect } from 'vitest';
import { makeStatsForObject, makeSystemStats, renderPanelHtml, iconUrl } from '../../src/ui/infoPanels.js';
import { createPlanetData, createStarData, createMoonData, createStellarData } from '../../src/data/stellarData.js';

function toDom(html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    return container;
}

function statsText(container) {
    return [...container.querySelectorAll('li')].map((li) => li.textContent.replace(/\s+/g, ' ').trim());
}

describe('planet stats', () => {
    it('shows the perpendicularity value from the data (regression: field name mismatch)', () => {
        const planet = createPlanetData({ id: 'p', perpendicularity: 1 });
        const text = statsText(toDom(makeStatsForObject(planet)));
        expect(text).toContain('Known Perpendicularities: 1');
    });

    it('shows ?? for unknown values rather than inventing a number', () => {
        const planet = createPlanetData({ id: 'p' });
        const text = statsText(toDom(makeStatsForObject(planet)));
        expect(text).toContain('Known Perpendicularities: ??');
        expect(text).toContain('Radius: ?? standard');
    });
});

describe('star stats', () => {
    it('produces well-formed markup with one bold label per line (regression: unclosed <b> tags)', () => {
        const star = createStarData({ id: 's', radius: 7, absoluteMagnitude: 4.8, colorIndex: 0.65, mass: 1, planets: 3, coppermind: 'https://coppermind.net/wiki/Sun' });
        const container = toDom(makeStatsForObject(star));
        const items = container.querySelectorAll('li');
        expect(items.length).toBe(7);
        items.forEach((li) => {
            expect(li.querySelectorAll('b').length).toBeLessThanOrEqual(1);
            expect(li.querySelector('b b')).toBeNull();
        });
        expect(statsText(container)).toContain(`Equatorial Radius: ${(700000).toLocaleString()} km`);
    });

    it('shows ?? instead of NaN for a missing radius (regression)', () => {
        const star = createStarData({ id: 's' });
        const html = makeStatsForObject(star);
        expect(html).not.toContain('NaN');
        expect(statsText(toDom(html))).toContain('Equatorial Radius: ?? km');
    });
});

describe('panel rendering', () => {
    it('escapes names and descriptions so data cannot inject markup', () => {
        const moon = createMoonData({
            id: 'm',
            name: '<img src=x onerror=alert(1)>',
            description: 'line one\n<script>alert(2)</script>',
        });
        const container = toDom(renderPanelHtml(moon, makeStatsForObject(moon)));
        expect(container.querySelector('img[onerror]')).toBeNull();
        expect(container.querySelector('script')).toBeNull();
        expect(container.querySelector('.name').textContent).toContain('<img src=x onerror=alert(1)>');
        expect(container.querySelectorAll('.description p').length).toBe(2);
    });

    it('omits the Coppermind link when none is known', () => {
        const moon = createMoonData({ id: 'm', coppermind: '' });
        expect(toDom(makeStatsForObject(moon)).querySelector('a')).toBeNull();
    });

    it('refuses non-http coppermind links', () => {
        const planet = createPlanetData({ id: 'p', coppermind: 'javascript:alert(1)' });
        const link = toDom(makeStatsForObject(planet)).querySelector('a');
        expect(link.getAttribute('href')).toBe('#');
    });

    it('opens external links in a new tab without giving it window.opener (regression: target="_new")', () => {
        const star = createStarData({ id: 's', coppermind: 'https://coppermind.net/wiki/Sun' });
        const links = toDom(makeStatsForObject(star)).querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
        links.forEach((a) => {
            expect(a.getAttribute('target')).toBe('_blank');
            expect(a.getAttribute('rel')).toContain('noopener');
        });
    });

    it('renders system stats', () => {
        const system = createStellarData({ id: 'sys', shards: 'Honor', investedArts: 'Surgebinding', inhabitedPlanets: 1 });
        const text = statsText(toDom(makeSystemStats(system)));
        expect(text).toContain('Shards: Honor');
        expect(text).toContain('Inhabited Planets: 1');
    });
});

describe('iconUrl', () => {
    it('resolves data icons relative to the textures folder', () => {
        expect(iconUrl('Roshar/icon-roshar.png')).toBe('resources/textures/Roshar/icon-roshar.png');
    });

    it('does not double-prefix paths that already start at resources/ (regression)', () => {
        expect(iconUrl('resources/icons/icon-planet.svg')).toBe('resources/icons/icon-planet.svg');
    });

    it('falls back to the generic planet icon for a missing icon (regression: "textures/null")', () => {
        expect(iconUrl(null)).toBe('resources/icons/icon-planet.svg');
        expect(iconUrl('')).toBe('resources/icons/icon-planet.svg');
    });
});
