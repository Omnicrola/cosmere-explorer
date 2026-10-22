import * as THREE from "three";
import { sceneContext } from "../core/sceneContext.js";
import { flyToObject, stopFollowing } from "../core/cameraRig.js";
import { userSettings, isValidId, recordNavigation } from "../data/userSettings.js";
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
    stopFollowing();
}

// clears the remembered selection and resets the planet drop-down
function clearSelection() {
    userSettings.currentSelection = null;
    const planetSelect = document.getElementById('planet-select');
    if(planetSelect) {
        planetSelect.value = '-1';
    }
}

// stop following, forget the selection and hide the info panel (a back-button step)
function clearFocus() {
    stopFollowingStellarObject();
    recordNavigation(clearSelection);
    setElementHidden('info-panel', true);
}

// Moves the camera to a stellar object, by object or by id.
// Returns false (and clears any stale selection) when the object doesn't exist in the scene.
function focusOnStellarObject({selectedId, stellarObj}) {
    const { scene, camera } = sceneContext;

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

    recordNavigation(() => { userSettings.currentSelection = selectedId; });

    const planetSelect = document.getElementById('planet-select');
    planetSelect.value = selectedId;

    showInfoPanel(stellarObj);
    flyToObject(stellarObj);
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
