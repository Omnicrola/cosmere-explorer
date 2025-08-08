import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { createStarfield } from "./generators/createStarfield.js";
import { createStellarSystem } from "./generators/createStellarSystem.js";
import { updateInteractions } from "./ui/interactions.js";
import { ui } from "./ui/userInterface.js";


// Camera Setup //
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
// scene.overrideMaterial = wireMat;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// if this is set to an object, the camera will auto-track it until set to undefined/false
camera.cameraFollowTarget = null;
let worldPosition = new THREE.Vector3();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// setup the initial scene
function initScene(data) {
    const { objs } = data;

    // main render loop
    function animate(t = 0) {
        const time = t * 0.0002;
        requestAnimationFrame(animate);
        scene.traverse((obj) => {
            if(obj.userData.update) {
                obj.userData.update(time, {camera});
            }
        })

        raycaster.setFromCamera(pointer, camera);
        updateInteractions(raycaster, scene);

        // follow a target planet if a target is active
        if(camera.cameraFollowTarget) {
            camera.cameraFollowTarget.getWorldPosition(worldPosition);
            controls.target = worldPosition;
        }

        renderer.render(scene, camera);
        controls.update();
    }

    animate();
}

function resetScene(stellarSystem) {

    // remove everything
    scene.clear();

    // add standard lights back
    const starLight = new THREE.PointLight(0xffffff, 10, 0, 0.2);
    starLight.position.set(0,0,0);
    scene.add(starLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // load the new system
    let newSystemGraph = createStellarSystem(stellarSystem);

    ui.resetUi();

    // reset camera 
    let zero = new THREE.Vector3();
    camera.cameraFollowTarget = null;
    camera.position.set(0, 9000, 100);
    controls.autoRotate = false;
    camera.lookAt(zero);

    // zoom in all dramatic-like
    let aabb = new THREE.Box3().setFromObject(newSystemGraph);
    let bounds = aabb.getSize(new THREE.Vector3());
    gsap.to(camera.position, {
        duration : 3,
        x: 0,
        y: bounds.x / 6,
        z: bounds.x / 4,
        ease: 'power4.out',
        onUpdate: () => { 
            camera.lookAt(zero); 
        },
        onComplete: () => { 
        }
    });

}

export { 
    initScene, 
    resetScene,
    scene, 
    camera, 
    controls,
    renderer, 
    pointer, 
}