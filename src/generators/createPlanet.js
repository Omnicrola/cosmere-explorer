import * as THREE from 'three';
import { getFresnelMat } from '../getFresnelMat.js';
import { createRing } from '../getElipticLines.js';
import { fonts } from '../ui/ui-tools.js';
import { TextGeometry } from 'jsm/geometries/TextGeometry.js';

// reusable constants
const texLoader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 6);

// create 3d planet text
function createPlanetText(planetData, parentPlanet) {
  const textMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0xffaaff });

  fonts.RobotoRegular.then((font) => {
    let geo = new TextGeometry(planetData.name, {
      font: font,
      size: 0.5,
      depth: 0.1
    } );
    let planetText = new THREE.Mesh(geo, textMat);
    let aabb = new THREE.Box3().setFromObject(planetText);
    let size = aabb.getSize(new THREE.Vector3());
    planetText.position.x = size.x / -2;
    planetText.position.y = 1.2;
    
    let centerOffset = new THREE.Object3D();
    centerOffset.add(planetText);

    centerOffset.userData.update = (t, {camera}) => {
      centerOffset.lookAt(camera.position);
    }

    parentPlanet.add(centerOffset);
  })
}

// make a material for a planet
function createPlanetMaterial(planetData) {
  if(planetData.textureMap){
    const path = `./textures/${planetData.textureMap}`;
    const map = texLoader.load(path);
    return new THREE.MeshStandardMaterial({map});
  } else {
    return new THREE.MeshStandardMaterial({color: planetData.planetColor});
  }
}

function createPlanet(planetData, index, children = []) {
    const orbitGroup = new THREE.Group();
    orbitGroup.userData.stats = planetData;

    const planet = new THREE.Mesh(geo, createPlanetMaterial(planetData));
    planet.name = 'planet' + index; // need this to find and focus the camera later
    planet.scale.setScalar(planetData.planetRadius);
    planet.position.x =  planetData.orbitalRadius;
    
    createPlanetText(planetData, planet, orbitGroup);

    // TODO: moons
    // children.forEach((child) => {
    //   child.position.x = Math.cos(startAngle) * p.orbitalRadius;
    //   child.position.z = Math.sin(startAngle) * p.orbitalRadius;
    //   orbitGroup.add(child);
    // });

    // orbital grouping
    orbitGroup.userData.update = (t) => {
      orbitGroup.rotation.y = t * planetData.orbitalSpeed / 100 + planetData.orbitalStart;
      children.forEach((child) => {
        child.userData.update?.(t);
      });
    };
    orbitGroup.add(planet);
    orbitGroup.add(createRing(planetData.orbitalRadius));
    // orbitGroup.add(createLabel(planetName, p.orbitalRadius))
    
    return orbitGroup;
  }

  export {createPlanet};