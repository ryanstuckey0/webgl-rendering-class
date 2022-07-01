const RESOLUTION = 20;
const RADIUS = 1;
const SCALE = 1;
const HEIGHT = 1;

// Mesh Generation Functions --------------------------------------------------

function GenerateSphereMesh(
  radius = RADIUS,
  numVerticalLines = RESOLUTION,
  numHorizontalLines = RESOLUTION
) {
  let numVertices = (numHorizontalLines - 1) * numVerticalLines + 2;

  let vertices = [];
  let triangles = [];
  let textureCoords = [];

  // add center top point
  vertices[0] = 0;
  vertices[1] = radius;
  vertices[2] = 0;

  textureCoords[0] = 0;
  textureCoords[1] = 0;

  // add center bottom point
  vertices[numVertices * 3 - 3] = 0;
  vertices[numVertices * 3 - 2] = -radius;
  vertices[numVertices * 3 - 1] = 0;

  textureCoords[numVertices * 2 - 2] = 1;
  textureCoords[numVertices * 2 - 1] = 1;

  let v = 3,
    t = 0,
    tx = 2,
    y,
    phi,
    theta,
    paramX,
    paramY;
  for (let i = 1; i <= numHorizontalLines; i++) {
    if (i < numHorizontalLines) {
      // create vertices
      paramY = i / numHorizontalLines;
      phi = paramY * Math.PI;
      y = Math.cos(phi) * radius;
      for (let j = 0; j < numVerticalLines; j++) {
        paramX = j / numVerticalLines;
        theta = paramX * 2 * Math.PI;

        vertices[v++] = Math.sin(phi) * Math.cos(theta) * radius; // x
        vertices[v++] = y; // y
        vertices[v++] = Math.sin(phi) * Math.sin(theta) * radius; // z

        textureCoords[tx++] = paramX;
        textureCoords[tx++] = paramY;
      }
    }

    // create triangles
    for (
      let j = (i - 1) * numVerticalLines + 1;
      j < i * numVerticalLines + 1;
      j++
    ) {
      let atEndOfRow = j % numVerticalLines == 0;
      if (i == 1) {
        // top of sphere, y = radius
        triangles[t++] = 0;
        triangles[t++] = atEndOfRow ? j - numVerticalLines + 1 : j + 1;
        triangles[t++] = j;
      } else if (i == numHorizontalLines) {
        // bottom of sphere, y = -radius
        triangles[t++] = numVertices - 1;
        triangles[t++] = j - numVerticalLines;
        triangles[t++] = atEndOfRow
          ? j - 2 * numVerticalLines + 1
          : j - numVerticalLines + 1;
      } else {
        // rows of triangles
        triangles[t++] = j - numVerticalLines;
        triangles[t++] = atEndOfRow ? j + 1 - numVerticalLines : j + 1;
        triangles[t++] = j;

        triangles[t++] = j - numVerticalLines;
        triangles[t++] = atEndOfRow
          ? j + 1 - 2 * numVerticalLines
          : j + 1 - numVerticalLines;
        triangles[t++] = atEndOfRow ? j + 1 - numVerticalLines : j + 1;
      }
    }
  }

  return {
    vertices: vertices,
    triangles: triangles,
    textureCoords: textureCoords,
    normals: vertices,
  };
}

function GenerateCylinderMesh(
  height = HEIGHT,
  radius = RADIUS,
  numVerticalLines = RESOLUTION
) {
  let numVertices = numVerticalLines * 2;

  let vertices = [],
    triangles = [],
    texCoords = [];

  let x,
    y = height / 2,
    z,
    paramX,
    theta,
    v = 0,
    t = 0,
    tx = 0;
  for (let i = 0; i < numVerticalLines; i++) {
    // create vertices
    paramX = i / numVerticalLines;
    theta = paramX * 2 * Math.PI;
    x = radius * Math.cos(theta);
    z = radius * Math.sin(theta);

    // top vertices
    vertices[v++] = x;
    vertices[v++] = y;
    vertices[v++] = z;

    texCoords[tx++] = paramX;
    texCoords[tx++] = 1.0;

    // bottom vertices
    vertices[v++] = x;
    vertices[v++] = -y;
    vertices[v++] = z;

    texCoords[tx++] = paramX;
    texCoords[tx++] = 0.0;

    // create triangles
    let onLastTriangles = i == numVerticalLines - 1;

    triangles[t++] = i * 2;
    triangles[t++] = i * 2 + 3 - (onLastTriangles ? numVerticalLines * 2 : 0);
    triangles[t++] = i * 2 + 1;

    triangles[t++] = i * 2;
    triangles[t++] = (i + 1) * 2 - (onLastTriangles ? numVerticalLines * 2 : 0);
    triangles[t++] = i * 2 + 3 - (onLastTriangles ? numVerticalLines * 2 : 0);
  }

  return {
    vertices: vertices,
    triangles: triangles,
    textureCoords: texCoords,
    normals: vertices,
  };
}

