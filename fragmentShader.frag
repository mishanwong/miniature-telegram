#version 300 es

precision highp float;
uniform vec3 u_color;

// the texCoords passed in from the vertex shader
out vec4 outColor;

void main() {
    outColor = vec4(u_color, 1.0);
}
