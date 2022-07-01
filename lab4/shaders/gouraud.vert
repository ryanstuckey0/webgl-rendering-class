precision mediump float;

// vertex attributes
attribute vec3 aVertexPosition; // already in model space
attribute vec3 aVertexNormal; // also in model space

// vertex varyings
varying vec3 vFragColor;

// light uniforms
uniform vec3 uLightPosition;
uniform vec3 uLightAmbient;
uniform vec3 uLightDiffuse;
uniform vec3 uLightSpecular;

// material uniforms
uniform vec3 uMaterialAmbient;
uniform vec3 uMaterialDiffuse;
uniform vec3 uMaterialSpecular;
uniform float uMaterialShininess;

// matrices
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
    vec3 vertexPosition = vec3(uModelViewMatrix * vec4(aVertexPosition, 1.0));

    // ambient
    vec3 ambient = uLightAmbient * uMaterialAmbient;

    // diffuse
    vec3 L = normalize(uLightPosition - vertexPosition);
    vec3 N = normalize(aVertexNormal);
    float NdotL = max(dot(N, L), 0.0);
    vec3 diffuse = uLightDiffuse * uMaterialDiffuse * NdotL;

    // specular
    vec3 V = -normalize(vertexPosition);
    vec3 R = normalize(reflect(-L, N));
    float RdotV = max(dot(R, V), 0.0);
    float RdotVpow = pow(RdotV, uMaterialShininess);
    vec3 specular;
    if(NdotL > 0.0)
        specular = uLightSpecular * uMaterialSpecular * RdotVpow;
    else
        specular = vec3(0.0, 0.0, 0.0);

    vFragColor = vec4(ambient + diffuse + specular, 0.0);
    gl_Position = uProjectionMatrix * vec4(vFragPosition, 1.0);
}