function GenerateTetrahedronMesh(scale = SCALE) {
  let vertices = [],
    triangles = [],
    texCoords = [],
    v = 0,
    t = 0,
    tx = 0;

  vertices[v++] = 0 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = 0.43301 * scale;

  texCoords[tx++] = 0.0;
  texCoords[tx++] = 0.0;

  vertices[v++] = 0.43301 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = -0.43301 * scale;

  texCoords[tx++] = 0.5;
  texCoords[tx++] = 0.0;

  vertices[v++] = -0.43301 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = -0.43301 * scale;

  texCoords[tx++] = 1.0;
  texCoords[tx++] = 0.0;

  // top point
  vertices[v++] = 0 * scale;
  vertices[v++] = 0.5 * scale;
  vertices[v++] = 0 * scale;

  texCoords[tx++] = 0.5;
  texCoords[tx++] = 1.0;

  // tri 1
  triangles[t++] = 1;
  triangles[t++] = 2;
  triangles[t++] = 3;

  // tri 2
  triangles[t++] = 2;
  triangles[t++] = 0;
  triangles[t++] = 3;

  // tri 3
  triangles[t++] = 0;
  triangles[t++] = 1;
  triangles[t++] = 3;

  // tri 4
  triangles[t++] = 1;
  triangles[t++] = 0;
  triangles[t++] = 2;

  return {
    vertices: vertices,
    triangles: triangles,
    textureCoords: texCoords,
    normals: vertices,
  };
}

function GenerateConeMesh(
  radius = RADIUS,
  height = HEIGHT,
  numVerticalLines = RESOLUTION
) {
  let numVertices = numVerticalLines + 2,
    vertices = [],
    triangles = [],
    texCoords = [],
    v = 0,
    t = 0,
    tx = 0;

  // top point
  vertices[v++] = 0;
  vertices[v++] = height / 2;
  vertices[v++] = 0;

  texCoords[tx++] = 0.5;
  texCoords[tx++] = 1.0;

  // bottom point
  vertices[numVertices * 3 - 3] = 0;
  vertices[numVertices * 3 - 2] = -height / 2;
  vertices[numVertices * 3 - 1] = 0;

  texCoords[tx++] = 0.5;
  texCoords[tx++] = 0;

  let y = -height / 2,
    theta,
    paramX;
  for (let i = 0; i < numVerticalLines; i++) {
    paramX = i / numVerticalLines;
    theta = paramX * 2 * Math.PI;

    vertices[v++] = radius * Math.cos(theta);
    vertices[v++] = y;
    vertices[v++] = radius * Math.sin(theta);

    texCoords[tx++] = paramX;
    texCoords[tx++] = 0;

    let onLastTriangle = i == numVerticalLines - 1;

    // main face triangle
    triangles[t++] = 0;
    triangles[t++] = i + 2 - (onLastTriangle ? numVerticalLines : 0);
    triangles[t++] = i + 1;

    // bottom circle triangle
    triangles[t++] = numVertices - 1;
    triangles[t++] = i + 1;
    triangles[t++] = i + 2 - (onLastTriangle ? numVerticalLines : 0);
  }

  return {
    vertices: vertices,
    triangles: triangles,
    textureCoords: texCoords,
    normals: vertices,
  };
}

