import { OBJLoader } from "jsm/loaders/OBJLoader.js";

// meshes for asteroids, loaded on first use and then shared by every asteroid belt
const meshFiles = ['Rock1', 'Rock2', 'Rock3'];
let asteroidMeshPromises = null;

function meshPromise(loader, path) {
    return new Promise((resolve, reject) => {
        loader.load(path, (obj) => resolve(obj.children[0]), undefined, reject);
    });
}

function loadAsteroidMeshes() {
    if(!asteroidMeshPromises) {
        const objLoader = new OBJLoader();
        asteroidMeshPromises = meshFiles.map((fileName) => meshPromise(objLoader, 'resources/meshes/'+fileName+'.obj'));
    }
    return asteroidMeshPromises;
}

export { loadAsteroidMeshes };
