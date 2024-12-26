import { loadShaderFile } from "./loaders.js";

export const createShader = async (gl, type, filename) => {
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

export const createProgram = (gl, vertexShader, fragmentShader) => {
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

export const setupObjBuffers = (gl, objData) => {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, objData.vertices, gl.STATIC_DRAW);

  // const normalBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, objData.normals, gl.STATIC_DRAW);

  // const texCoordBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, objData.texCoords, gl.STATIC_DRAW);

  // const indexBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  // gl.bufferData(
  //   gl.ELEMENT_ARRAY_BUFFER,
  //   new Uint16Array(objData.indices),
  //   gl.STATIC_DRAW
  // );

  // return { vertexBuffer, normalBuffer, texCoordBuffer, indexBuffer };
  return { vertexBuffer };
};
