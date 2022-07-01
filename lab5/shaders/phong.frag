precision mediump float;

// vertex varyings
varying vec3 vFragPosition;
varying vec3 vFragNormal;

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

void main(void) {
    // ambient
    vec3 ambient = uLightAmbient * uMaterialAmbient;

    // diffuse
    vec3 L = normalize(uLightPosition - vFragPosition);
    vec3 N = normalize(vFragNormal);
    float NdotL = max(dot(N, L), 0.0);
    vec3 diffuse = uLightDiffuse * uMaterialDiffuse * NdotL;

    // specular
    vec3 V = -normalize(vFragPosition);
    vec3 R = normalize(reflect(-L, N));
    float RdotV = max(dot(R, V), 0.0);
    float RdotVpow = pow(RdotV, 1.0 / uMaterialShininess);
    vec3 specular;
    if(NdotL > 0.0)
        specular = uLightSpecular * uMaterialSpecular * RdotVpow;
    else
        specular = vec3(0.0, 0.0, 0.0);

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}