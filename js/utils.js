export const degToRad = (deg) => {
  return (deg * Math.PI) / 180;
};

export const radToDeg = (rad) => {
  return (rad * 180) / Math.PI;
};

export const resizeCanvasToDisplaySize = (gl, canvas) => {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, canvas.width, canvas.height); // Update WebGL viewport
  }
};
