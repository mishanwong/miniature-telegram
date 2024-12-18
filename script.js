const vertexShaderSource = `#version 300 es

in vec4 a_position;

void main() {
    gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec4 u_color;
out vec4 outColor;

void main() {
    outColor = u_color;
}
`;

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

const main = () => {
  const canvas = document.querySelector("#canvas");

  const gl = canvas.getContext("webgl2");

  if (!gl) {
    return;
  }

  // create GLSL shaders, upload the GLSL source, compile the shaders

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // Link the two shaders into a program
  const program = createProgram(gl, vertexShader, fragmentShader);

  // Look up where the vertex data needs to do
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put the three 2D clip space points in it

  const positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [0, 0, 0, 0.5, 0.9, 0, -0.7, -0.5, 0, -0.7, 0.5, 0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Vertex Array Object
  const vao = gl.createVertexArray();

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttributeLocation);

  let size = 2;
  let type = gl.FLOAT;
  let normalize = false;
  let stride = 0;
  let offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  // Set a random color
  const colorLocation = gl.getUniformLocation(program, "u_color");
  gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
  const primitiveType = gl.TRIANGLES;
  const count = positions.length / size;
  gl.drawArrays(primitiveType, offset, count);
};

main();
