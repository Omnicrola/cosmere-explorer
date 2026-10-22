import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'jsm/postprocessing/OutputPass.js';
import { createStellarSystem } from "./generators/createStellarSystem.js";
import { sceneContext } from "./core/sceneContext.js";
import { updateCamera } from "./core/cameraFollow.js";
import { startWarpIn } from "./core/warpIn.js";
import { attachPointerHandlers, focusOnStellarObject, setSelectableObjects } from "./ui/interactions.js";
import { collectSelectableObjects } from "./ui/selection.js";
import { ui } from "./ui/userInterface.js";
import { allStellarSystems, findSystemById } from "./data/all-systems.js";
import { isValidId, userSettings, restoreSettingsIntoUrl } from "./data/userSettings.js";
import { restoreFromUrl } from "./core/historyNavigation.js";
import { createMixPass, collectTransmissionMeshes, setBloomVisibility } from "./rendering/RenderTools.js";
import { disposeObject3D } from "./rendering/dispose.js";

const zero = new THREE.Vector3();

// rendering at very high device pixel ratios costs far more than it looks better
const MAX_PIXEL_RATIO = 2;

let scene, camera, renderer, orbitControls;
let finalComposer, bloomComposer, clock;
let transmissionMeshes = [];
let cancelWarpIn = null;
let loadedSystem = null;

const params = {
    threshold: 0.85,
    strength: 0.25,
    radius: 0.5,
};


/// Init
function init() {
    const container = document.getElementById('render-container');

    clock = new THREE.Clock();
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( - 5, 2.5, - 3.5 );
    scene.add( camera );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO) );
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

    orbitControls = new OrbitControls( camera, renderer.domElement );
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;

    Object.assign(sceneContext, { scene, camera, orbitControls, renderer });

    attachPointerHandlers(renderer.domElement);
    window.addEventListener('resize', onWindowResize);

    // the URL is the source of truth from here on: fill it in from the last visit,
    // and make sure it names the system actually being shown
    restoreSettingsIntoUrl();
    const currentSystem = findSystemById(userSettings.currentSystem) ?? allStellarSystems[0];
    userSettings.currentSystem = currentSystem.id;

    ui.init({ onSystemSelected: resetScene });
    resetScene(currentSystem);

    window.addEventListener('popstate', () => {
        restoreFromUrl({ currentSystem: loadedSystem, loadSystem: resetScene });
    });
}

// main render loop
function animate() {

    const delta = clock.getDelta();

    scene.traverse(objectUpdate(delta, clock));

    // camera
    updateCamera(delta);

    // render the scene, but hide meshes with transmission during the bloom pass
    setBloomVisibility(transmissionMeshes, false);
    bloomComposer.render();
    setBloomVisibility(transmissionMeshes, true);
    finalComposer.render();
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // the composers (and their bloom pass) keep their own render targets
    bloomComposer.setSize(width, height);
    finalComposer.setSize(width, height);

    // fat lines (orbital paths) compute their width from the viewport resolution
    scene.traverse((obj) => {
        if(obj.material?.isLineMaterial) {
            obj.material.resolution.set(width, height);
        }
    });
}

// allows individual scene objects to run an update function
function objectUpdate(delta, clock) {
    return (obj) => {
        if(obj.userData.update) {
            obj.userData.update(delta, {clock, camera});
        }
    }
}

// stop any animation or delayed focus left over from the previous system
function cancelPendingTransitions() {
    cancelWarpIn?.();
    cancelWarpIn = null;
    gsap.killTweensOf(camera.position);
}

function resetScene(stellarSystem) {
    loadedSystem = stellarSystem;

    cancelPendingTransitions();

    // remove everything, freeing the GPU memory held by the previous system
    disposeObject3D(scene);
    scene.background = null;
    scene.clear();
    scene.add(camera);

    // add standard lights back
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // load the new star system
    const { group: newSystemGraph, skybox } = createStellarSystem(stellarSystem);
    scene.add(newSystemGraph);
    scene.background = skybox;

    setSelectableObjects(collectSelectableObjects(newSystemGraph));
    transmissionMeshes = collectTransmissionMeshes(newSystemGraph);

    // user interface
    ui.resetUi();
    ui.setCurrentSystem(stellarSystem);
    ui.updateScannerList(stellarSystem.stellarObjects);

    // reset camera
    camera.cameraFollowTarget = null;
    camera.position.set(0, 9000, 100);
    orbitControls.autoRotate = false;
    orbitControls.target.copy(zero);
    camera.lookAt(zero);

    // zoom in all dramatic-like, then go to the remembered planet (if any)
    const currentSelection = userSettings.currentSelection;
    cancelWarpIn = startWarpIn({
        scene,
        camera,
        systemGraph: newSystemGraph,
        onArrive: isValidId(currentSelection)
            ? () => {
                // unless the user already picked something else during the warp
                if(!camera.cameraFollowTarget) {
                    focusOnStellarObject({ selectedId: currentSelection });
                }
            }
            : null,
    });
}

export { init };
