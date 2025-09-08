import * as THREE from 'three';

/************
 *  
************/
export class StellarObject extends THREE.Group {
    constructor(orbitalData) {
        this.modifiers = [];

        const orbitCentroid = new THREE.Group();
        const objectAnchor = new THREE.Group();

        objectAnchor.userData = {
            update: (deltaTime) => {
                objectAnchor.rotation.y += deltaTime * orbitalData.orbitalSpeed;
            }
        };
        objectAnchor.position.x = orbitalData.orbitalRadius;

        orbitCentroid.add(objectAnchor);
        this.add(orbitCentroid);
        this.objectAnchor = objectAnchor;
    }

    addStellarObject(obj) {
        this.objectAnchor.add(obj);
    }

    addModifier(modFunction) {
        this.modifiers.push(modFunction);
    }

    userData = {
        update : (deltaTime) => {
            this.modifiers.forEach(m => m.update(deltaTime, this));
        }
    };
}
