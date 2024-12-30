#version 300 es

precision highp float;
in vec3 vN;
in vec3 vL;
in vec3 vE;

const float u_Ka = 0.5;
const float u_Kd = 0.4;
const float u_Ks = 0.3;
const float u_Shininess = 250.;
const vec3 myColor = vec3(0.5, 0.01, 0.);
const vec3 SPECULARCOLOR = vec3( 1., 1., 1. );

out vec4 outColor;

void main() {

    // Per fragment lighting
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);

    vec3 ambient = u_Ka * myColor;

    float d = max(dot(Normal, Light) , 0.);
    vec3 diffuse = u_Kd * d * myColor;

    float s = 0.;
    if (d > 0.) {
    vec3 ref = normalize(reflect(-Light, Normal));
        float cosphi = dot(Eye, ref);
        if (cosphi > 0.) {
            s = pow(max(cosphi, 0.), u_Shininess);
        }
    }
    vec3 specular = u_Ks * s * SPECULARCOLOR.rgb;

    outColor = vec4(ambient + diffuse + specular, 1.);
}
