export const renderObj = (gl, program, buffers) => {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
  const positionLoc = gl.getAttribLocation(program, "a_position");

  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
  // const normalLoc = gl.getAttribLocation(program, "a_normal");
  // gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(normalLoc);

  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoordBuffer);
  // const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
  // gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(texCoordLoc);

  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
  // gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
};

export const renderAxis = (gl, program) => {};
