import * as THREE from 'three';
import { fonts } from '../data/fileResources.js';
import { TextGeometry } from 'jsm/geometries/TextGeometry.js';
import { createPlanetMaterial, createAtmosphericShader, createFresnelMaterial } from '../../resources/materials.js';
import { createMoon } from './createMoon.js';
import { createOrbitalRing, createPlanetaryRings } from './createRings.js';

// reusable constants
const basic_1U_sphere = new THREE.IcosahedronGeometry(1, 6);

function createPlanet(planetData) {
  const orbitOffset = new THREE.Group();
  orbitOffset.rotation.x = THREE.MathUtils.degToRad(planetData.orbitalIncline.x);
  orbitOffset.rotation.y = THREE.MathUtils.degToRad(planetData.orbitalIncline.y);

  const orbitGroup = new THREE.Group();
  orbitOffset.add(orbitGroup);

  const planetMaterial = createPlanetMaterial(planetData);
  const planet = new THREE.Mesh(basic_1U_sphere, planetMaterial);

  // create a unique ID that we can use to focus the camera on this later
  planet.name = planetData.id; 

  // allow the orbital ring to be toggled on and off
  let _showOrbitalRing = true;
  let _showMoonOrbitals = false;
  planet.userData = {
    info : planetData,
    isSelectable : true,
    get showOrbitalRing() { return _showOrbitalRing; },
    set showOrbitalRing(val) { 
      _showOrbitalRing = val;
      orbitalRingMesh.visible = val;
    },
    get isSelected() { return _showMoonOrbitals; },
    set isSelected(val) {
      _showMoonOrbitals = val;
      moonMeshes.forEach((m) => {
        m.userData.showOrbitalRing = val;
      });
    }
  };
  planet.scale.setScalar(planetData.planetRadius);
  planet.rotation.y = Math.random() * Math.PI * 2;

  // update rotation and atmospheric shading light direction
  planet.userData.update = (deltaTime) => {
    planet.rotation.y += deltaTime * planetData.spinRate / 100;
  }    

  const atmosphere = new THREE.Mesh(basic_1U_sphere, createAtmosphericShader(planetData));
  atmosphere.scale.setScalar(1.05);
  planet.add(atmosphere);

  if(planetData.rings.visible) {
    const rings = createPlanetaryRings(planetData.rings);
    planet.add(rings);
  }
  
  // 3d label text that follows the planet and always faces the camera
  createPlanetText(planetData, planet, orbitGroup);

  const planetAnchor = new THREE.Group();
  planetAnchor.position.x =  planetData.orbitalRadius;
  planetAnchor.add(planet);
  
  // moons!
  let moonMeshes = [];
  planetData.children.forEach((moonData) => {
    let moonOffset = new THREE.Group();
    let moon = createMoon(moonData);
    moonMeshes.push(moon);

    moonOffset.rotation.y = THREE.MathUtils.degToRad(moonData.orbitStart);
    moonOffset.add(moon);
    moonOffset.userData.update = (deltaTime) => {
      moonOffset.rotation.y += deltaTime * moonData.orbitalSpeed / 100;
    };
    planetAnchor.add(moonOffset);
  });


  orbitGroup.add(planetAnchor);
  const orbitalRingMesh = createOrbitalRing(planetData.orbitalRadius, 0, 0.1);
  orbitGroup.add(orbitalRingMesh);
  orbitGroup.rotation.y = THREE.MathUtils.degToRad(planetData.orbitStart);

  orbitOffset.userData = {
    update:(deltaTime) => {
      orbitGroup.rotation.y += deltaTime * planetData.orbitalSpeed / 10000;
    },
  };
  // start with moon orbits hidden
  orbitGroup.userData.showMoonOrbitals = false;

  return orbitOffset;
}


// create 3d planet text
function createPlanetText(planetData, parentPlanet) {
  const textMat = createFresnelMaterial({ rimHex: 0xffffff, facingHex: 0xaaaaff });

  fonts.RobotoRegular.then((font) => {
    let geo = new TextGeometry(planetData.name, {
      font: font,
      size: 0.5,
      depth: 0.1
    } );
    
    let planetText = new THREE.Mesh(geo, textMat);
    let aabb = new THREE.Box3().setFromObject(planetText);
    let size = aabb.getSize(new THREE.Vector3());

    // offset so the text always appears below and to the left
    planetText.position.x = (size.x * -1) -1 ;
    planetText.position.y = -1.0;
    planetText.scale.multiplyScalar(1 - planetData.planetRadius / 10);
    planetText.visible = false;

    // check if the text should currently be visible
    planetText.userData.update = (t) => {
      planetText.visible = parentPlanet.userData.isSelected?true:false || parentPlanet.userData.isHovered?true:false;
    }
        
    let centerOffset = new THREE.Object3D();
    centerOffset.add(planetText);

    // always rotate to face the camera
    centerOffset.userData.update = (t, {camera}) => {
      centerOffset.lookAt(camera.position);
    }

    parentPlanet.add(centerOffset);
  })
}


  export {createPlanet};