import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { OBJLoader } from "jsm/loaders/OBJLoader.js";
// import {createStar} from "./src/generators/createStar.js";
import getNebula from "./src/getNebula.js";
import { createStarfield } from "./src/generators/createStarfield.js";
// import {createPlanet} from "./src/generators/createPlanet.js";
// import getAsteroidBelt from "./src/getAsteroidBelt.js";
import getElipticLines from "./src/getElipticLines.js";
import { createStellarSystem } from "./src/generators/createStellarSystem.js";
import { rosharStellarSystem } from "./src/data/roshar-system-data.js";
import { updateInteractions } from "./src/interactions.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 5000);
camera.position.set(0, 10, 50);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true});
// scene.overrideMaterial = wireMat;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
const useAnimatedCamera = false;

//////////////////////////////
function initScene(data) {
  const { objs } = data;

  const stellarSystem = createStellarSystem(rosharStellarSystem);
  scene.add(stellarSystem);

  /////////////////////////

  const starfield = createStarfield({ numStars: 500, size: 0.35 });
  scene.add(starfield);

  const starLight = new THREE.PointLight(0xffffff, 1);
  const dirLight = new THREE.DirectionalLight(0x0099ff, 1);
  starLight.position.set(0, 12, 0);
  scene.add(starLight);

  const cameraDistance = 50;
  function animate(t = 0) {
    const time = t * 0.0002;
    requestAnimationFrame(animate);
    stellarSystem.userData.update(time);
    
    raycaster.setFromCamera(pointer, camera);
    updateInteractions(raycaster, scene);
    
    renderer.render(scene, camera);
    controls.update();
  }

  animate();
}
/////////////////
const sceneData = {
  objs: [],
};
const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);
const loader = new OBJLoader(manager);
const objs = ['Rock1', 'Rock2', 'Rock3'];
objs.forEach((name) => {
  let path = `./rocks/${name}.obj`;
  loader.load(path, (obj) => {
    obj.traverse((child) => {
      if (child.isMesh) {
        sceneData.objs.push(child);
      }
    });
  });
});
////////////////

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onMouseDown() {

}
function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
window.addEventListener('resize', handleWindowResize, false);
window.addEventListener('mousedown', onPointerMove, false);
window.addEventListener( 'pointermove', onPointerMove );