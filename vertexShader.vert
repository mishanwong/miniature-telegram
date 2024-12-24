#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform mat2 u_rotation;

out vec3 v_color;

void main() {
    vec2 position = u_rotation * a_position + u_translation;

    // Convert the position from pixels to between 0.0 and 1.0
    vec2 zeroToOne = position / u_resolution;

    // Convert from [0, 1] to [0, 2]
    vec2 zeroToTwo = zeroToOne * 2.0;

    // Convert from [0, 1] to [-1, 1] (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
