import * as THREE from 'three';
import { FontLoader } from 'jsm/loaders/FontLoader.js';
import { OBJLoader } from "jsm/loaders/OBJLoader.js";

// fonts for use in mesh geometry
const fontLoader = new FontLoader();

function fontPromise(path) {
    return new Promise((resolve, reject) => {
        fontLoader.load(path, resolve);
    });
}

const fonts = {
    RobotoRegular : fontPromise('resources/fonts/Roboto_Regular.json'),
    RobotoBold : fontPromise('resources/fonts/Roboto_Bold.json'),
}

// meshes for asteroids
const objLoader = new OBJLoader();
const meshFiles = ['Rock1', 'Rock2', 'Rock3'];
function meshPromise(path) {
    return new Promise((resolve, reject) => {
        objLoader.load(path, (obj) => {
            resolve(obj.children[0]);
        });
    });
}

const asteroidMeshes = meshFiles.map((fileName) => meshPromise('resources/meshes/'+fileName+'.obj'));


export { fonts, asteroidMeshes };