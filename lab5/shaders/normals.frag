precision mediump float;

// vertex varyings
varying vec3 vFragNormal;

void main(void) {
    gl_FragColor = vec4(normalize(vFragNormal), 1.0);
}