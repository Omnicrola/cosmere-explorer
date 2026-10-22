import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import { planFlight, pointOnPath, pathIntrusion, nearestAzimuth, wrapAngle } from '../../src/core/flightPlan.js';

const star = { center: new THREE.Vector3(), radius: 7 };

// camera beside a planet at x=200, flying to the opposite side of the star
const acrossTheStar = {
    start: { target: new THREE.Vector3(200, 0, 0), radius: 15, phi: Math.PI / 2 - 0.2, theta: Math.PI / 2 },
    endTarget: new THREE.Vector3(-200, 0, 0),
    endRadius: 12,
    phi: Math.PI / 2 - 0.2,
    theta: Math.PI / 2,
};

describe('pointOnPath', () => {
    it('starts at the current camera position and ends at the arrival position', () => {
        const flight = planFlight(acrossTheStar);
        const first = pointOnPath(flight, 0);
        const expectedFirst = new THREE.Vector3().setFromSphericalCoords(15, acrossTheStar.start.phi, Math.PI / 2).add(acrossTheStar.start.target);
        expect(first.distanceTo(expectedFirst)).toBeLessThan(1e-6);
        expect(pointOnPath(flight, 1).distanceTo(acrossTheStar.endTarget)).toBeCloseTo(12);
    });
});

describe('planFlight', () => {
    it('keeps the preferred arrival when the path is clear', () => {
        const flight = planFlight({ ...acrossTheStar, endTarget: new THREE.Vector3(200, 0, 50), obstacles: [star] });
        expect(flight.end.theta).toBeCloseTo(Math.PI / 2);
        expect(flight.end.phi).toBeCloseTo(acrossTheStar.phi);
    });

    it('would fly through the star with the preferred arrival', () => {
        const straight = planFlight({ ...acrossTheStar, obstacles: [] });
        expect(pathIntrusion(straight, [star])).toBeGreaterThan(0);
    });

    it('re-plans a path that would pass through an obstacle (regression)', () => {
        const flight = planFlight({ ...acrossTheStar, obstacles: [star] });
        expect(pathIntrusion(flight, [star])).toBe(0);
        for(let s = 0; s <= 1; s += 0.01) {
            expect(pointOnPath(flight, s).distanceTo(star.center)).toBeGreaterThan(star.radius);
        }
    });

    it('ignores obstacles the camera starts inside, since they cannot be avoided', () => {
        const hugging = { center: acrossTheStar.start.target, radius: 20 };
        const flight = planFlight({ ...acrossTheStar, endTarget: new THREE.Vector3(200, 0, 300), obstacles: [hugging] });
        expect(flight.end.theta).toBeCloseTo(Math.PI / 2);
    });
});

describe('azimuth helpers', () => {
    it('wraps angles into [-PI, PI)', () => {
        expect(wrapAngle(Math.PI * 3)).toBeCloseTo(-Math.PI);
        expect(wrapAngle(-Math.PI / 2)).toBeCloseTo(-Math.PI / 2);
    });

    it('picks the end azimuth the short way round from an accumulated angle', () => {
        const current = Math.PI * 10 + 0.1;
        const end = nearestAzimuth(current, -0.1);
        expect(end - current).toBeCloseTo(-0.2);
    });
});
