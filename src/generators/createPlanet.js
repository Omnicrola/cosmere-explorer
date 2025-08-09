import * as THREE from 'three';
import { fonts } from '../ui/userInterface.js';
import { TextGeometry } from 'jsm/geometries/TextGeometry.js';
import { LineMaterial } from "jsm/lines/LineMaterial.js";
import { Line2 } from "jsm/lines/Line2.js";
import { LineGeometry } from "jsm/lines/LineGeometry.js";
import { createPlanetMaterial, createAtmosphericShader, createFresnelMaterial } from '../../resources/materials.js';

// reusable constants
const geo = new THREE.IcosahedronGeometry(1, 6);
const w = window.innerWidth;
const h = window.innerHeight;

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
    planetText.position.x = size.x * -1.6 ;
    planetText.position.y = -1.0;
    
    let centerOffset = new THREE.Object3D();
    centerOffset.add(planetText);

    centerOffset.userData.update = (t, {camera}) => {
      centerOffset.lookAt(camera.position);
    }

    parentPlanet.add(centerOffset);
  })
}

function createPlanet(planetData, index, children = []) {
    const orbitGroup = new THREE.Group();
    orbitGroup.userData.stats = planetData;

    const planet = new THREE.Mesh(geo, createPlanetMaterial(planetData));
    planet.name = 'planet' + index; // need this to find and focus the camera later
    planet.userData.info = planetData;
    planet.scale.setScalar(planetData.planetRadius);
    planet.position.x =  planetData.orbitalRadius;

    // const atmosphere = new THREE.Mesh(geo, createFresnelMaterial({
    //   rimHex: 0x9999cc, 
    //   facingHex: 0x000000,
    //   bias : 0.05,
    //   scale : 2.5,
    //   power : 6,
    //   invert:true
    // }));
    const atmosphere = new THREE.Mesh(geo, createAtmosphericShader(planetData));
    atmosphere.scale.setScalar(1.05);
    planet.add(atmosphere);
    
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
    orbitGroup.add(createRing(planetData.orbitalRadius, 0, 0.1));
    // orbitGroup.add(createLabel(planetName, p.orbitalRadius))
    
    return orbitGroup;
}

// orbital path ring
function createRing( distance, hue = 0, lightness = 1.0, width = 2 ) {
    function getRingVerts(radius = distance) {
        const positions = [];
        const numVerts = 128;
        for (let i = 0; i <= numVerts; i += 1) {
            const angle = i / numVerts * Math.PI * 2;
            positions.push(radius * Math.cos(angle), radius * Math.sin(angle), 0);
        }
        return positions;
    }
    const color = new THREE.Color().setRGB(lightness, lightness, lightness);
    const ringMat = new LineMaterial({
        color,
        linewidth: width,
    });
    ringMat.resolution.set(w, h); // resolution of the viewport
    const lineGeo = new LineGeometry();
    lineGeo.setPositions(getRingVerts());
    const orbitRing = new Line2(lineGeo, ringMat);
    orbitRing.rotation.x = Math.PI * 0.5;
    orbitRing.computeLineDistances();
    return orbitRing;
}

  export {createPlanet};