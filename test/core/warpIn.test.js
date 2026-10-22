import * as THREE from 'three';
import { describe, it, expect, vi } from 'vitest';
import { computeWarpInCameraPosition, startWarpIn } from '../../src/core/warpIn.js';

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

describe('startWarpIn', () => {
    function setup() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();
        const system = systemSpanning(600);
        scene.add(system);
        return { scene, camera, system };
    }

    it('focuses the remembered selection only once the scene is at full size (regression)', () => {
        // focusing mid-warp measured a shrunken object and parked the camera inside it
        const { scene, camera, system } = setup();
        const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
        let scaleAtArrival = null;

        startWarpIn({ scene, camera, systemGraph: system, onArrive: () => { scaleAtArrival = scene.scale.x; } });

        expect(scaleAtArrival).toBe(1);
        expect(setTimeoutSpy).not.toHaveBeenCalled();
        setTimeoutSpy.mockRestore();
    });

    it('glides the camera to the overview when there is no selection', () => {
        const { scene, camera, system } = setup();
        startWarpIn({ scene, camera, systemGraph: system });
        expect(camera.position.y).toBeCloseTo(100);
        expect(camera.position.z).toBeCloseTo(150);
    });

    it('returns a cancel function that kills its tweens', () => {
        const { scene, camera, system } = setup();
        const cancel = startWarpIn({ scene, camera, systemGraph: system });
        cancel();
        gsap.to.mock.results.forEach((result) => expect(result.value.kill).toHaveBeenCalled());
    });
});
