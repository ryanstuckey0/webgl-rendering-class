precision mediump float;
attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
varying vec4 vColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
    gl_PointSize = 10.0;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vColor = vec4(aVertexColor, 1.0);
}