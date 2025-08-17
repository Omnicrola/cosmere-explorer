import * as THREE from 'three';
import { LineMaterial } from "jsm/lines/LineMaterial.js";
import { Line2 } from "jsm/lines/Line2.js";
import { LineGeometry } from "jsm/lines/LineGeometry.js";
import { createRingMaterial } from '../../resources/materials.js';


function getRingVerts(radius) {
    const positions = [];
    const numVerts = 128;
    for (let i = 0; i <= numVerts; i += 1) {
        const angle = i / numVerts * Math.PI * 2;
        positions.push(radius * Math.cos(angle), radius * Math.sin(angle), 0);
    }
    return positions;
}

// orbital path ring
function createOrbitalRing( radius, hue = 0, lightness = 1.0, width = 2 ) {

    const color = new THREE.Color().setRGB(lightness, lightness, lightness);
    const ringMat = new LineMaterial({
        color,
        linewidth: width,
    });
    ringMat.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport
    const lineGeo = new LineGeometry();
    lineGeo.setPositions(getRingVerts(radius));
    const orbitRing = new Line2(lineGeo, ringMat);
    orbitRing.rotation.x = Math.PI * 0.5;
    orbitRing.computeLineDistances();
    return orbitRing;
}

// planetary rings (like Saturn)
function createPlanetaryRings(ringData) {
    const ringMaterial = createRingMaterial(ringData.albedoMap, ringData.alphaMap);
    const geometry = new THREE.TorusGeometry(ringData.radius, ringData.spread, 12, 48);
    const ringMesh = new THREE.Mesh(geometry, ringMaterial);

    ringMesh.scale.z = 0.001;
    ringMesh.rotation.x = THREE.MathUtils.degToRad(90) + THREE.MathUtils.degToRad(ringData.inclination);

    return ringMesh;
}

export { createOrbitalRing, createPlanetaryRings };