import * as THREE from 'three';
import { ImprovedNoise } from 'jsm/math/ImprovedNoise.js';
import { ModifierBase } from "./ModifierBase.js";

export class GeoNoise extends ModifierBase {
    constructor(geo, radius, coronaStyle) {
        super();
        this.geo = geo;
        this.radius = radius;
        this.coronaStyle = coronaStyle;

        this.p = new THREE.Vector3()
        this.v3 = new THREE.Vector3()
        this.noise = new ImprovedNoise();
    
        this.pos = geo.attributes.position;
        this.pos.usage = THREE.DynamicDrawUsage;
    }

    update(deltaTime, {clock}) {
        const t = clock.elapsedTime / this.coronaStyle.noiseSpeed;
        const len = this.pos.count;
        
        for (let i = 0; i < len; i += 1) {
            this.p.fromBufferAttribute(this.pos, i).normalize();
            this.v3.copy(this.p).multiplyScalar(this.coronaStyle.noiseScale);
            let ns = this.noise.noise(this.v3.x + Math.cos(t), this.v3.y + Math.sin(t), this.v3.z + t);
            this.v3.copy(this.p)
                .setLength(this.radius)
                .addScaledVector(this.p, ns * this.coronaStyle.noiseIntensity);
            this.pos.setXYZ(i, this.v3.x, this.v3.y, this.v3.z);
        }
        this.pos.needsUpdate = true;
    }
}