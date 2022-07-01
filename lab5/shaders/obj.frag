precision mediump float;
precision mediump int;
varying vec4 vColor;

uniform int uColorMode;

uniform int uEnableMapKa;
uniform int uEnableMapKd;
uniform int uEnableMapKs;
uniform sampler2D sTextureKa;
uniform sampler2D sTextureKd;
uniform sampler2D sTextureKs;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uSpecularDiffuse;

varying highp vec2 vTexCoord;

void main(void) {
    if(uColorMode == 0) {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;

        if(uEnableMapKa == 1)
            ambient = uMaterialAmbient.xyz * texture2D(sTextureKa, vTexCoord).rgb;
        else
            ambient = uMaterialAmbient.xyz * vec3(0.5, 0.5, 0.5);

        if(uEnableMapKd == 1)
            diffuse = texture2D(sTextureKd, vTexCoord).rgb;
        else
            diffuse = uMaterialDiffuse.xyz;

        if(uEnableMapKs == 1)
            specular = texture2D(sTextureKs, vTexCoord).rgb;
        else
            specular = vec3(0.0, 0.0, 0.0);

        gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
    } else {
        gl_FragColor = vColor;
    }
}