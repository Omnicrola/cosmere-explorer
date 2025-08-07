import * as THREE from "three";
import { scene, controls, camera } from "./mainScene.js";
import { ui } from "./ui/ui-tools.js";

function updateInteractions(raycaster, scene) {
    const intersects = raycaster.intersectObjects( scene.children );

    var userData;
	for ( let i = 0; i < intersects.length; i ++ ) {
        userData = intersects[i].object.userData;
        userData.hoverState = true;
	}
}

function focusOnPlanet(planetIndex) {
    let planet = scene.getObjectByName('planet' + planetIndex);

    let aabb = new THREE.Box3().setFromObject( planet );
    let center = aabb.getCenter( new THREE.Vector3() );
    let size = aabb.getSize( new THREE.Vector3() );

    ui.showPlanetInfo(planet);

    gsap.to(camera.position, {
        duration : 1,
        x: center.x,
        y: center.y,
        z: center.z + (size.z *2),
        ease: 'expo.out',
        onUpdate: () => { 
            // continuously update the centerpoint to focus on, since the 
            // planet is actively traveling through it's orbit
            camera.lookAt(aabb.setFromObject(planet).getCenter(center)); 
        },
        onComplete: () => { 
            controls.target = center;
            controls.autoRotate = true;
            camera.cameraFollowTarget = planet;
        }
    });
}

export { updateInteractions, focusOnPlanet };