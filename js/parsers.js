export const parseObj = (objText) => {
  const objPositions = [[0, 0, 0]];
  const objTexCoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  const objVertexData = [objPositions, objTexCoords, objNormals];

  console.log(objVertexData);

  let webglVertexData = [
    [], // positions
    [], // texcoords
    [], // normals
  ];
};
/*
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
    const parts = line.trim().split(/\s+/); // split by spaces, tabs, whitespaces
    const type = parts[0];

    if (type === "v") {
      vertices.push(...parts.slice(1).map(Number));
      // } else if (type === "vt") {
      //   texCoords.push(...parts.slice(1).map(Number));
      // } else if (type === "vn") {
      //   normals.push(...parts.slice(1).map(Number));
    } else if (type === "f") {
      for (let i = 1; i <= 4; i++) {
        // console.log(parts[i]);
        const [vIndex, vtIndex, vnIndex] = parts[i]
          .split("/")
          .map((idx) => parseInt(idx) - 1);
        // console.log(`${vIndex} :: ${vtIndex} :: ${vnIndex}`);

        indices.push(vertexData.length / 3);
        vertexData.push(
          vertices[vIndex * 3],
          vertices[vIndex * 3 + 1],
          vertices[vIndex * 3 + 2]
        );

        // if (vtIndex !== undefined) {
        //   texCoordData.push(texCoords[vtIndex * 2], texCoords[vtIndex * 2 + 1]);
        // }

        // if (vnIndex !== undefined) {
        //   normalData.push(
        //     normals[vnIndex * 3],
        //     normals[vnIndex * 3 + 1],
        //     normals[vnIndex * 3 + 2]
        //   );
        // }
      }
      // console.log("---");
    }
  }
  console.log(vertices);
  return {
    vertices: new Float32Array(vertexData),
    normals: new Float32Array(normalData),
    texCoords: new Float32Array(texCoordData),
    indices: new Uint16Array(indices),
  };
};
*/
