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

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    new Float32Array([x1, y1, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

const main = async (image) => {
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

  // Look up where the vertex data needs to go
  const positionLoc = gl.getAttribLocation(program, "a_position");
  const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");

  // Look up uniform locations
  const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
  const imageLoc = gl.getUniformLocation(program, "u_image");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Create a texture
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);

  // Bind texture to texture unit 0 2D bind point
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // Pass in the canvas resolution so we can convert from pixels to clip space in the shader
  gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(imageLoc, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Set a rectanglethe same size as the image
  setRectangle(gl, 0, 0, image.width, image.height);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
const image = new Image();
image.src = "leaves.png";
image.onload = () => main(image);
