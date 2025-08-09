import * as THREE from "three";
import { scene, controls, camera } from "../mainScene.js";
import { ui } from "./userInterface.js";

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
    if(!planetObj) {
        planetObj = scene.getObjectByName('planet' + planetIndex);
    }

    let aabb = new THREE.Box3().setFromObject( planetObj );
    let center = aabb.getCenter( new THREE.Vector3() );
    let size = aabb.getSize( new THREE.Vector3() );

    ui.showPlanetInfo(planetObj);

    gsap.to(camera.position, {
        duration : 1,
        x: center.x,
        y: center.y,
        z: center.z + (size.z *2),
        ease: 'expo.out',
        onUpdate: () => { 
            // continuously update the centerpoint to focus on, since the 
            // planet is actively traveling through it's orbit
            camera.lookAt(aabb.setFromObject(planetObj).getCenter(center)); 
        },
        onComplete: () => { 
            controls.target = center;
            controls.autoRotate = true;
            camera.cameraFollowTarget = planetObj;
            planetObj.userData.isSelected = true;
        }
    });
}


export { updateInteractions, focusOnPlanet, stopFollowingPlanet };