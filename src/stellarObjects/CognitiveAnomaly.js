import * as THREE from 'three';
import { StellarObject } from "./StellarObject.js";
import { GeoNoise } from './modifiers/GeoNoise.js';

export class CognitiveAnomaly extends StellarObject {

    // anomalies don't orbit: they hold still relative to the star, at orbitStart along their orbit
    constructor(objData) {
        super(objData, { stationary: true });

        const rot = {x:1.27,y:1.1655,z:-2.452};

        const geo = new THREE.IcosahedronGeometry(1, 6);
        const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0.95, 0.95, 1.0),
            transmission: 0.98,
            roughness: 0.0,
            thickness: 1.0,
            specularIntensity: 0.0,
            metalness: 0.0,
            ior: 2.1,
            transparent: true,
        });

        const distortionMesh = new THREE.Mesh(geo, material);
        distortionMesh.castShadow = false;
        distortionMesh.receiveShadow = false;
        distortionMesh.rotation.set(rot.x, rot.y, rot.z);

        this.createBody([distortionMesh]);
    
        const radius = objData.radius + (Math.random() +1) / 2;
        this.addModifier(new GeoNoise(geo, radius, objData.noiseStyle));
    }
}