import { createShader, createProgram } from "./setup.js";
import { degToRad } from "./utils.js";
import { loadObj } from "./loaders.js";
import { parseObj } from "./parsers.js";
import { setupObjBuffers } from "./setup.js";
import { renderObj } from "./render.js";
import { resizeCanvasToDisplaySize } from "./utils.js";
import { mat4 } from "https://cdn.skypack.dev/gl-matrix";

const main = async () => {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
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

  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  // gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black

  // gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.viewport(0, 0, canvas.width, canvas.height);

  const objText = await loadObj("../assets/cube.obj");
  const objData = parseObj(objText);
  const buffers = setupObjBuffers(gl, objData);

  const w = gl.canvas.width;
  const h = gl.canvas.height;
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  // Set up MVP Matrices

  // Create matrics
  const viewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  const mvpMatrix = mat4.create();

  // Configure he view matrix (camera)
  const eye = [0, 0, 5];
  const look = [0, 0, 0];
  const up = [0, 1, 0];
  mat4.lookAt(viewMatrix, eye, look, up);

  // Configure the projection matrix
  const fov = degToRad(45);
  const aspect = w / h;
  const near = 0.1;
  const far = 1000;
  mat4.perspective(projectionMatrix, fov, aspect, near, far);

  // Combining Model-View-Projection matrices
  mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);

  const matrixLoc = gl.getUniformLocation(program, "u_modelviewprojection");
  gl.uniformMatrix4fv(matrixLoc, false, mvpMatrix);

  const colorLoc = gl.getUniformLocation(program, "u_color");
  gl.uniform4fv(colorLoc, [0, 0, 1, 1]);

  renderObj(gl, program, buffers);
};

main();
