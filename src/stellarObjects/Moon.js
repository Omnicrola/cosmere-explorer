import * as THREE from 'three';
import { StellarObject } from "./StellarObject.js";
import { createPlanetMaterial, createAtmosphericShader, createFresnelMaterial } from '../../resources/materials.js';

export class Moon extends StellarObject {
    constructor(moonData) {
        super(moonData);

        const moonMat = createPlanetMaterial(moonData);
    
        const moonGeo = new THREE.IcosahedronGeometry(moonData.radius, 6);
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.name = moonData.id;
        moon.userData.info = moonData;
                
        let _showOrbitalRing = false;
        moon.userData = {
            isSelectable: true,
            info: moonData,
            // hasOrbitalRing: true,
            // get showOrbitalRing() { return _showOrbitalRing; },
            // set showOrbitalRing(val) {
            //     _showOrbitalRing = val;
            //     orbitalRing.visible = val;
            // },
        }

        this.addStellarObject(moon);
    }
}