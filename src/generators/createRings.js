import * as THREE from 'three';
import { LineMaterial } from "jsm/lines/LineMaterial.js";
import { Line2 } from "jsm/lines/Line2.js";
import { LineGeometry } from "jsm/lines/LineGeometry.js";


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

function createPlanetaryRings(ringData) {
    const color = new THREE.Color(1,1,1);
    const planeMaterial = new THREE.MeshBasicMaterial({ color });
    const ringPlane = new THREE.Mesh(new THREE.PlaneGeometry(1,1,1,1), planeMaterial);
    
    return ringPlane;
}

export { createOrbitalRing, createPlanetaryRings };