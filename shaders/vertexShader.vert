#version 300 es

in vec4 a_position;
in vec4 a_normal;

uniform mat4 u_modelviewprojection;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_normal_matrix;

out vec3 vN;
out vec3 vL;
out vec3 vE;

const vec3 LIGHTPOS = vec3(10., 10., 5);

void main() {
    gl_Position = u_modelviewprojection * a_position;


    // Setup for per-fragment lighting
    vN = vec3(u_normal_matrix * a_normal);
    vL = LIGHTPOS - gl_Position.xyz; // Vector from point to light
    vE = vec3(0., 0., 0.) - gl_Position.xyz; // Vector from point to eye 
}
