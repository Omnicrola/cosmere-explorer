export default  `
varying vec3 vNormal;
uniform vec3 atmo_rgb;

void main() {

    float dotP = dot( vNormal, vec3( 0, 0, 1.0 ) );
    float intensity = pow( 0.8 - dotP, 4.5 );

    // add change in dotP to the color to make it brighter and less blue towards the center
    gl_FragColor = vec4( atmo_rgb.x - dotP/2.0, atmo_rgb.y - dotP/2.0, atmo_rgb.z, 0.65 ) * intensity;

    // (optional) colorSpace conversion for output
    // gl_FragColor = linearToOutputTexel( gl_FragColor );
}
`