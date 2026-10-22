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

describe('system data file conventions', () => {
    const dataDir = path.join(ROOT, 'src/data');
    const systemFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith('-system-data.js'));

    it('names every system file [name]-system-data.js', () => {
        const strays = fs.readdirSync(dataDir).filter((f) => /system/i.test(f) && !f.endsWith('-system-data.js') && f !== 'all-systems.js');
        expect(strays).toEqual([]);
    });

    it.each(systemFiles)('%s exports [name]SystemData', async (file) => {
        const name = file.replace('-system-data.js', '');
        const module = await import(`../../src/data/${file}`);
        expect(Object.keys(module)).toEqual([`${name}SystemData`]);
    });

    it('lists every system except the default test system', async () => {
        const listed = new Set(allStellarSystems);
        for(const file of systemFiles.filter((f) => f !== 'default-system-data.js')) {
            const module = await import(`../../src/data/${file}`);
            expect(listed.has(Object.values(module)[0]), file).toBe(true);
        }
    });
});

describe('deployment', () => {
    const config = fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf-8');

    it.each(['source-art/', 'tools/', 'test/'])('keeps %s out of the published site', (folder) => {
        expect(config).toMatch(new RegExp(`^\\s*-\\s*${folder}\\s*$`, 'm'));
    });

    it('keeps source artwork out of the deployed resources folder', () => {
        const strays = [];
        const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
            const full = path.join(dir, entry.name);
            if(entry.isDirectory()) walk(full);
            else if(/\.(psd|blend)$/i.test(entry.name)) strays.push(path.relative(ROOT, full));
        });
        walk(path.join(ROOT, 'resources'));
        expect(strays).toEqual([]);
    });

    it('stores source artwork in Git LFS', () => {
        const attributes = fs.readFileSync(path.join(ROOT, '.gitattributes'), 'utf-8');
        expect(attributes).toMatch(/^\*\.psd filter=lfs/m);
        expect(attributes).toMatch(/^\*\.blend filter=lfs/m);
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
