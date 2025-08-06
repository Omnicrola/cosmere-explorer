import * as THREE from "three";
import { OBJLoader } from "jsm/loaders/OBJLoader.js";
import { initScene, preloadScene, camera, pointer, renderer } from "./src/mainScene.js";

//////// attach scene data /////////
const sceneData = {
  objs: [],
};

const manager = new THREE.LoadingManager();
manager.onLoad = () => {
    initScene(sceneData);
};

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

// window resize
window.addEventListener('resize', () => { 
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// mouse down
window.addEventListener('mousedown', () => {

});

// mouse move
window.addEventListener('pointermove', (event) => {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

});