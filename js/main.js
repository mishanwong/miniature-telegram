import { createShader, createProgram } from "./setup.js";
import { m4 } from "./matrix.js";
import { degToRad } from "./utils.js";

const main = async () => {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
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

  const drawScene = () => {
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);
  };

  drawScene();
};

main();
