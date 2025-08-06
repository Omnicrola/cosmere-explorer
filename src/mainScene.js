import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { createStarfield } from "./generators/createStarfield.js";
import { createStellarSystem } from "./generators/createStellarSystem.js";
import { rosharStellarSystem } from "./data/roshar-system-data.js";
import { updateInteractions } from "./interactions.js";
import { ui } from "./ui/ui-tools.js";
import { FontLoader } from 'jsm/loaders/FontLoader.js';


// Camera Setup //
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
// scene.overrideMaterial = wireMat;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// if this is set to an object, the camera will auto-track it until set to undefined/false
let cameraFollowTarget = undefined;
let worldPosition = new THREE.Vector3();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// load fonts for use in TextGeometry elsewhere
const loader = new FontLoader();
let fonts = {};


// preload scene
function preloadScene(callback) {
    // TODO : promises!
    loader.load( 'fonts/Roboto_Regular.json', (font1) => { fonts.roboto_regular = font1;});
    loader.load( 'fonts/Roboto_Bold.json', (font2) => { fonts.roboto_bold = font2;});    
}

// setup the initial scene
function initScene(data) {
    const { objs } = data;

    // build star system
    const stellarSystem = createStellarSystem(rosharStellarSystem);
    scene.add(stellarSystem);

    const starfield = createStarfield({ numStars: 500, size: 0.35 });
    scene.add(starfield);

    const dirLight = new THREE.DirectionalLight(0x0099ff, 1);
    const starLight = new THREE.PointLight(0xffffff, 1);
    starLight.position.set(0, 12, 0);
    scene.add(starLight);

    ui.setSystemName(rosharStellarSystem.name);
    ui.createPlanetList(rosharStellarSystem.planets);

    camera.position.set(0, 10, 50);

    // main render loop
    function animate(t = 0) {
        const time = t * 0.0002;
        requestAnimationFrame(animate);
        stellarSystem.userData.update(time);

        raycaster.setFromCamera(pointer, camera);
        updateInteractions(raycaster, scene);

        // follow a target planet if a target is active
        if(cameraFollowTarget) {
            cameraFollowTarget.getWorldPosition(worldPosition);
            controls.target = worldPosition;
        }

        renderer.render(scene, camera);
        controls.update();
    }

    animate();
}

function focusOnPlanet(planetIndex) {
    let planet = scene.getObjectByName('planet'+planetIndex);

    let aabb = new THREE.Box3().setFromObject( planet );
    let center = aabb.getCenter( new THREE.Vector3() );
    let size = aabb.getSize( new THREE.Vector3() );

    gsap.to(camera.position, {
        duration : 1,
        x: center.x,
        y: center.y,
        z: center.z + size.z,
        onUpdate: () => { camera.lookAt(center); },
        onComplete: () => { 
            controls.target = center;
            controls.autoRotate = true;
            cameraFollowTarget = planet;
        }
    });
}

export { 
    initScene, 
    preloadScene,
    scene, 
    camera, 
    controls,
    renderer, 
    pointer, 
    focusOnPlanet,
    fonts
}