#version 300 es

precision highp float;
in vec2 v_texCoord;

// our texture
uniform sampler2D u_image;

// the texCoords passed in from the vertex shader
out vec4 outColor;

void main() {
    vec2 onePixel = vec2(1) / vec2(textureSize(u_image, 0));

    // Average the left, middle and right pixels

    outColor = (texture(u_image, v_texCoord) + 
                texture(u_image, v_texCoord + vec2(onePixel.s, onePixel.t)) + 
                texture(u_image, v_texCoord + vec2(-onePixel.t, -onePixel.t))) / 3.0;
}
