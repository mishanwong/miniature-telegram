export const parseObj = (objText) => {
  const vertices = [];
  const texCoords = [];
  const normals = [];

  const vertexData = [];
  const normalData = [];
  const texCoordData = [];
  const lines = objText.split("\n");

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const type = parts[0];

    if (type === "v") {
      vertices.push([...parts.slice(1).map(Number)]);
    } else if (type === "vt") {
      texCoords.push([...parts.slice(1).map(Number)]);
    } else if (type === "vn") {
      normals.push([...parts.slice(1).map(Number)]);
    } else if (type === "f") {
      const faces = parts.slice(1);
      let vIndices = [];
      let vtIndices = [];
      let vnIndices = [];
      for (let i = 0; i < 4; i++) {
        const [vIndex, vtIndex, vnIndex] = faces[i]
          .split("/")
          .map((idx) => Number(idx) - 1);
        vIndices.push(vIndex);
        vtIndices.push(vtIndex);
        vnIndices.push(vnIndex);
      }
      vertexData.push(vertices[vIndices[0]]);
      vertexData.push(vertices[vIndices[1]]);
      vertexData.push(vertices[vIndices[2]]);
      vertexData.push(vertices[vIndices[0]]);
      vertexData.push(vertices[vIndices[2]]);
      vertexData.push(vertices[vIndices[3]]);

      texCoordData.push(texCoords[vtIndices[0]]);
      texCoordData.push(texCoords[vtIndices[1]]);
      texCoordData.push(texCoords[vtIndices[2]]);
      texCoordData.push(texCoords[vtIndices[0]]);
      texCoordData.push(texCoords[vtIndices[2]]);
      texCoordData.push(texCoords[vtIndices[3]]);

      normalData.push(normals[vnIndices[0]]);
      normalData.push(normals[vnIndices[1]]);
      normalData.push(normals[vnIndices[2]]);
      normalData.push(normals[vnIndices[0]]);
      normalData.push(normals[vnIndices[2]]);
      normalData.push(normals[vnIndices[3]]);
    }
  }
  return {
    vertices: new Float32Array(vertexData.flat()),
    normals: new Float32Array(normalData.flat()),
    texCoords: new Float32Array(texCoordData.flat()),
  };
};
