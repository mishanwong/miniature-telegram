export const parseObj = (objText) => {
  const objData = {};

  const vertices = [];
  const texCoords = [];
  const normals = [];

  let vertexData = [];
  let normalData = [];
  let texCoordData = [];
  const lines = objText.split("\n");

  let currentGroup;

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
    } else if (type === "usemtl") {
      const group = parts.slice(1)[0];
      if (group !== currentGroup) {
        if (currentGroup) {
          objData[currentGroup] = {
            vertices: vertexData.flat(),
            normals: normalData.flat(),
            texCoords: texCoordData.flat(),
          };
          vertexData = [];
          normalData = [];
          texCoordData = [];
        }
        currentGroup = group;
      }
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
  objData[currentGroup] = {
    vertices: vertexData.flat(),
    normals: normalData.flat(),
    texCoords: texCoordData.flat(),
  };
  return { objData };
};

export const parseMtl = (mtlText) => {
  const material = {};
  let currentMaterial;

  const lines = mtlText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip comments and blank lines
    if (line === "" || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    const attribute = parts[0];
    const data = parts.slice(1);
    if (attribute === "newmtl") {
      material[data] = {};
      currentMaterial = data[0];
    } else {
      switch (attribute) {
        case "Ns":
          material[currentMaterial]["Ns"] = parseFloat(data[0]);
        case "Ka":
          material[currentMaterial]["Ka"] = data.map(Number);
        case "Kd":
          material[currentMaterial]["Kd"] = data.map(Number);
        case "Ks":
          material[currentMaterial]["Ks"] = data.map(Number);
        case "illum":
          material[currentMaterial]["illum"] = parseInt(data[0]);
      }
    }
  }
  return material;
};
