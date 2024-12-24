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

const m3 = {
  multiply: function (a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];

    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
  translation: function (tx, ty) {
    return [1, 0, 0, 0, 1, 0, tx, ty, 1];
  },

  rotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  },

  scaling: function (sx, sy) {
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  },
};

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
  const matrixLoc = gl.getUniformLocation(program, "u_matrix");

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  setGeometry(gl);
  let tx = 0;
  let ty = 0;
  let angle = 0;
  let sx = 1;
  let sy = 1;

  const drawScene = () => {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(program);

    gl.bindVertexArray(vao);

    gl.uniform3fv(colorLoc, [0.5, 0, 0.5]);
    gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);

    const rad = (angle * Math.PI) / 180;

    // Compute the matrices
    const translationMatrix = m3.translation(tx, ty);
    const rotationMatrix = m3.rotation(rad);
    const scaleMatrix = m3.scaling(sx, sy);

    // Multiply the matrices
    let matrix = m3.multiply(translationMatrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);

    gl.uniformMatrix3fv(matrixLoc, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 18);
  };

  drawScene();

  const xSlider = document.getElementById("x-slider");
  const ySlider = document.getElementById("y-slider");
  const angleSlider = document.getElementById("angle-slider");
  const xDisplay = document.getElementById("x-display");
  const yDisplay = document.getElementById("y-display");
  const angleDisplay = document.getElementById("angle-display");
  const scaleXSlider = document.getElementById("scale-x-slider");
  const scaleYSlider = document.getElementById("scale-y-slider");
  const scaleXDisplay = document.getElementById("scale-x-display");
  const scaleYDisplay = document.getElementById("scale-y-display");

  xSlider.addEventListener("input", (e) => {
    tx = e.target.value;
    xDisplay.innerText = tx;
    drawScene();
  });

  ySlider.addEventListener("input", (e) => {
    ty = e.target.value;
    yDisplay.innerText = ty;
    drawScene();
  });

  angleSlider.addEventListener("input", (e) => {
    angle = e.target.value;
    angleDisplay.innerText = angle;
    drawScene();
  });

  scaleXSlider.addEventListener("input", (e) => {
    sx = e.target.value;
    scaleXDisplay.innerText = sx;
    drawScene();
  });

  scaleYSlider.addEventListener("input", (e) => {
    sy = e.target.value;
    scaleYDisplay.innerText = sy;
    drawScene();
  });
};

main();
