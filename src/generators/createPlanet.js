import * as THREE from 'three';
import { getFresnelMat } from '../getFresnelMat.js';
import { createRing } from '../getElipticLines.js';

const TEXT_MAT = new THREE.MeshLambertMaterial({color:0xffffff, flatShading:true });

function createLabel(planetName) {
}

const texLoader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 6);
function createPlanet(p, children = []) {
    const orbitGroup = new THREE.Group();
    orbitGroup.userData.stats = p;

    // const path = `./textures/${img}`;
    // const map = texLoader.load(path);
    // const planetMat = new THREE.MeshStandardMaterial({
    //   map,
    // });
    const planetMat = new THREE.MeshStandardMaterial({
        emissive: p.planetColor,
    });
    const planet = new THREE.Mesh(geo, planetMat);
    planet.scale.setScalar(p.planetRadius);

    planet.position.x =  p.orbitalRadius;
    
    const planetRimMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0x000000 });
    const planetRimMesh = new THREE.Mesh(geo, planetRimMat);
    planetRimMesh.scale.setScalar(1.01);
    planet.add(planetRimMesh);

    // children.forEach((child) => {
    //   child.position.x = Math.cos(startAngle) * p.orbitalRadius;
    //   child.position.z = Math.sin(startAngle) * p.orbitalRadius;
    //   orbitGroup.add(child);
    // });

    // orbital grouping
    orbitGroup.userData.update = (t) => {
      orbitGroup.rotation.y = t * p.orbitalSpeed / 10 + p.orbitalStart;
      children.forEach((child) => {
        child.userData.update?.(t);
      });
    };
    orbitGroup.add(planet);
    orbitGroup.add(createRing(p.orbitalRadius));
    // orbitGroup.add(createLabel(planetName, p.orbitalRadius))
    
    return orbitGroup;
  }

  export {createPlanet};