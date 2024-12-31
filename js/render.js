export const renderObj = (gl, program, buffers, vertexCount) => {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
  const positionLoc = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
  const normalLoc = gl.getAttribLocation(program, "a_normal");
  gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLoc);

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoordBuffer);
  // const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
  // gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(texCoordLoc);

  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
};

export const renderAxis = (gl, program) => {
  const vertices = new Float32Array([
    // X-axis (Red)
    0,
    0,
    0,
    1,
    0,
    0, // Start (red)
    1,
    0,
    0,
    1,
    0,
    0, // End (red)

    // Y-axis (Green)
    0,
    0,
    0,
    0,
    1,
    0, // Start (green)
    0,
    1,
    0,
    0,
    1,
    0, // End (green)

    // Z-axis (Blue)
    0,
    0,
    0,
    0,
    0,
    1, // Start (blue)
    0,
    0,
    1,
    0,
    0,
    1, // End (blue)
  ]);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 6 * 4, 0);
  gl.enableVertexAttribArray(positionLoc);

  // const colorLoc = gl.getAttribLocation(program, "a_color");
  // gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
  // gl.enableVertexAttribArray(colorLoc);
  gl.drawArrays(gl.LINES, 0, 6);
};
