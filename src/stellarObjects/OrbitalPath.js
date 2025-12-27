import * as THREE from 'three';
import { LineMaterial } from "jsm/lines/LineMaterial.js";
import { Line2 } from "jsm/lines/Line2.js";
import { LineGeometry } from "jsm/lines/LineGeometry.js";

export class OrbitalPath extends THREE.Group {
    constructor(radius, hue = 0, lightness = 1.0, width = 2 ) {
        super();

        const color = new THREE.Color().setRGB(lightness, lightness, lightness);
        const ringMat = new LineMaterial({
            color,
            linewidth: width,
        });
        ringMat.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport
        const lineGeo = new LineGeometry();
        lineGeo.setPositions(OrbitalPath.getRingVerts(radius));
        const orbitRing = new Line2(lineGeo, ringMat);
        orbitRing.rotation.x = Math.PI * 0.5;
        orbitRing.computeLineDistances();

        this.add(orbitRing);
    }

    static getRingVerts(radius) {
        const positions = [];
        const numVerts = 128;
        for (let i = 0; i <= numVerts; i += 1) {
            const angle = i / numVerts * Math.PI * 2;
            positions.push(radius * Math.cos(angle), radius * Math.sin(angle), 0);
        }
        return positions;
    }

}