import * as THREE from 'three';
import { ImprovedNoise } from 'jsm/math/ImprovedNoise.js';
import { createFresnelMaterial } from '../../resources/materials.js';

function coronaTurbulence(geo, radius) {
    let p = new THREE.Vector3()
    let v3 = new THREE.Vector3()
    let noise = new ImprovedNoise();

    let pos = geo.attributes.position;
    pos.usage = THREE.DynamicDrawUsage;
    const len = pos.count;

    // update function, modulate vertexes each frame
    return (deltaTime, {clock}) => {
        const t = clock.elapsedTime / 4;
        
        for (let i = 0; i < len; i += 1) {
            p.fromBufferAttribute(pos, i).normalize();
            v3.copy(p).multiplyScalar(3.0);
            let ns = noise.noise(v3.x + Math.cos(t), v3.y + Math.sin(t), v3.z + t);
            v3.copy(p)
                .setLength(radius)
                .addScaledVector(p, ns * 3);
            pos.setXYZ(i, v3.x, v3.y, v3.z);
        }
        pos.needsUpdate = true;
    }
}

function createStarCorona(starRadius = 3, color = 0xff0000) {
    const radius = 0.95 * starRadius;
    const material = new THREE.MeshStandardMaterial({
        emissive: color,
        side: THREE.BackSide,
    });
    const geo = new THREE.IcosahedronGeometry(radius, 7);
    const mesh = new THREE.Mesh(geo, material);
    mesh.userData.update = coronaTurbulence(geo, radius);
    return mesh;
}

function createStar(starData) {
    const rgbColor = bvColorIndexToRGB(starData.colorIndex);
    console.log(rgbColor);
    let sunMat = new THREE.MeshStandardMaterial({
        emissive: rgbColor ,
    });

    // glowy sun center
    const geo = new THREE.IcosahedronGeometry(starData.radius, 6);
    const sun = new THREE.Mesh(geo, sunMat);
    sun.castShadow = false;  
    sun.name = starData.id;
    sun.userData = {
        isSelectable: true,
        info : starData,
        update : (t) => {
            sun.rotation.y += t * .05;
        }
    };

    // noisy corona
    const coronaMesh = createStarCorona(starData.radius, rgbColor);
    sun.add(coronaMesh);


    return sun;
}

/**
 * Converts a star's B-V color index to a hexadecimal color string.
 *    https://en.wikipedia.org/wiki/Color_index
 * This is an approximation based on the black body radiation curve.
 * @param {number} bvIndex The B-V color index of the star.
 * @returns {string} The hexadecimal color code (e.g., "#ffffff").
 */
function bvColorIndexToRGB(bvIndex) {
  // Clamp the input value to a reasonable range for this algorithm
  let bv = Math.max(-0.4, Math.min(2.0, bvIndex));

  let r, g, b;

  // Temperature ranges based on the B-V index, translated to RGB values
  // A similar algorithm can be found in the Stack Overflow post
  if (bv < -0.4) {
    // Hot, blue stars (e.g., O and B spectral types)
    r = 0.61 + 0.11 * bv + 0.1 * bv * bv;
    g = 0.50 + 0.11 * bv + 0.1 * bv * bv;
    b = 1.0;
  } else if (bv < 0.00) {
    // Blue-white stars
    let t = (bv + 0.40) / 0.40;
    r = 0.61 + 0.11 * t + 0.1 * t * t;
    g = 0.50 + 0.11 * t + 0.1 * t * t;
    b = 1.0;
  } else if (bv < 0.40) {
    // White stars (e.g., A and F spectral types)
    let t = (bv - 0.00) / 0.40;
    r = 0.83 + 0.17 * t;
    g = 0.68 + 0.09 * t;
    b = 1.0;
  } else if (bv < 1.60) {
    // Yellow to orange stars (e.g., G and K spectral types)
    let t = (bv - 0.40) / 1.20;
    r = 1.0;
    g = 0.77 + 0.22 * t;
    b = 1.0 - 0.48 * t - 0.22 * t * t;
  } else {
    // Cool, red stars (e.g., M spectral types)
    r = 1.0;
    g = 0.65 - 0.20 * (bv - 1.60);
    b = 0.0;
  }

  return new THREE.Color(r, g, b);
}

export {createStar, coronaTurbulence};