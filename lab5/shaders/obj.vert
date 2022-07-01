precision mediump float;
precision mediump int;
attribute vec3 aVertexPosition;
attribute vec2 aVertexTexCoord;
attribute vec3 aVertexColor;

varying vec4 vColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectMatrix;
uniform int uColorMode;

varying highp vec2 vTexCoord;

void main(void) {
    gl_PointSize = 1.0;
    gl_Position = uProjectMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vTexCoord = aVertexTexCoord;
    if(uColorMode > 0)
        vColor = vec4(aVertexColor, 1.0);
}