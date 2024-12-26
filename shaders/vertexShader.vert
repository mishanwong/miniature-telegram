#version 300 es

in vec4 a_position;
in vec4 a_normal;
in vec2 a_texCoord;
in vec4 a_color;

uniform mat4 u_modelviewprojection;

out vec4 v_color;
out vec4 v_normal;
out vec2 v_texCoord;

void main() {
    gl_Position = u_modelviewprojection * a_position;
    v_normal = a_normal;
    v_texCoord = a_texCoord;
    v_color = a_color;
}
