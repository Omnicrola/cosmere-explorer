import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { createStarfield } from "./generators/createStarfield.js";
import { createStellarSystem } from "./generators/createStellarSystem.js";
import { updateInteractions } from "./ui/interactions.js";
import { ui } from "./ui/userInterface.js";
import Stats from 'jsm/libs/stats.module.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'jsm/postprocessing/OutputPass.js';
import { allStellarSystems } from "./data/all-systems.js";

const w = window.innerWidth;
const h = window.innerHeight;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let scene, camera, stats;
let composer, renderer, mixer, clock;
let controls;

const params = {
    threshold: 0.5,
    strength: 0.5,
    radius: 0.0,
    exposure: 1.0
};


/// Init
async function init() {
    const container = document.getElementById('render-container');

    clock = new THREE.Clock();
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( - 5, 2.5, - 3.5 );
    scene.add( camera );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild( renderer.domElement );

    //

    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const outputPass = new OutputPass();

    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    composer.addPass( outputPass );

    //

    stats = new Stats();
    container.appendChild( stats.dom );

    //

    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    // 

    resetScene(allStellarSystems[0]);
    ui.init();

}

// main render loop
const worldPosition = new THREE.Vector3();
function animate() {
    
    const delta = clock.getDelta();
    
    scene.traverse(objectUpdate(delta, clock));
    raycaster.setFromCamera(pointer, camera);
    updateInteractions(raycaster, scene);

    if(camera.cameraFollowTarget) {
        camera.cameraFollowTarget.getWorldPosition(worldPosition);
        controls.target = worldPosition;
        controls.autoRotate = true;
    }

    stats.update();
    controls.update();
    composer.render();
}

function objectUpdate(delta, clock) {
    return (obj) => {
        if(obj.userData.update) {
            obj.userData.update(delta, {clock, camera});
        }
    }
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

    // load the new star system
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
    init, 
    resetScene,
    scene, 
    camera, 
    controls,
    renderer, 
    pointer, 
}