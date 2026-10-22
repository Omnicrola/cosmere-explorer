import * as THREE from 'three';
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../src/data/fileResources.js', () => ({ loadAsteroidMeshes: () => [] }));

import { AsteroidBelt } from '../../src/stellarObjects/AsteroidBelt.js';
import { Spinner } from '../../src/stellarObjects/modifiers/Spinner.js';
import { createTumbleMaterial, injectTumble, advanceTumble } from '../../src/rendering/tumbleMaterial.js';

afterEach(() => vi.restoreAllMocks());

describe('AsteroidBelt.randomizeTransform', () => {
    it.each([0, 0.1, 0.25, 0.5, 0.99])('never produces a negative or zero scale (random=%s, regression)', (r) => {
        vi.spyOn(Math, 'random').mockReturnValue(r);
        const scale = new THREE.Vector3();
        AsteroidBelt.randomizeTransform(100, 10).decompose(new THREE.Vector3(), new THREE.Quaternion(), scale);
        expect(scale.x).toBeGreaterThan(0);
        expect(scale.x).toBeCloseTo(scale.y);
        expect(scale.x).toBeCloseTo(scale.z);
    });

    it('places asteroids within the belt', () => {
        const position = new THREE.Vector3();
        for(let i = 0; i < 50; i++) {
            AsteroidBelt.randomizeTransform(100, 10).decompose(position, new THREE.Quaternion(), new THREE.Vector3());
            const radius = Math.hypot(position.x, position.z);
            expect(radius).toBeGreaterThanOrEqual(100 - 1e-6);
            expect(radius).toBeLessThanOrEqual(110 + 1e-6);
        }
    });
});

describe('AsteroidBelt tumbling on the GPU', () => {
    const rock = () => new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial());

    it('stores a tumble speed per instance on its own copy of the geometry', () => {
        const source = rock();
        const group = AsteroidBelt.createInstancedGroup(source, 25, { orbitalRadius: 100, orbitalSpread: 10, orbitalSpeed: 1 });
        const instanced = group.children[0];

        const speeds = instanced.geometry.getAttribute('tumbleSpeed');
        expect(speeds.isInstancedBufferAttribute).toBe(true);
        expect(speeds.count).toBe(25);
        expect(instanced.geometry).not.toBe(source.geometry);
        expect(source.geometry.getAttribute('tumbleSpeed')).toBeUndefined();
        expect(instanced.material).not.toBe(source.material);
    });

    it('does not rewrite instance matrices every frame (regression: CPU tumbling)', () => {
        const group = AsteroidBelt.createInstancedGroup(rock(), 100, { orbitalRadius: 100, orbitalSpread: 10, orbitalSpeed: 1 });
        const instanced = group.children[0];
        const matricesBefore = Float32Array.from(instanced.instanceMatrix.array);
        const versionBefore = instanced.instanceMatrix.version;
        const getMatrixAt = vi.spyOn(instanced, 'getMatrixAt');

        instanced.userData.update(0.5);
        instanced.userData.update(0.5);

        expect(getMatrixAt).not.toHaveBeenCalled();
        expect(instanced.instanceMatrix.version).toBe(versionBefore);
        expect(instanced.instanceMatrix.array).toEqual(matricesBefore);
        expect(instanced.material.userData.tumbleTime.value).toBeCloseTo(1);
    });
});

describe('tumble material', () => {
    it.each(['phong', 'standard', 'lambert', 'physical'])('hooks into the %s vertex shader', (name) => {
        const shader = injectTumble(THREE.ShaderLib[name].vertexShader);
        expect(shader).toContain('attribute float tumbleSpeed;');
        expect(shader).toContain('transformed = tumbleRotation() * transformed;');
        expect(shader).toContain('objectNormal = tumbleRotation() * objectNormal;');
        // the rotation must happen before the instance transform and normal transform
        expect(shader.indexOf('tumbleRotation() * transformed')).toBeLessThan(shader.indexOf('#include <project_vertex>'));
        expect(shader.indexOf('tumbleRotation() * objectNormal')).toBeLessThan(shader.indexOf('#include <defaultnormal_vertex>'));
    });

    it('fails loudly if three.js renames the shader chunks it depends on', () => {
        expect(() => injectTumble('void main() {}')).toThrow(/not found/);
    });

    it('wires the time uniform into the compiled shader and keeps its own program cache key', () => {
        const base = new THREE.MeshPhongMaterial();
        const material = createTumbleMaterial(base);
        const shader = { uniforms: {}, vertexShader: THREE.ShaderLib.phong.vertexShader };
        material.onBeforeCompile(shader);

        advanceTumble(material, 2);
        expect(shader.uniforms.uTumbleTime.value).toBe(2);
        expect(material.customProgramCacheKey()).not.toBe(base.customProgramCacheKey());
    });
});

describe('Spinner', () => {
    it('rotates its target at spinRate degrees per second', () => {
        const target = new THREE.Object3D();
        new Spinner(90, target).update(2);
        expect(target.rotation.y).toBeCloseTo(Math.PI);
    });
});
