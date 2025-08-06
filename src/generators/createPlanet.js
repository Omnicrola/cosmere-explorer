import * as THREE from 'three';
import { getFresnelMat } from '../getFresnelMat.js';
import { createRing } from '../getElipticLines.js';
import { fonts } from '../mainScene.js';
import { TextGeometry } from 'jsm/geometries/TextGeometry.js';

function createPlanetText(planetName) {
  const textMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0xffaaff });

    let geo = new TextGeometry(planetName, {
		font: fonts.roboto_regular,
		size: 10,
		depth: .1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 4,
		bevelOffset: 0,
		bevelSegments: 5
	} );
  return new THREE.Mesh(geo, textMat);
}

const texLoader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 6);
function createPlanet(p, index, children = []) {
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
    planet.name = 'planet' + index; // need this to find and focus the camera later

    planet.scale.setScalar(p.planetRadius);

    planet.position.x =  p.orbitalRadius;
    
    const planetRimMat = getFresnelMat({ rimHex: 0xffffff, facingHex: 0x000000 });
    const planetRimMesh = new THREE.Mesh(geo, planetRimMat);
    planetRimMesh.scale.setScalar(1.01);
    planet.add(planetRimMesh);

    let planetText = createPlanetText(p.name);
    planetText.scale.multiplyScalar(0.2);
    planetText.position.y = p.planetRadius * 1.5;
    planetText.position.x = p.orbitalRadius;
    orbitGroup.add(planetText);

    // TODO: moons
    // children.forEach((child) => {
    //   child.position.x = Math.cos(startAngle) * p.orbitalRadius;
    //   child.position.z = Math.sin(startAngle) * p.orbitalRadius;
    //   orbitGroup.add(child);
    // });

    // orbital grouping
    orbitGroup.userData.update = (t) => {
      orbitGroup.rotation.y = t * p.orbitalSpeed / 100 + p.orbitalStart;
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