export const renderObj = (gl, program, buffers, materials, vertexCount) => {
  for (let group in buffers) {
    renderGroup(
      gl,
      program,
      buffers[group],
      materials[group],
      vertexCount[group]
    );
  }
};

const renderGroup = (gl, program, buffer, material, vertexCount) => {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertexBuffer);
  const positionLoc = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  // Get uniform locations
  const uKsLoc = gl.getUniformLocation(program, "uKs");
  const uKaLoc = gl.getUniformLocation(program, "uKa");
  const uKdLoc = gl.getUniformLocation(program, "uKd");

  // Set uniforms

  gl.uniform3fv(uKsLoc, material["Ks"]);
  gl.uniform3fv(uKaLoc, material["Ka"]);
  gl.uniform3fv(uKdLoc, material["Kd"]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normalBuffer);
  const normalLoc = gl.getAttribLocation(program, "a_normal");
  gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLoc);
  console.log(`Drawing ${vertexCount}`);
  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
};
