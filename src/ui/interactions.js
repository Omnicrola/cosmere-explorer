import * as THREE from "three";
import { sceneContext } from "../core/sceneContext.js";
import { resetCameraTravel } from "../core/cameraFollow.js";
import { userSettings, isValidId } from "../data/userSettings.js";
import { showInfoPanel } from "./infoPanels.js";
import { setElementHidden } from "./dom.js";
import { findNearestSelectable, isClickGesture, toNormalizedDeviceCoords } from "./selection.js";

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
let pointerDownAt = null;
let selectableObjects = [];

// the objects that clicks can select; replaced whenever a new stellar system is loaded
function setSelectableObjects(objects) {
    selectableObjects = objects;
}

// Click-to-select on the 3D canvas. Listening on the canvas (not window) means clicks on
// UI panels never select whatever happens to be behind them, and comparing the
// pointerdown/pointerup positions ignores the end of a camera drag.
function attachPointerHandlers(canvas) {
    canvas.addEventListener('pointerdown', (event) => {
        pointerDownAt = { x: event.clientX, y: event.clientY };
    });
    canvas.addEventListener('pointerup', (event) => {
        const up = { x: event.clientX, y: event.clientY };
        if(isClickGesture(pointerDownAt, up)) {
            handleCanvasClick(event, canvas);
        }
        pointerDownAt = null;
    });
}

function handleCanvasClick(event, canvas) {
    const selected = pickObjectAt(event.clientX, event.clientY, canvas.getBoundingClientRect());
    if(selected) {
        focusOnStellarObject({ stellarObj: selected });
    }
}

// returns the nearest selectable object under a client-space point, or null
function pickObjectAt(clientX, clientY, rect) {
    toNormalizedDeviceCoords(clientX, clientY, rect, pointerNdc);
    raycaster.setFromCamera(pointerNdc, sceneContext.camera);
    const intersects = raycaster.intersectObjects(selectableObjects, true);
    return findNearestSelectable(intersects);
}

function stopFollowingStellarObject() {
    const { camera, orbitControls } = sceneContext;
    orbitControls.autoRotate = false;
    if(!camera.cameraFollowTarget) {
        return;
    }
    camera.cameraFollowTarget = null;

    // ease the camera back a little so the user can see they've let go of the object
    const backward = new THREE.Vector3();
    camera.getWorldDirection(backward).multiplyScalar(-5);
    backward.add(camera.position);

    gsap.to(camera.position, {
        duration : 1,
        x: backward.x,
        y: backward.y,
        z: backward.z,
        ease: 'expo.out',
        overwrite: 'auto', // cancel any other in-flight camera move (e.g. the warp-in)
    });
}

// clears the remembered selection and resets the planet drop-down
function clearSelection() {
    userSettings.currentSelection = null;
    const planetSelect = document.getElementById('planet-select');
    if(planetSelect) {
        planetSelect.value = '-1';
    }
}

// stop following, forget the selection and hide the info panel
function clearFocus() {
    stopFollowingStellarObject();
    clearSelection();
    setElementHidden('info-panel', true);
}

// Moves the camera to a stellar object, by object or by id.
// Returns false (and clears any stale selection) when the object doesn't exist in the scene.
function focusOnStellarObject({selectedId, stellarObj}) {
    const { scene, camera, orbitControls } = sceneContext;

    if(stellarObj) {
        selectedId = stellarObj.name;
    } else if(isValidId(selectedId)) {
        stellarObj = scene.getObjectByName(selectedId);
    }

    if(!stellarObj) {
        clearSelection();
        return false;
    }

    // prevent re-clicking on the same planet
    if(camera.cameraFollowTarget === stellarObj) {
        return true;
    }

    // start the travel from wherever the camera is currently looking
    resetCameraTravel(orbitControls.target);
    userSettings.currentSelection = selectedId;
    camera.cameraFollowTarget = stellarObj;

    const planetSelect = document.getElementById('planet-select');
    planetSelect.value = selectedId;

    const aabb = new THREE.Box3().setFromObject( stellarObj );
    const center = aabb.getCenter( new THREE.Vector3() );
    const size = aabb.getSize( new THREE.Vector3() );

    const viewingPosition = new THREE.Vector3()
            .copy(camera.position)
            .sub(center)
            .setY(0)
            .normalize()
            .multiplyScalar(Math.max(size.z*2, 2))
            .setY(size.y/2)
            .add(center);

    showInfoPanel(stellarObj);

    gsap.to(camera.position, {
        delay: 0.5,
        duration : 1,
        x: viewingPosition.x,
        y: viewingPosition.y,
        z: viewingPosition.z,
        ease: 'expo.out',
        overwrite: 'auto', // cancel any other in-flight camera move (e.g. the warp-in)
    });
    return true;
}


export {
    attachPointerHandlers,
    setSelectableObjects,
    pickObjectAt,
    focusOnStellarObject,
    stopFollowingStellarObject,
    clearSelection,
    clearFocus,
};
