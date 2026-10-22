import * as THREE from 'three';
import { describe, it, expect, vi } from 'vitest';
import { createUpdateList, markSceneGraphChanged } from '../../src/core/updateList.js';

function updatable() {
    const obj = new THREE.Object3D();
    obj.userData.update = vi.fn();
    return obj;
}

describe('createUpdateList', () => {
    it('finds objects with an update function at any depth', () => {
        const root = new THREE.Group();
        const a = updatable();
        const b = updatable();
        root.add(a, new THREE.Group().add(b), new THREE.Object3D());
        expect(createUpdateList().get(root)).toEqual([a, b]);
    });

    it('does not search the scene again every frame (regression: full traversal per frame)', () => {
        const root = new THREE.Group().add(updatable());
        const traverse = vi.spyOn(root, 'traverse');
        const list = createUpdateList();
        for(let frame = 0; frame < 10; frame++) {
            list.get(root);
        }
        expect(traverse).toHaveBeenCalledTimes(1);
    });

    it('picks up objects added later once the scene graph is marked changed (e.g. asteroid belts)', () => {
        const root = new THREE.Group();
        const list = createUpdateList();
        expect(list.get(root)).toEqual([]);

        const late = updatable();
        root.add(late);
        markSceneGraphChanged();
        expect(list.get(root)).toEqual([late]);
    });

    it('rebuilds after being invalidated (system switch)', () => {
        const root = new THREE.Group().add(updatable());
        const list = createUpdateList();
        const first = list.get(root);
        root.clear();
        list.invalidate();
        expect(list.get(root)).not.toBe(first);
        expect(list.get(root)).toEqual([]);
    });
});
