#version 300 es

precision highp float;
in vec2 v_texCoord;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader
out vec4 outColor;

void main() {
    outColor = texture(u_image, v_texCoord);
}
