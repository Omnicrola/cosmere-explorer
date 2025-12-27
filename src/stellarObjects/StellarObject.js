import * as THREE from 'three';
import { OrbitalPath } from './OrbitalPath.js';

/************
 *  
************/
export class StellarObject extends THREE.Group {
    constructor(stellarData) {
        super();
        this.modifiers = [];

        const orbitCentroid = new THREE.Group();
        orbitCentroid.rotation.x = THREE.MathUtils.degToRad(stellarData.orbitalIncline.x);
        orbitCentroid.rotation.y = THREE.MathUtils.degToRad(stellarData.orbitalIncline.y);

        const objectAnchor = new THREE.Group();

        const orbitalSpeedInRadians = StellarObject.orbitalSpeedToRadiansPerSecond(stellarData.orbitalSpeed);
        orbitCentroid.rotation.y = THREE.MathUtils.degToRad(stellarData.orbitStart??0);
        objectAnchor.userData = {
            update: (deltaTime) => {
                orbitCentroid.rotation.y += (deltaTime * orbitalSpeedInRadians);
            }
        };
        objectAnchor.position.x = stellarData.orbitalRadius;
    

        orbitCentroid.add(objectAnchor);
        this.add(orbitCentroid);
        this.objectAnchor = objectAnchor;

        // optional orbit path
        if(stellarData.showOrbitalPath) {
            orbitCentroid.add(new OrbitalPath(stellarData.orbitalRadius, 0, 0.1));
        }
        
    }

    addStellarObject(obj) {
        this.objectAnchor.add(obj);
    }

    addModifier(modFunction) {
        this.modifiers.push(modFunction);
    }

    userData = {
        update : (deltaTime, sceneData) => {
            this.modifiers.forEach(m => m.update(deltaTime, {...sceneData, parentObj:this }));
        }
    };

    static orbitalSpeedToRadiansPerSecond(orbitalSpeed) {
        // Orbital speed is specified in units of 1.0 Scadrian Year (which is canonically the same as Earth)
        // the animated speed is therefor "2*pi / SY * orbitalSpeed" where SY is the seconds in one year.
        // This is computed in seconds because the deltaTime update tic is calculated as the 
        // fraction of a second since the last frame
        return 2*Math.PI / 31556926 * orbitalSpeed;
    }
}
