import * as THREE from 'three';
import { StellarObject } from "./StellarObject.js";
import { createFresnelMaterial } from "../rendering/materials.js";


export class ParticulateRing extends StellarObject {
    constructor(objData) {
        super(objData);

        // a faint haze, densest where the ring is seen face-on
        const ringMaterial = createFresnelMaterial({
            rimHex: 0x888888,
            scale: 2.0,
            bias: 0.001,
            power: 2,
            invertFalloff: true,
            intensity: 0.25,
        });

        const geometry = new THREE.TorusGeometry(objData.ringDiameter, objData.ringRadius, 64, 32);
        const ringMesh = new THREE.Mesh(geometry, ringMaterial);        


        ringMesh.name = objData.id;
        ringMesh.userData = {
            info : objData,
            isSelectable : true,
        };

        this.addStellarObject(ringMesh);
    }
}
