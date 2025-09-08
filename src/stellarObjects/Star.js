import * as THREE from 'three';
import { StellarObject } from "./StellarObject";

export class Star extends StellarObject {
    constructor(starData) {
        super(starData);
    
        const rgbColor = bvColorIndexToRGB(starData.colorIndex);
        const intensity = emissiveFromAbsoluteMagnitude(starData.absoluteMagnitude);

        let sunMat = new THREE.MeshStandardMaterial({
            emissive: rgbColor ,
            emissiveIntensity: intensity
        });

        // glowy sun center
        const geo = new THREE.IcosahedronGeometry(starData.radius, 6);
        const star = new THREE.Mesh(geo, sunMat);
        this.add(star);
    }

    /**
     * Converts a star's B-V color index to a hexadecimal color string.
     *    https://en.wikipedia.org/wiki/Color_index
     * This is an approximation based on the black body radiation curve.
     * @param {number} bvIndex The B-V color index of the star.
     * @returns {string} The hexadecimal color code (e.g., "#ffffff").
     */
    static bvColorIndexToRGB(bvIndex) {
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

    static emissiveFromAbsoluteMagnitude(absoluteMagnitude) {
        const minMagnitude = -10;
        const maxMagnitude = 15;

        const maxIntensity = 2.0;
        const minIntensity = 0.8;

        const clampedMagnitude = Math.max(minMagnitude, Math.min(maxMagnitude, absoluteMagnitude));
        const normalizedBrightness = (maxMagnitude - clampedMagnitude) / (maxMagnitude - minMagnitude);

        const logBrightness = Math.pow(normalizedBrightness, 0.4);
        return minIntensity + (maxIntensity - minIntensity) * logBrightness;
    }
}