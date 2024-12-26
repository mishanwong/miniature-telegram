#version 300 es

precision highp float;
in vec4 v_normal;
in vec2 v_texCoord;

uniform vec4 u_color;

out vec4 outColor;

void main() {
    outColor = u_color;
}
