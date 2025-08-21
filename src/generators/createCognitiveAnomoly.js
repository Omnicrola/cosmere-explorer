import * as THREE from 'three';
import { coronaTurbulence } from './createStar.js';

function createCognitiveAnomoly(objData) {
    const anchorGroup = new THREE.Group();

    const geo = new THREE.IcosahedronGeometry(1, 6);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        // flatShading: true,
        opacity: 0.1,
        ior: 2.33,
        transparent: true,
        side: THREE.DoubleSide,
    });
    const anomoly = new THREE.Mesh(geo, material);
    anchorGroup.add(anomoly);
    anomoly.position.x = objData.orbitalRadius;
    anomoly.name = objData.id;
    
    anomoly.userData = {
        isSelectable : true,
        info: objData,
        update: coronaTurbulence(geo, objData.radius)
    };


    return anchorGroup;
}

export { createCognitiveAnomoly };