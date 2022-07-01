const RESOLUTION = 20;
const RADIUS = 1;
const SCALE = 1;
const HEIGHT = 1;

function CreateNewSphere(
  worldObjectName = "none",
  color = "random",
  dividedColors = false,
  radius = RADIUS
) {
  return createNewWorldObject(
    worldObjectName,
    false,
    GenerateSphereMesh(RESOLUTION, RESOLUTION, radius),
    color,
    dividedColors
  );
}

function CreateNewCube(
  worldObjectName = "none",
  color = "random",
  dividedColors = false,
  scale = SCALE
) {
  return createNewWorldObject(
    worldObjectName,
    false,
    GenerateCubeMesh(scale),
    color,
    dividedColors
  );
}

function CreateNewCylinder(
  worldObjectName = "none",
  color = "random",
  dividedColors = false,
  height = HEIGHT,
  radius = RADIUS
) {
  return createNewWorldObject(
    worldObjectName,
    false,
    GenerateCylinderMesh(RESOLUTION, radius, height),
    color,
    dividedColors
  );
}

function CreateNewCone(
  worldObjectName = "none",
  color = "random",
  dividedColors = false,
  radius = RADIUS,
  height = HEIGHT
) {
  return createNewWorldObject(
    worldObjectName,
    false,
    GenerateConeMesh(RESOLUTION, radius, height),
    color,
    dividedColors
  );
}

function CreateNewTetrahedron(
  worldObjectName = "none",
  color = "random",
  dividedColors = false,
  scale = SCALE
) {
  return createNewWorldObject(
    worldObjectName,
    false,
    GenerateTetrahedronMesh(scale),
    color,
    dividedColors
  );
}

// Mesh Generation Functions --------------------------------------------------

function GenerateSphereMesh(numVerticalLines, numHorizontalLines, radius) {
  let numVertices = (numHorizontalLines - 1) * numVerticalLines + 2;

  let vertices = [];
  let triangles = [];

  // add center top point
  vertices[0] = 0;
  vertices[1] = radius;
  vertices[2] = 0;

  // add center bottom point
  vertices[numVertices * 3 - 3] = 0;
  vertices[numVertices * 3 - 2] = -radius;
  vertices[numVertices * 3 - 1] = 0;

  let v = 3,
    t = 0,
    y,
    phi,
    theta;
  for (let i = 1; i <= numHorizontalLines; i++) {
    if (i < numHorizontalLines) {
      // create vertices
      phi = (i / numHorizontalLines) * Math.PI;
      y = Math.cos(phi) * radius;
      for (let j = 0; j < numVerticalLines; j++) {
        theta = (j / numVerticalLines) * 2 * Math.PI;

        vertices[v++] = Math.sin(phi) * Math.cos(theta) * radius; // x
        vertices[v++] = y; // y
        vertices[v++] = Math.sin(phi) * Math.sin(theta) * radius; // z
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
    vertices,
    triangles,
  };
}

function GenerateCylinderMesh(numVerticalLines, radius, height) {
  let vertices = [];
  let triangles = [];

  let x,
    y,
    z,
    theta,
    v = 0,
    t = 0;
  y = height / 2;
  for (let i = 0; i < numVerticalLines; i++) {
    // create vertices
    theta = (i / numVerticalLines) * 2 * Math.PI;
    x = radius * Math.cos(theta);
    z = radius * Math.sin(theta);

    vertices[v++] = x;
    vertices[v++] = y;
    vertices[v++] = z;

    vertices[v++] = x;
    vertices[v++] = -y;
    vertices[v++] = z;

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
    vertices,
    triangles,
  };
}

function GenerateTetrahedronMesh(scale) {
  let vertices = [],
    triangles = [],
    v = 0,
    t = 0;

  vertices[v++] = 0 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = 0.43301 * scale;

  vertices[v++] = 0.43301 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = -0.43301 * scale;

  vertices[v++] = -0.43301 * scale;
  vertices[v++] = -0.5 * scale;
  vertices[v++] = -0.43301 * scale;

  vertices[v++] = 0 * scale;
  vertices[v++] = 0.5 * scale;
  vertices[v++] = 0 * scale;

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
    vertices,
    triangles,
  };
}

function GenerateConeMesh(numVerticalLines, radius, height) {
  let numVertices = numVerticalLines + 2,
    vertices = [],
    triangles = [],
    v = 0,
    t = 0;

  // top point
  vertices[v++] = 0;
  vertices[v++] = height / 2;
  vertices[v++] = 0;

  // bottom point
  vertices[numVertices * 3 - 3] = 0;
  vertices[numVertices * 3 - 2] = -height / 2;
  vertices[numVertices * 3 - 1] = 0;

  let y = -height / 2,
    theta;
  for (let i = 0; i < numVerticalLines; i++) {
    theta = (i / numVerticalLines) * 2 * Math.PI;

    vertices[v++] = radius * Math.cos(theta);
    vertices[v++] = y;
    vertices[v++] = radius * Math.sin(theta);

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
    vertices,
    triangles,
  };
}

function GenerateCubeMesh(scale) {
  let vertices = [],
    triangles = [],
    v = 0,
    t = 0;

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
    vertices,
    triangles,
  };
}
