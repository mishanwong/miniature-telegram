const loadShaderFile = async (filePath) => {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load shader file: ${filePath}`);
  }
  return response.text();
};

const createShader = async (gl, type, filename) => {
  const shader = gl.createShader(type);

  const shaderSource = await loadShaderFile(filename);
  gl.shaderSource(shader, shaderSource);
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

const main = async () => {
  const canvas = document.querySelector("#canvas");

  const gl = canvas.getContext("webgl2");

  if (!gl) {
    return;
  }

  // create GLSL shaders, upload the GLSL source, compile the shaders

  const vertexShader = await createShader(
    gl,
    gl.VERTEX_SHADER,
    "vertexShader.vert"
  );
  const fragmentShader = await createShader(
    gl,
    gl.FRAGMENT_SHADER,
    "fragmentShader.frag"
  );

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const positionLoc = gl.getAttribLocation(program, "a_position");
  const colorLoc = gl.getAttribLocation(program, "a_color");

  // Create first object
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // x, y, r, g, b
      -1, -1, 1, 0, 0, -1, 1, 0, 1, 0, 1, -1, 0, 0, 1,
    ]),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 20, 0);

  gl.enableVertexAttribArray(colorLoc);
  gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 20, 8);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

main();
