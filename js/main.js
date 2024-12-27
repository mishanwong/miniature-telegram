import { createShader, createProgram } from "./setup.js";
import { degToRad } from "./utils.js";
import { loadObj } from "./loaders.js";
import { parseObj } from "./parsers.js";
import { setupObjBuffers, setupListeners } from "./setup.js";
import { renderObj, renderAxis } from "./render.js";
import { resizeCanvasToDisplaySize } from "./utils.js";
import { mat4 } from "https://cdn.skypack.dev/gl-matrix";

const transformations = {
  translations: [0, 0, 0],
  rotations: [0, 0, 0],
  scaling: [1, 1, 1],
};
let canvas;
let gl;
let program;
let buffers;

const main = async () => {
  canvas = document.querySelector("#canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  resizeCanvasToDisplaySize(gl, canvas);
  const vertexShader = await createShader(
    gl,
    gl.VERTEX_SHADER,
    "../shaders/vertexShader.vert"
  );
  const fragmentShader = await createShader(
    gl,
    gl.FRAGMENT_SHADER,
    "../shaders/fragmentShader.frag"
  );

  program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  setupListeners(transformations);
  const objText = await loadObj("../assets/cube.obj");
  const objData = parseObj(objText);
  buffers = setupObjBuffers(gl, objData);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  applyTransformation();
};

const drawScene = () => {
  // renderAxis(gl, program);
  renderObj(gl, program, buffers);
};

export const applyTransformation = () => {
  // Create matrics
  const modelMatrix = mat4.create();
  const viewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  const mvpMatrix = mat4.create();

  // Step 1: Model Matrix - Apply objection transformations
  // 1 (a) Translation
  const translationMatrix = mat4.create();
  mat4.translate(
    translationMatrix,
    translationMatrix,
    transformations.translations
  );

  // 1 (b) Rotation
  const rotationMatrix = mat4.create();
  const rotationXMatrix = mat4.create();
  const rotationYMatrix = mat4.create();
  const rotationZMatrix = mat4.create();
  mat4.rotateX(
    rotationXMatrix,
    rotationXMatrix,
    degToRad(transformations.rotations[0])
  );
  mat4.rotateY(
    rotationYMatrix,
    rotationYMatrix,
    degToRad(transformations.rotations[1])
  );
  mat4.rotateZ(
    rotationZMatrix,
    rotationZMatrix,
    degToRad(transformations.rotations[2])
  );

  // Combine rotations (order Z * Y * X)
  mat4.multiply(rotationMatrix, rotationYMatrix, rotationZMatrix); // Z * Y
  mat4.multiply(rotationMatrix, rotationMatrix, rotationXMatrix); // (Z * Y) * X

  // 1 (c) Scaling
  const scalingMatrix = mat4.create();
  mat4.scale(scalingMatrix, scalingMatrix, transformations.scaling);

  // Combine the transformation

  mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);
  mat4.multiply(modelMatrix, modelMatrix, translationMatrix); // Apply the translation
  mat4.multiply(modelMatrix, modelMatrix, scalingMatrix);
  // Configure he view matrix (camera)
  const eye = [0, 0, 5];
  const look = [0, 0, 0];
  const up = [0, 1, 0];
  mat4.lookAt(viewMatrix, eye, look, up);

  // Configure the projection matrix
  const fov = degToRad(45);

  const w = gl.canvas.width;
  const h = gl.canvas.height;
  const aspect = w / h;
  const near = 0.1;
  const far = 1000;
  mat4.perspective(projectionMatrix, fov, aspect, near, far);

  // Combining Model-View-Projection matrices
  mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
  mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);

  const matrixLoc = gl.getUniformLocation(program, "u_modelviewprojection");
  gl.uniformMatrix4fv(matrixLoc, false, mvpMatrix);

  drawScene();
};

main();
