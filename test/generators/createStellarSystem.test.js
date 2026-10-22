import { describe, it, expect, vi } from 'vitest';

// asteroid meshes are fetched over the network in the browser; tests skip them
vi.mock('../../src/data/fileResources.js', () => ({ loadAsteroidMeshes: () => [] }));

import { createStellarSystem } from '../../src/generators/createStellarSystem.js';
import { allStellarSystems } from '../../src/data/all-systems.js';
import { collectSelectableObjects } from '../../src/ui/selection.js';
import { createStellarData, createPlanetData } from '../../src/data/stellarData.js';

function* walk(objects = []) {
    for(const obj of objects) {
        yield obj;
        yield* walk(obj.children);
    }
}

const loadSkybox = vi.fn((prefix) => ({ isTexture: true, prefix }));

describe.each(allStellarSystems.map((s) => [s.name, s]))('building %s', (_name, system) => {
    const { group, skybox } = createStellarSystem(system, { loadSkybox });

    it('returns the skybox for the caller to apply', () => {
        expect(skybox.prefix).toBe(system.skyboxTexture);
    });

    it('creates a selectable scene object for every id in the planet drop-down', () => {
        const ids = [...walk(system.stellarObjects)].map((o) => o.id).filter(Boolean);
        ids.forEach((id) => {
            const obj = group.getObjectByName(id);
            expect(obj, id).toBeDefined();
            expect(obj.userData.isSelectable, id).toBe(true);
            expect(obj.userData.info.id).toBe(id);
        });
        expect(collectSelectableObjects(group).length).toBe(ids.length);
    });

    it('includes its own light rather than adding it to a global scene', () => {
        expect(group.children.some((c) => c.isPointLight)).toBe(true);
    });
});

describe('createStellarSystem', () => {
    it('skips unknown object types instead of crashing', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        const data = createStellarData({
            id: 'test',
            stellarObjects: [{ stellarObjectType: 999 }, createPlanetData({ id: 'p', radius: 1 })],
        });
        const { group, skybox } = createStellarSystem(data, { loadSkybox });
        expect(group.getObjectByName('p')).toBeDefined();
        expect(skybox).toBeNull();
        expect(error).toHaveBeenCalled();
        error.mockRestore();
    });
});
