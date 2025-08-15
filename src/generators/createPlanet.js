import * as THREE from 'three';
import { fonts } from '../data/fileResources.js';
import { TextGeometry } from 'jsm/geometries/TextGeometry.js';
import { createPlanetMaterial, createAtmosphericShader, createFresnelMaterial } from '../../resources/materials.js';
import { createMoon } from './createMoon.js';
import { createOrbitalRing, createPlanetaryRings } from './createRings.js';

// reusable constants
const basic_1U_sphere = new THREE.IcosahedronGeometry(1, 6);

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

function createPlanet(planetData, planetIndex) {
    const orbitGroup = new THREE.Group();
    orbitGroup.userData.stats = planetData;

    const planet = new THREE.Mesh(basic_1U_sphere, createPlanetMaterial(planetData));
    planet.name = 'planet-' + planetIndex; // need this to find and focus the camera later
    planet.userData.info = planetData;
    planet.userData.isSelectable = true;
    planet.scale.setScalar(planetData.planetRadius);
    planet.rotation.y = Math.random() * 360;
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

    // orbital grouping
    const planetAnchor = new THREE.Group();
    planetAnchor.position.x =  planetData.orbitalRadius;
    planetAnchor.add(planet);

    let moonMeshes = [];
    planetData.moons.forEach((moonData, moonIndex) => {
      let moonOffset = new THREE.Group();
      let moon = createMoon(moonData, moonIndex, planetIndex);
      moonMeshes.push(moon);

      moonOffset.rotation.y = Math.random() * 360;
      moonOffset.add(moon);
      moonOffset.userData.update = (deltaTime) => {
        moonOffset.rotation.y += deltaTime * moonData.orbitalSpeed / 100;
      };
      planetAnchor.add(moonOffset);
    });


    orbitGroup.add(planetAnchor);
    const orbitalRingMesh = createOrbitalRing(planetData.orbitalRadius, 0, 0.1);
    orbitGroup.add(orbitalRingMesh);
    orbitGroup.rotation.y = Math.random() * 360;

    // allow the orbital ring to be toggled on and off
    let _showOrbitalRing = true;
    let _showMoonOrbitals = false;
    orbitGroup.userData = {
      update:(deltaTime) => {
        orbitGroup.rotation.y += deltaTime * planetData.orbitalSpeed / 10000;
      },
      get showOrbitalRing() { return _showOrbitalRing; },
      set showOrbitalRing(val) { 
        _showOrbitalRing = val;
        orbitalRingMesh.visible = val;
      },
      get showMoonOrbitals() { return _showMoonOrbitals; },
      set showMoonOrbitals(val) {
        _showMoonOrbitals = val;
        moonMeshes.forEach((m) => {
          m.showOrbitalRing = val;
        });
      }
    };

    
    const orbitOffset = new THREE.Group();
    orbitOffset.rotation.x = THREE.MathUtils.degToRad(planetData.orbitalIncline.x);
    orbitOffset.rotation.y = THREE.MathUtils.degToRad(planetData.orbitalIncline.y);
    orbitOffset.add(orbitGroup);

    return orbitOffset;
}



  export {createPlanet};