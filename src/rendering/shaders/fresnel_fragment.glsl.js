// Blends from the facing color to the rim color by the fresnel term.
// INVERT_FALLOFF makes it brightest facing the camera and fade towards the rim
// (a hazy cloud rather than a glowing halo).
export default `
uniform vec3 color1;
uniform vec3 color2;
uniform float intensity;

varying float vReflectionFactor;

void main() {
    float f = clamp( vReflectionFactor, 0.0, 1.0 );
#ifdef INVERT_FALLOFF
    f = 1.0 - f;
#endif
    f *= intensity;
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
}
`;
