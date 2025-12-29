import * as THREE from "three";
import { scene, orbitControls, camera, resetCameraTravel } from "../mainScene.js";
import { ui } from "./userInterface.js";
import { userSettings } from "../data/userSettings.js";

let hoverTargets = [];

// general click handling
function handleUserClicked(event) {
    hoverTargets.forEach((obj) => {
        if(obj.userData.isSelectable) {
            focusOnStellarObject({selectedId: obj.name});
        }
    });
}
window.addEventListener('click', handleUserClicked);

// cursor hovering over 3d objects
function updateInteractions(raycaster, scene) {
    const intersects = raycaster.intersectObjects( scene.children );

    hoverTargets.forEach((obj) =>{
        obj.userData.isHovered = false;
    });
    hoverTargets = [];

	for ( let i = 0; i < intersects.length; i ++ ) {
        intersects[i].object.userData.isHovered = true;
        hoverTargets.push(intersects[i].object);
	}
}

function stopFollowingStellarObject() {
    orbitControls.autoRotate = false;
    camera.cameraFollowTarget.userData.isSelected = false;
    camera.cameraFollowTarget = null;

    const backward = new THREE.Vector3();
    camera.getWorldDirection(backward).multiplyScalar(-5);
    backward.add(camera.position);
        
    gsap.to(camera.position, {
        duration : 1,
        x: backward.x,
        y: backward.y,
        z: backward.z,
        ease: 'expo.out',
    });
}

function focusOnStellarObject({selectedId, stellarObj}) {
    if(stellarObj) {
        selectedId = stellarObj.name;
    } else {
        stellarObj = scene.getObjectByName(selectedId);
    }

    // prevent re-clicking on the same planet (like when dragging the camera)
    if(camera.cameraFollowTarget === stellarObj) {
        return;
    }

    if(camera.cameraFollowTarget) {
        resetCameraTravel(camera.cameraFollowTarget.position);
    } else {
        const lookDirection = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(50).add(camera.position);
        resetCameraTravel(lookDirection);
    }
    userSettings.currentSelection = selectedId;
    camera.cameraFollowTarget = stellarObj;

    let planetSelect = document.getElementById('planet-select');
    planetSelect.value = selectedId;

    let aabb = new THREE.Box3().setFromObject( stellarObj );
    let center = aabb.getCenter( new THREE.Vector3() );
    let size = aabb.getSize( new THREE.Vector3() );

    let viewingPosition = new THREE.Vector3()
            .copy(camera.position)
            .sub(center)
            .setY(0)
            .normalize()
            .multiplyScalar(Math.max(size.z*2, 2))
            .setY(size.y/2)
            .add(center);

    ui.showInfoPanel(stellarObj);
    stellarObj.userData.isSelected = true;

    gsap.to(camera.position, {
        delay: 0.5,
        duration : 1,
        x: viewingPosition.x,
        y: viewingPosition.y,
        z: viewingPosition.z,
        ease: 'expo.out',
        onUpdate: () => { 
        },
        onComplete: () => { 
            stellarObj.userData.isSelected = true;
        }
    });
}


export { 
    updateInteractions, 
    focusOnStellarObject, 
    stopFollowingStellarObject,
};