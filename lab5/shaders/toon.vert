precision mediump float;

// vertex attributes
attribute vec3 aVertexPosition; // already in model space
attribute vec3 aVertexNormal; // also in model space

// vertex varyings
varying vec3 vFragPosition;
varying vec3 vFragNormal;

// matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
    vFragNormal = vec3(uModelViewMatrix * vec4(aVertexNormal, 0.0));
    vFragPosition = vec3(uModelViewMatrix * vec4(aVertexPosition, 1.0));

    gl_Position = uProjectionMatrix * vec4(vFragPosition, 1.0);
}