import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { createStellarSystem } from "./generators/createStellarSystem.js";
import { focusOnStellarObject, updateInteractions } from "./ui/interactions.js";
import { ui } from "./ui/userInterface.js";
import Stats from 'jsm/libs/stats.module.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'jsm/postprocessing/OutputPass.js';
import { allStellarSystems } from "./data/all-systems.js";
import { userSettings } from "./data/userSettings.js";
import { createMixPass, enableTransmissonMeshes, disableTransmissionMeshes } from "./rendering/RenderTools.js";

const w = window.innerWidth;
const h = window.innerHeight;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const zero = new THREE.Vector3();

let scene, camera, stats;
let finalComposer, bloomComposer, renderer, mixer, clock;
let orbitControls;

const params = {
    threshold: 0.85,
    strength: 0.25,
    radius: 0.5,
    exposure: 1.0
};


/// Init
async function init() {
    const container = document.getElementById('render-container');

    clock = new THREE.Clock();
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );
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
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), params.strength, params.radius, params.threshold );
    
    bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);
    
    const mixPass = createMixPass(bloomComposer);
    const outputPass = new OutputPass();

    finalComposer = new EffectComposer( renderer );
    finalComposer.addPass( renderScene );
    finalComposer.addPass( mixPass );
    finalComposer.addPass( outputPass );

    //

    stats = new Stats();
    // container.appendChild( stats.dom );

    //

    orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.03;
    // 

    const currentSystem = allStellarSystems.find(s => s.key==userSettings.currentSystem) ?? allStellarSystems[0];
    resetScene(currentSystem);
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
        orbitControls.target = worldPosition;
        orbitControls.autoRotate = true;
    }

    stats.update();
    orbitControls.update();

    // render the scene, but disable meshes with transmission during the bloom pass
    scene.traverse(disableTransmissionMeshes);
    bloomComposer.render();
    scene.traverse(enableTransmissonMeshes);
    finalComposer.render();
}

// allows individual scene objects to run an update function
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // load the new star system
    let newSystemGraph = createStellarSystem(stellarSystem);

    ui.resetUi();

    // reset camera 
    camera.cameraFollowTarget = null;
    camera.position.set(0, 9000, 100);
    orbitControls.autoRotate = false;
    camera.lookAt(zero);

    // zoom in all dramatic-like
    warpIntoScene(newSystemGraph);
}

function warpIntoScene(newSystemGraph) {
    let aabb = new THREE.Box3().setFromObject(newSystemGraph);
    let bounds = aabb.getSize(new THREE.Vector3());

    scene.scale.multiplyScalar(0);
    // scale the entire scene up so it appears we are approaching from further away than we are
    gsap.to(scene.scale, {
        duration: 1.9,
        delay: 1,
        x: 1.0,
        y: 1.0,
        z: 1.0,
        ease: 'power4.out',
        onUpdate: () => {
        },
        onComplete: () => {

        }
    });

    // if there is a selection ID in local storage, go to that planet, 
    // otherwise zoom in on center
    if(userSettings.currentSelection) {
        let currentSelection = userSettings.currentSelection
        window.setTimeout(()=>{
            focusOnStellarObject({selectedId: currentSelection});
        }, 2000);
    } else {
        gsap.to(camera.position, {
            duration : 3,
            delay: 1,
            x: 0,
            y: bounds.x / 6,
            z: bounds.x / 4,
            ease: 'power4.out',
            onUpdate: () => { 
                camera.lookAt(zero); 
            },
            onComplete: () => { 
                ui.checkAutoNavigation();
            }
        });
    }

}

export { 
    init, 
    resetScene,
    scene, 
    camera, 
    orbitControls,
    renderer, 
    pointer, 
}