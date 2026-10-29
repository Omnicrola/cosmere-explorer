import * as THREE from "three";
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'jsm/postprocessing/OutputPass.js';
import { createStellarSystem } from "./generators/createStellarSystem.js";
import { sceneContext } from "./core/sceneContext.js";
import { createCameraControls, updateCamera, jumpTo, flyToOverview, setCameraObstacles } from "./core/cameraRig.js";
import { startWarpIn } from "./core/warpIn.js";
import { createUpdateList } from "./core/updateList.js";
import { attachPointerHandlers, focusOnStellarObject, setSelectableObjects } from "./ui/interactions.js";
import { collectSelectableObjects } from "./ui/selection.js";
import { ui } from "./ui/userInterface.js";
import { allStellarSystems, findSystemById } from "./data/all-systems.js";
import { isValidId, userSettings, restoreSettingsIntoUrl } from "./data/userSettings.js";
import { restoreFromUrl } from "./core/historyNavigation.js";
import { createMixPass, collectTransmissionMeshes, setBloomVisibility } from "./rendering/RenderTools.js";
import { disposeObject3D } from "./rendering/dispose.js";
import { STELLAR_OBJECT } from "./data/stellarData.js";

const zero = new THREE.Vector3();
const WARP_START_POSITION = new THREE.Vector3(0, 9000, 100);

// rendering at very high device pixel ratios costs far more than it looks better
const MAX_PIXEL_RATIO = 2;

let scene, camera, renderer, cameraControls;
let finalComposer, bloomComposer, clock;
let transmissionMeshes = [];
let cancelWarpIn = null;
const updateList = createUpdateList();
const frameContext = { clock: null, camera: null }; // reused every frame
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

    cameraControls = createCameraControls( camera, renderer.domElement );

    Object.assign(sceneContext, { scene, camera, cameraControls, renderer });

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

    // let scene objects run their per-frame update (orbits, spin, modifiers, asteroids)
    frameContext.clock = clock;
    frameContext.camera = camera;
    for(const obj of updateList.get(scene)) {
        obj.userData.update(delta, frameContext);
    }

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

// stars, planets and moons: things the camera should fly around rather than through
// (rings and cognitive anomalies span large, mostly empty regions)
const SOLID_BODY_TYPES = [STELLAR_OBJECT.STAR, STELLAR_OBJECT.PLANET, STELLAR_OBJECT.MOON];
function isSolidBody(obj) {
    return SOLID_BODY_TYPES.includes(obj.userData.info?.stellarObjectType);
}

// stop any animation or delayed focus left over from the previous system
function cancelPendingTransitions() {
    cancelWarpIn?.();
    cancelWarpIn = null;
}

function resetScene(stellarSystem) {
    loadedSystem = stellarSystem;

    cancelPendingTransitions();

    // remove everything, freeing the GPU memory held by the previous system
    disposeObject3D(scene);
    updateList.invalidate();
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

    const selectables = collectSelectableObjects(newSystemGraph);
    setSelectableObjects(selectables);
    setCameraObstacles(selectables.filter(isSolidBody));
    transmissionMeshes = collectTransmissionMeshes(newSystemGraph);

    // user interface
    ui.resetUi();
    ui.setCurrentSystem(stellarSystem);
    ui.updateScannerList(stellarSystem.stellarObjects);

    // start far above the star
    jumpTo(WARP_START_POSITION, zero);

    // zoom in all dramatic-like, then go to the remembered planet (if any)
    const currentSelection = userSettings.currentSelection;
    cancelWarpIn = startWarpIn({
        scene,
        systemGraph: newSystemGraph,
        flyToOverview,
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
