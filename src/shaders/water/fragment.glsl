uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main(){

    float mixColorStrength = (vElevation + uColorOffset) + uColorMultiplier;
    vec3 color = mix(uDepthColor,uSurfaceColor ,mixColorStrength);

    gl_FragColor = vec4(color , 1.0);
}