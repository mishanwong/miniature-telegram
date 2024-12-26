import { loadShaderFile } from "./loaders.js";
import { applyTransformation } from "./main.js";

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

export const setupListeners = (tfm) => {
  const xSlider = document.getElementById("x-slider");
  const ySlider = document.getElementById("y-slider");
  const zSlider = document.getElementById("z-slider");

  const xRotateSlider = document.getElementById("x-rotate-slider");
  const yRotateSlider = document.getElementById("y-rotate-slider");
  const zRotateSlider = document.getElementById("z-rotate-slider");

  const scaleXSlider = document.getElementById("scale-x-slider");
  const scaleYSlider = document.getElementById("scale-y-slider");
  const scaleZSlider = document.getElementById("scale-z-slider");

  const xDisplay = document.getElementById("x-display");
  const yDisplay = document.getElementById("y-display");
  const zDisplay = document.getElementById("z-display");

  const xRotateDisplay = document.getElementById("x-rotate-display");
  const yRotateDisplay = document.getElementById("y-rotate-display");
  const zRotateDisplay = document.getElementById("z-rotate-display");

  const scaleXDisplay = document.getElementById("scale-x-display");
  const scaleYDisplay = document.getElementById("scale-y-display");
  const scaleZDisplay = document.getElementById("scale-z-display");

  xSlider.addEventListener("input", (e) => {
    tfm.translations[0] = e.target.value;
    xDisplay.innerText = tfm.translations[0];
    applyTransformation();
  });

  ySlider.addEventListener("input", (e) => {
    tfm.translations[1] = e.target.value;
    yDisplay.innerText = tfm.translations[1];
    applyTransformation();
  });

  zSlider.addEventListener("input", (e) => {
    tfm.translations[2] = e.target.value;
    zDisplay.innerText = tfm.translations[2];
    applyTransformation();
  });

  xRotateSlider.addEventListener("input", (e) => {
    tfm.rotations[0] = e.target.value;
    xRotateDisplay.innerText = tfm.rotations[0];
    applyTransformation();
  });

  yRotateSlider.addEventListener("input", (e) => {
    tfm.rotations[1] = e.target.value;
    yRotateDisplay.innerText = tfm.rotations[1];
    applyTransformation();
  });

  zRotateSlider.addEventListener("input", (e) => {
    tfm.rotations[2] = e.target.value;
    zRotateDisplay.innerText = tfm.rotations[2];
    applyTransformation();
  });

  scaleXSlider.addEventListener("input", (e) => {
    tfm.scaling[0] = e.target.value;
    scaleXDisplay.innerText = tfm.scaling[0];
    applyTransformation();
  });

  scaleYSlider.addEventListener("input", (e) => {
    tfm.scaling[1] = e.target.value;
    scaleYDisplay.innerText = tfm.scaling[1];
    applyTransformation();
  });

  scaleZSlider.addEventListener("input", (e) => {
    tfm.scaling[2] = e.target.value;
    scaleZDisplay.innerText = tfm.scaling[2];
    applyTransformation();
  });
};
