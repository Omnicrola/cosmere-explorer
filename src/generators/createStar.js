import * as THREE from 'three';
import { getFresnelMat } from "../getFresnelMat.js";
import { ImprovedNoise } from 'jsm/math/ImprovedNoise.js';

function coronaTurbulence(geo, radius) {
    let p = new THREE.Vector3()
    let v3 = new THREE.Vector3()
    let noise = new ImprovedNoise();

    let pos = geo.attributes.position;
    pos.usage = THREE.DynamicDrawUsage;
    const len = pos.count;

    // update function, modulate vertexes each frame
    return (t) => {
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
    const material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.BackSide,
    });
    const geo = new THREE.IcosahedronGeometry(radius, 7);
    const mesh = new THREE.Mesh(geo, material);

    mesh.userData.update = coronaTurbulence(geo, radius);
    return mesh;
}

function createStar({
    starRadius = 1,
    starColor = 0xffff99
}) {
    
    const sunMat = new THREE.MeshStandardMaterial({
        emissive: starColor,
    });
    const geo = new THREE.IcosahedronGeometry(starRadius, 6);
    const sun = new THREE.Mesh(geo, sunMat);

    const sunRimMat = getFresnelMat({ rimHex: starColor, facingHex: 0x000000 });
    const rimMesh = new THREE.Mesh(geo, sunRimMat);
    rimMesh.scale.setScalar(1.01);
    sun.add(rimMesh);

    const coronaMesh = createStarCorona(starRadius, starColor);
    sun.add(coronaMesh);

    const sunLight = new THREE.PointLight(starColor, 10);
    sun.add(sunLight);
    sun.userData.update = (t) => {
        sun.rotation.y = t;
        coronaMesh.userData.update(t);
    };
    return sun;
}
export {createStar};