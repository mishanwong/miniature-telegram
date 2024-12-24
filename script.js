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

function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column
      0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

      // top rung
      30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

      // middle rung
      30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
    ]),
    gl.STATIC_DRAW
  );
}

const main = async () => {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
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

  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionLoc = gl.getAttribLocation(program, "a_position");
  const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
  const colorLoc = gl.getUniformLocation(program, "u_color");
  const translationLoc = gl.getUniformLocation(program, "u_translation");
  const rotationLoc = gl.getUniformLocation(program, "u_rotation");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  setGeometry(gl);
  let xValue = 0;
  let yValue = 0;
  let angleValue = 0;

  const drawScene = () => {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(program);

    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(translationLoc, xValue, yValue);
    gl.uniform3fv(colorLoc, [0.5, 0, 0.5]);
    const rad = (angleValue * Math.PI) / 180;
    const rotationMatrix = [
      Math.cos(rad),
      -Math.sin(rad),
      Math.sin(rad),
      Math.cos(rad),
    ];
    gl.uniformMatrix2fv(rotationLoc, false, rotationMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 18);
  };
  drawScene();

  const xSlider = document.getElementById("x-slider");
  const ySlider = document.getElementById("y-slider");
  const angleSlider = document.getElementById("angle-slider");
  const xDisplay = document.getElementById("x-display");
  const yDisplay = document.getElementById("y-display");
  const angleDisplay = document.getElementById("angle-display");

  xSlider.addEventListener("input", (e) => {
    xValue = e.target.value;
    xDisplay.innerText = xValue;
    drawScene();
  });

  ySlider.addEventListener("input", () => {
    yValue = ySlider.value;
    yDisplay.innerText = yValue;
    drawScene();
  });

  angleSlider.addEventListener("input", () => {
    angleValue = angleSlider.value;
    angleDisplay.innerText = angleValue;
    drawScene();
  });
};

main();
