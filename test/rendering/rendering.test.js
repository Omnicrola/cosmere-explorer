import * as THREE from 'three';
import { describe, it, expect, vi } from 'vitest';
import { disposeObject3D } from '../../src/rendering/dispose.js';
import { collectTransmissionMeshes, setBloomVisibility } from '../../src/rendering/RenderTools.js';

describe('disposeObject3D (regression: GPU memory leaked on every system switch)', () => {
    it('disposes geometries, materials and their textures', () => {
        const map = new THREE.Texture();
        const material = new THREE.MeshStandardMaterial({ map });
        const geometry = new THREE.SphereGeometry(1);
        const root = new THREE.Group();
        root.add(new THREE.Mesh(geometry, material));

        const spies = [geometry, material, map].map((o) => vi.spyOn(o, 'dispose'));
        disposeObject3D(root);
        spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
    });

    it('disposes shared resources only once', () => {
        const geometry = new THREE.SphereGeometry(1);
        const material = new THREE.MeshBasicMaterial();
        const root = new THREE.Group();
        root.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, material));

        const geometrySpy = vi.spyOn(geometry, 'dispose');
        const counts = disposeObject3D(root);
        expect(geometrySpy).toHaveBeenCalledTimes(1);
        expect(counts).toEqual({ geometries: 1, materials: 1, textures: 0 });
    });

    it('handles material arrays, shader uniforms and the scene background', () => {
        const uniformTexture = new THREE.Texture();
        const background = new THREE.Texture();
        const shader = new THREE.ShaderMaterial({ uniforms: { tex: { value: uniformTexture } } });
        const scene = new THREE.Scene();
        scene.background = background;
        scene.add(new THREE.Mesh(new THREE.BoxGeometry(), [shader, new THREE.MeshBasicMaterial()]));

        const spies = [uniformTexture, background].map((t) => vi.spyOn(t, 'dispose'));
        const counts = disposeObject3D(scene);
        spies.forEach((spy) => expect(spy).toHaveBeenCalled());
        expect(counts.materials).toBe(2);
    });
});

describe('transmission meshes', () => {
    it('collects only meshes with transmission and toggles their layers', () => {
        const glass = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhysicalMaterial({ transmission: 0.9 }));
        const rock = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
        const root = new THREE.Group().add(glass, rock);

        const meshes = collectTransmissionMeshes(root);
        expect(meshes).toEqual([glass]);

        setBloomVisibility(meshes, false);
        expect(glass.layers.isEnabled(0)).toBe(false);
        expect(glass.layers.isEnabled(1)).toBe(true);

        setBloomVisibility(meshes, true);
        expect(glass.layers.isEnabled(0)).toBe(true);
        expect(glass.layers.isEnabled(1)).toBe(false);
    });
});