function GenerateCubeMesh(scale = SCALE) {
  let vertices = [],
    triangles = [],
    texCoords = [],
    v = 0,
    t = 0,
    tx = 0;

  // top vertices @ y = 0.5f
  vertices[v++] = -0.5 * scale;
  vertices[v++] = 0.5 * scale;
  vertices[v++] = 0.5 * scale;

  vertices[v++] = 0.5 * scale;
  vertices[v++] = 0.5 * scale;
  vertices[v++] = 0.5 * scale;

  vertices[v++] = 0.5 * scale;
  vertices[v++] = 0.5 * scale;
  vertices[v++] = -0.5 * scale;

  vertices[v++] = -0.5 * scale;
  vertices[v++] = 0.5 * scale;
  vertices[v++] = -0.5 * scale;

  texCoords[tx++] = 0.0;
  texCoords[tx++] = 0.0;

  texCoords[tx++] = 0.0;
  texCoords[tx++] = 1.0;

  texCoords[tx++] = 1.0;
  texCoords[tx++] = 1.0;

  texCoords[tx++] = 1.0;
  texCoords[tx++] = 0.0;

  // bottom vertices @ y = -0.5f
  vertices[v++] = -0.5 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = 0.5 * scale;

  vertices[v++] = 0.5 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = 0.5 * scale;

  vertices[v++] = 0.5 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = -0.5 * scale;

  vertices[v++] = -0.5 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = -0.5 * scale;

  texCoords[tx++] = 0.0;
  texCoords[tx++] = 0.0;

  texCoords[tx++] = 0.0;
  texCoords[tx++] = 1.0;

  texCoords[tx++] = 1.0;
  texCoords[tx++] = 1.0;

  texCoords[tx++] = 1.0;
  texCoords[tx++] = 0.0;

  // triangles - top face
  triangles[t++] = 0;
  triangles[t++] = 2;
  triangles[t++] = 3;

  triangles[t++] = 0;
  triangles[t++] = 1;
  triangles[t++] = 2;

  // triangles - front face
  triangles[t++] = 3;
  triangles[t++] = 6;
  triangles[t++] = 7;

  triangles[t++] = 3;
  triangles[t++] = 2;
  triangles[t++] = 6;

  // triangles - right face
  triangles[t++] = 2;
  triangles[t++] = 5;
  triangles[t++] = 6;

  triangles[t++] = 2;
  triangles[t++] = 1;
  triangles[t++] = 5;

  // triangles - back face
  triangles[t++] = 1;
  triangles[t++] = 4;
  triangles[t++] = 5;

  triangles[t++] = 1;
  triangles[t++] = 0;
  triangles[t++] = 4;

  // triangles - left face
  triangles[t++] = 0;
  triangles[t++] = 7;
  triangles[t++] = 4;

  triangles[t++] = 0;
  triangles[t++] = 3;
  triangles[t++] = 7;

  // triangles - bottom face
  triangles[t++] = 7;
  triangles[t++] = 5;
  triangles[t++] = 4;

  triangles[t++] = 7;
  triangles[t++] = 6;
  triangles[t++] = 5;

  return {
    vertices: vertices,
    triangles: triangles,
    textureCoords: texCoords,
    normals: vertices,
  };
}

function GeneratorTrefoilMesh(
  torusRadius = 0.4,
  mainRadius = 1.2,
  resolution = 100,
  numSlices = 100
) {
  let vertices = [],
    triangles = [],
    normals = [],
    texCoords = [],
    v = 0,
    t = 0,
    n = 0,
    tx = 0,
    paramX,
    paramY,
    x,
    y,
    z,
    cx,
    cy,
    cz,
    phi,
    theta,
    t1,
    t2,
    t3,
    t4;
  for (let i = 0; i <= resolution; i++) {
    paramX = i / resolution;
    theta = paramX * 2 * Math.PI;
    cx = (Math.sin(theta) + 2 * Math.sin(2 * theta)) * mainRadius;
    cy = (Math.cos(theta) - 2 * Math.cos(2 * theta)) * mainRadius;
    cz = -Math.sin(3 * theta) * mainRadius;

    for (let j = 0; j <= numSlices; j++) {
      paramY = j / numSlices;
      phi = paramY * 2 * Math.PI;
      x = (Math.sin(theta) + 2 * Math.sin(2 * theta)) * (mainRadius + Math.cos(phi) * torusRadius);
      y = (Math.cos(theta) - 2 * Math.cos(2 * theta)) * (mainRadius + Math.cos(phi) * torusRadius);
      z = cz + Math.sin(phi) * torusRadius;

      vertices[v++] = x;
      vertices[v++] = y;
      vertices[v++] = z;

      texCoords[tx++] = paramX;
      texCoords[tx++] = paramY;

      normals[n++] = x - cx;
      normals[n++] = y - cy;
      normals[n++] = z - cz;
    }
  }

  for (let i = 0; i < resolution + numSlices; i++) {
    for (let j = 0; j < numSlices; j++) {
      t1 = i + j * numSlices;
      t2 = i + 1 + j * numSlices;
      t3 = i + (j + 1) * numSlices;
      t4 = i + 1 + (j + 1) * numSlices;

      triangles[t++] = t1;
      triangles[t++] = t3;
      triangles[t++] = t4;
      triangles[t++] = t1;
      triangles[t++] = t4;
      triangles[t++] = t2;
    }
  }

  return {
    vertices: vertices,
    triangles: triangles,
    textureCoords: texCoords,
    normals: normals,
  };
}
