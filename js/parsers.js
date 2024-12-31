export const parseObj = (objText) => {
  const vertices = [];
  const texCoords = [];
  const normals = [];

  const vertexData = [];
  const normalData = [];
  const texCoordData = [];
  const lines = objText.split("\n");

  let xmin = Infinity;
  let ymin = Infinity;
  let zmin = Infinity;
  let xmax = -Infinity;
  let ymax = -Infinity;
  let zmax = -Infinity;

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    const type = parts[0];

    if (type === "v") {
      const vert = parts.slice(1).map(Number);
      const [x, y, z] = vert;
      xmin = Math.min(x, xmin);
      ymin = Math.min(y, ymin);
      zmin = Math.min(z, zmin);
      xmax = Math.max(x, xmax);
      ymax = Math.max(y, ymax);
      zmax = Math.max(z, zmax);
      vertices.push(vert);
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
  let xmean = ((xmin + xmax) / 2).toFixed(2);
  let ymean = ((ymin + ymax) / 2).toFixed(2);
  let zmean = ((zmin + zmax) / 2).toFixed(2);
  xmin = xmin.toFixed(2);
  ymin = ymin.toFixed(2);
  zmin = zmin.toFixed(2);
  xmax = xmax.toFixed(2);
  ymax = ymax.toFixed(2);
  zmax = zmax.toFixed(2);
  console.log(`
    Obj file range: [${xmin}, ${ymin}, ${zmin} -> ${xmax}, ${ymax}, ${zmax}]
    Obj file center: [${xmean}, ${ymean}, ${zmean}]
    Vertex count: ${vertexData.length}
    `);
  return {
    vertices: new Float32Array(vertexData.flat()),
    normals: new Float32Array(normalData.flat()),
    texCoords: new Float32Array(texCoordData.flat()),
    vertexCount: vertexData.length,
    min: [xmin, ymin, zmin],
    max: [xmax, ymax, zmax],
    mean: [xmean, ymean, zmean],
  };
};
