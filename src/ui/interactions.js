import * as THREE from "three";
import { scene, controls, camera } from "../mainScene.js";
import { ui } from "./userInterface.js";
import { userSettings } from "../data/userSettings.js";

let hoverTargets = [];

// general click handling
function handleUserClicked(event) {
    hoverTargets.forEach((obj) => {
        if(obj.userData.isSelectable) {
            focusOnPlanet({planetObj:obj});
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

    var userData;
	for ( let i = 0; i < intersects.length; i ++ ) {
        userData = intersects[i].object.userData;
        userData.isHovered = true;
        hoverTargets.push(intersects[i].object);
	}
}

function stopFollowingPlanet() {
    controls.autoRotate = false;
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

function focusOnPlanet({planetIndex, planetObj}) {
    if(planetObj) {
        planetIndex = planetObj.userData.info.planetIndex;
    } else {
        planetObj = scene.getObjectByName('planet-' + planetIndex);
    }
    userSettings.currentSelection = planetIndex;
    camera.cameraFollowTarget = planetObj;

    let planetSelect = document.getElementById('planet-select');
    planetSelect.value = planetIndex;

    let aabb = new THREE.Box3().setFromObject( planetObj );
    let center = aabb.getCenter( new THREE.Vector3() );
    let size = aabb.getSize( new THREE.Vector3() );

    ui.showPlanetInfo(planetObj);
    planetObj.userData.isSelected = true;

    gsap.to(camera.position, {
        duration : 1,
        x: center.x,
        y: center.y,
        z: center.z + (size.z *2),
        ease: 'expo.out',
        onUpdate: () => { 
        },
        onComplete: () => { 
            controls.target = center;
            controls.autoRotate = true;
            planetObj.userData.isSelected = true;
        }
    });
}


export { updateInteractions, focusOnPlanet, stopFollowingPlanet };