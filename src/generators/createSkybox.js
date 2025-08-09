import * as THREE from 'three';


// REFERENCE
// px = left
// nx = right
// py = top
// ny = bottom
// pz = back
// nz = front


function createSkybox(filePrefix) {
    const path = './resources/textures/' + filePrefix;
    const format = '.png';
    const urls = [
        path + '_px' + format, path + '_nx' + format,
        path + '_py' + format, path + '_ny' + format,
        path + '_pz' + format, path + '_nz' + format
    ];

    return new THREE.CubeTextureLoader().load(urls);

}


export { createSkybox };