import * as THREE from 'three';
import { coronaTurbulence } from './createStar.js';

function createDistortionMesh(objData, geo, material, isSelectable, rot) {
    const distortionMesh = new THREE.Mesh(geo, material);
    distortionMesh.castShadow = false;
    distortionMesh.receiveShadow = false;
    distortionMesh.position.x = objData.orbitalRadius;
    distortionMesh.name = objData.id;
    distortionMesh.rotation.set(rot.x, rot.y, rot.z);

    const radius = objData.radius + (Math.random() +1) /2;
    
    distortionMesh.userData = {
        isSelectable : isSelectable,
        info: objData,
        update: coronaTurbulence(geo, radius)
    };
    return distortionMesh
}

function createCognitiveAnomoly(objData) {
    const anchorGroup = new THREE.Group();

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


    anchorGroup.add(createDistortionMesh(objData, geo, material, true, {x:1.27,y:1.1655,z:-2.452}));
    anchorGroup.add(createDistortionMesh(objData, geo, material, false, {x:-1.17,y:0.2525,z:0.05652}));

    return anchorGroup;
}

export { createCognitiveAnomoly };