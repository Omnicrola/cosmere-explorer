import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import { createFresnelMaterial } from '../../src/rendering/materials.js';
import { STELLAR_OBJECT, MODIFIER_NAME } from '../../src/data/stellarData.js';

describe('createFresnelMaterial', () => {
    it('makes a front-facing rim glow by default', () => {
        const material = createFresnelMaterial();
        expect(material.side).toBe(THREE.FrontSide);
        expect(material.defines.INVERT_FALLOFF).toBeUndefined();
        expect(material.uniforms.intensity.value).toBe(1);
        expect(material.blending).toBe(THREE.AdditiveBlending);
    });

    it('supports a back-side halo', () => {
        expect(createFresnelMaterial({ backSide: true }).side).toBe(THREE.BackSide);
    });

    it('supports an inverted, dimmed haze (the particulate ring)', () => {
        const material = createFresnelMaterial({ invertFalloff: true, intensity: 0.25 });
        expect(material.defines).toHaveProperty('INVERT_FALLOFF');
        expect(material.uniforms.intensity.value).toBe(0.25);
        expect(material.fragmentShader).toContain('#ifdef INVERT_FALLOFF');
    });

    it('passes the fresnel parameters through as uniforms', () => {
        const material = createFresnelMaterial({ rimHex: 0xff0000, bias: 0.1, scale: 2, power: 3 });
        expect(material.uniforms.color1.value.getHex()).toBe(0xff0000);
        expect(material.uniforms.fresnelBias.value).toBe(0.1);
        expect(material.uniforms.fresnelScale.value).toBe(2);
        expect(material.uniforms.fresnelPower.value).toBe(3);
    });
});

describe('constants', () => {
    it.each([['STELLAR_OBJECT', STELLAR_OBJECT], ['MODIFIER_NAME', MODIFIER_NAME]])('%s cannot be modified', (_name, constants) => {
        expect(Object.isFrozen(constants)).toBe(true);
        expect(() => { constants.STAR = 99; }).toThrow(TypeError);
    });

    it('has distinct stellar object types', () => {
        const values = Object.values(STELLAR_OBJECT);
        expect(new Set(values).size).toBe(values.length);
    });
});
