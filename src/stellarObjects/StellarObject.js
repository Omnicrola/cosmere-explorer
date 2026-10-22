import * as THREE from 'three';
import { OrbitalPath } from './OrbitalPath.js';
import { MODIFIER_NAME } from '../data/stellarData.js';
import { AutoFaceStar } from './modifiers/AutoFaceStar.js';
import { Spinner } from './modifiers/Spinner.js';
import { createOrbitalPlane } from './orbitalPlane.js';

/************
 * Base class for every selectable body (stars, planets, moons, anomalies, rings).
 *
 *   node (ascending node) > plane (inclination) > orbitCentroid (spins to orbit)
 *     > objectAnchor (sits on the orbit; child bodies such as moons attach here)
 *       > body: the selectable object, named by id. Its orientation stays fixed in space
 *         as it orbits, so things attached to it (planetary rings) keep their direction.
 *         > tilt: leans the surface over by axialTilt
 *           > surface: the visible meshes, spinning at spinRate (degrees per second)
 *
 * Subclasses build their meshes and pass them to createBody().
************/
export class StellarObject extends THREE.Group {
    // stationary objects sit at their place on the orbit without moving along it
    constructor(stellarData, { stationary = false } = {}) {
        super();
        this.modifiers = [];
        this.stellarData = stellarData;
        this.body = null;

        const { node, plane } = createOrbitalPlane(stellarData.orbitalIncline);

        // spins within the (inclined) orbital plane, carrying the object around its orbit
        const orbitCentroid = new THREE.Group();
        orbitCentroid.rotation.y = THREE.MathUtils.degToRad(stellarData.orbitStart??0);

        const objectAnchor = new THREE.Group();

        const orbitalSpeedInRadians = stationary ? 0 : StellarObject.orbitalSpeedToRadiansPerSecond(stellarData.orbitalSpeed);
        objectAnchor.userData = {
            update: (deltaTime) => {
                orbitCentroid.rotation.y += (deltaTime * orbitalSpeedInRadians);
                this.holdBodyOrientation();
            }
        };
        objectAnchor.position.x = stellarData.orbitalRadius;


        orbitCentroid.add(objectAnchor);
        plane.add(orbitCentroid);
        this.add(node);
        this.orbitCentroid = orbitCentroid;
        this.objectAnchor = objectAnchor;

        // optional orbit path
        if(stellarData.showOrbitalPath) {
            orbitCentroid.add(new OrbitalPath(stellarData.orbitalRadius, 0, 0.1));
        }

        // modifiers
        stellarData.modifiers.forEach((modName) => {
            switch(modName) {
                case MODIFIER_NAME.AUTO_FACE:
                    this.addModifier(new AutoFaceStar());
                    break;
                default:
                    console.log('Error: unknown modifier name : ' + modName);
            }
        });

        // reused every frame, rather than allocating a new context object per frame
        this.modifierContext = { clock: null, camera: null, parentObj: this };
        this.userData = {
            update: (deltaTime, sceneData) => {
                this.modifierContext.clock = sceneData.clock;
                this.modifierContext.camera = sceneData.camera;
                for(const modifier of this.modifiers) {
                    modifier.update(deltaTime, this.modifierContext);
                }
            }
        };
    }

    // Creates the selectable body from the visible meshes, applying axialTilt and spinRate.
    // Attachments (e.g. planetary rings) follow the body but neither tilt nor spin.
    createBody(surfaceObjects, { attachments = [] } = {}) {
        const { id, axialTilt = 0, spinRate = 0 } = this.stellarData;

        const surface = new THREE.Group();
        surface.add(...surfaceObjects);

        const tilt = new THREE.Group();
        tilt.rotation.z = THREE.MathUtils.degToRad(axialTilt);
        tilt.add(surface);

        const body = new THREE.Group();
        body.name = id;
        body.userData = { isSelectable: true, info: this.stellarData };
        body.add(tilt, ...attachments);

        if(spinRate) {
            this.addModifier(new Spinner(spinRate, surface));
        }

        this.body = body;
        this.bodySurface = surface;
        this.holdBodyOrientation();
        this.addStellarObject(body);
        return body;
    }

    // undo the orbit's rotation, so the body's tilt points the same way all the way around
    holdBodyOrientation() {
        if(this.body) {
            this.body.rotation.y = -this.orbitCentroid.rotation.y;
        }
    }

    addStellarObject(obj) {
        this.objectAnchor.add(obj);
    }

    addModifier(modFunction) {
        this.modifiers.push(modFunction);
    }

    static orbitalSpeedToRadiansPerSecond(orbitalSpeed) {
        // Orbital speed is specified in units of 1.0 Scadrian Year (which is canonically the same as Earth)
        // the animated speed is therefor "2*pi / SY * orbitalSpeed" where SY is the seconds in one year.
        // This is computed in seconds because the deltaTime update tic is calculated as the
        // fraction of a second since the last frame
        return 2*Math.PI / 31556926 * orbitalSpeed;
    }
}
