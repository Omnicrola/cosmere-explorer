import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import { computeWarpInCameraPosition } from '../../src/core/warpIn.js';

function systemSpanning(width) {
    const group = new THREE.Group();
    const planet = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial());
    planet.position.x = width / 2 - 1;
    const other = planet.clone();
    other.position.x = -planet.position.x;
    group.add(planet, other);
    return group;
}

describe('computeWarpInCameraPosition', () => {
    it('backs the camera off in proportion to the system size', () => {
        const scene = new THREE.Scene();
        const system = systemSpanning(600);
        scene.add(system);
        const position = computeWarpInCameraPosition(scene, system);
        expect(position.x).toBe(0);
        expect(position.y).toBeCloseTo(100);
        expect(position.z).toBeCloseTo(150);
    });

    it('measures at full scale even if a previous warp left the scene shrunk (regression)', () => {
        // switching systems mid warp-in used to measure a 0.0001-scale system and
        // park the camera inside the star
        const scene = new THREE.Scene();
        scene.scale.setScalar(0.0001);
        scene.updateMatrixWorld(true);
        const system = systemSpanning(600);
        scene.add(system);

        const position = computeWarpInCameraPosition(scene, system);
        expect(position.y).toBeCloseTo(100);
        expect(scene.scale.x).toBe(1);
    });
});
