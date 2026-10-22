import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { allStellarSystems, findSystemById } from '../../src/data/all-systems.js';
import { iconUrl } from '../../src/ui/infoPanels.js';

// Validates the hand-written system data, which is where community contributions land.

const ROOT = path.resolve(__dirname, '../..');
const TEXTURES = 'resources/textures/';
const SKYBOX_FACES = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

function* walk(objects = []) {
    for(const obj of objects) {
        yield obj;
        yield* walk(obj.children);
    }
}

const fileExists = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));

describe.each(allStellarSystems.map((s) => [s.name, s]))('%s', (_name, system) => {
    const objects = [...walk(system.stellarObjects)];
    const identified = objects.filter((o) => o.id);

    it('has unique object ids (the scene looks objects up by id)', () => {
        const ids = identified.map((o) => o.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('has ids that are safe to use in URLs', () => {
        identified.forEach((o) => expect(o.id).toMatch(/^[a-z0-9-]+$/i));
    });

    it('has an icon file for the system and every selectable object', () => {
        const missing = [system, ...identified]
            .map((o) => iconUrl(o.icon))
            .filter((url) => !fileExists(url));
        expect(missing).toEqual([]);
    });

    it('has every referenced texture file', () => {
        const textures = objects.flatMap((o) => [o.textureMap, o.oceanMap, o.rings?.albedoMap, o.rings?.alphaMap]);
        const missing = textures.filter(Boolean).filter((t) => !fileExists(TEXTURES + t));
        expect(missing).toEqual([]);
    });

    it('has all six skybox faces', () => {
        const missing = SKYBOX_FACES
            .map((face) => `${TEXTURES}${system.skyboxTexture}_${face}.png`)
            .filter((f) => !fileExists(f));
        expect(missing).toEqual([]);
    });

    it('links to the Coppermind over https, when a link is known', () => {
        [system, ...identified].filter((o) => o.coppermind).forEach((o) => {
            expect(o.coppermind, `${o.id ?? o.name} coppermind link`).toMatch(/^https:\/\//);
        });
    });

    it('has a name and description for every selectable object', () => {
        identified.forEach((o) => {
            expect(o.name, `${o.id} name`).toBeTruthy();
            expect(typeof o.description, `${o.id} description`).toBe('string');
        });
    });
});

describe('findSystemById', () => {
    it('finds systems by id and returns null for unknown ids', () => {
        expect(findSystemById(allStellarSystems[0].id)).toBe(allStellarSystems[0]);
        expect(findSystemById('nope')).toBeNull();
        expect(findSystemById(null)).toBeNull();
    });

    it('has unique system ids', () => {
        const ids = allStellarSystems.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
