export const parseObj = (objText) => {
  const vertices = [];
  const texCoords = [];
  const normals = [];
  const indices = [];

  const vertexData = [];
  const normalData = [];
  const texCoordData = [];
  const lines = objText.split("\n");

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const type = parts[0];

    if (type === "v") {
      vertices.push([...parts.slice(1).map(Number)]);
    } else if (type === "f") {
      const faces = parts.slice(1);
      let faceIndex = [];
      for (let i = 0; i < 4; i++) {
        const [vIndex, ,] = faces[i].split("/").map((idx) => Number(idx) - 1);
        faceIndex.push(vIndex);
      }

      vertexData.push(vertices[faceIndex[0]]);
      vertexData.push(vertices[faceIndex[1]]);
      vertexData.push(vertices[faceIndex[2]]);
      vertexData.push(vertices[faceIndex[0]]);
      vertexData.push(vertices[faceIndex[2]]);
      vertexData.push(vertices[faceIndex[3]]);
    }
  }
  return {
    vertices: new Float32Array(vertexData.flat()),
    // normals: new Float32Array(normalData),
    // texCoords: new Float32Array(texCoordData),
    // indices: new Uint16Array(indices),
  };
};
