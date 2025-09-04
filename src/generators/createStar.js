import * as THREE from 'three';
import { ImprovedNoise } from 'jsm/math/ImprovedNoise.js';
import { createFresnelMaterial } from '../../resources/materials.js';
import { createOrbital } from './createOrbital.js';
import { createOrbitalPath } from './createRings.js';

function coronaTurbulence(geo, radius, coronaStyle) {
    let p = new THREE.Vector3()
    let v3 = new THREE.Vector3()
    let noise = new ImprovedNoise();

    let pos = geo.attributes.position;
    pos.usage = THREE.DynamicDrawUsage;
    const len = pos.count;

    // update function, modulate vertexes each frame
    return (deltaTime, {clock}) => {
        const t = clock.elapsedTime / coronaStyle.noiseSpeed;
        
        for (let i = 0; i < len; i += 1) {
            p.fromBufferAttribute(pos, i).normalize();
            v3.copy(p).multiplyScalar(coronaStyle.noiseScale);
            let ns = noise.noise(v3.x + Math.cos(t), v3.y + Math.sin(t), v3.z + t);
            v3.copy(p)
                .setLength(radius)
                .addScaledVector(p, ns * coronaStyle.noiseIntensity);
            pos.setXYZ(i, v3.x, v3.y, v3.z);
        }
        pos.needsUpdate = true;
    }
}

function createStarCorona(starData, color = 0xff0000, intensity) {
    const radius = 0.98 * starData.radius;
    const material = new THREE.MeshStandardMaterial({
        emissive: color,
        emissiveIntensity: intensity,
        side: THREE.BackSide,
    });
   
    const geo = new THREE.IcosahedronGeometry(radius, 7);
    const mesh = new THREE.Mesh(geo, material);
    mesh.userData.update = coronaTurbulence(geo, radius, starData.coronaStyle);

    return mesh;
}

function createStar(starData) {

    const { stellarAnchor, orbitGroupAnchor } = createOrbital(starData);

    const rgbColor = bvColorIndexToRGB(starData.colorIndex);
    const intensity = emissiveFromAbsoluteMagnitude(starData.absoluteMagnitude);

    let sunMat = new THREE.MeshStandardMaterial({
        emissive: rgbColor ,
        emissiveIntensity: intensity
    });

    // glowy sun center
    const geo = new THREE.IcosahedronGeometry(starData.radius, 6);
    const star = new THREE.Mesh(geo, sunMat);
    star.castShadow = false;  
    star.name = starData.id;
    star.userData = {
        isSelectable: true,
        info : starData,
        update : (t) => {
            star.rotateY(t * .05);
        }
    };

    // noisy corona
    const coronaMesh = createStarCorona(starData, rgbColor, intensity);
    star.add(coronaMesh);

    // orbital ring (usually disabled)
    if(starData.showOrbitalPath) {
      const orbitalPath = createOrbitalPath(starData.orbitalRadius, 0, 0.1);
      stellarAnchor.add(orbitalPath);
    }

    orbitGroupAnchor.add(star);

    return stellarAnchor;
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

function emissiveFromAbsoluteMagnitude(absoluteMagnitude) {
  const minMagnitude = -10;
  const maxMagnitude = 15;

  const maxIntensity = 1.5;
  const minIntensity = 0.1;

  const clampedMagnitude = Math.max(minMagnitude, Math.min(maxMagnitude, absoluteMagnitude));
  const normalizedBrightness = (maxMagnitude - clampedMagnitude) / (maxMagnitude - minMagnitude);

  const logBrightness = Math.pow(normalizedBrightness, 0.4);
  return minIntensity + (maxIntensity - minIntensity) * logBrightness;
}

export {createStar, coronaTurbulence};