var worldObjects = [];

// Manipulating World Objects -------------------------------------------------

function addChildWorldObject(parent, child) {
  parent.children.push(child);
  child.parent = parent;
}

function getWorldObjectModelMatrix(worldObject) {
  if (worldObject == null) return mat4.identity(mat4.create());
  let matrix = mat4.multiply(
    getWorldObjectModelMatrix(worldObject.parent),
    worldObject.modelMatrix
  );
  matrix = mat4.scale(matrix, worldObject.scale);
  return matrix;
}

function translateWorldObject(worldObject, translationVec3) {
  worldObject.modelMatrix = mat4.translate(
    worldObject.modelMatrix,
    translationVec3
  );
}

function rotateWorldObject(worldObject, degrees, axisVec3) {
  worldObject.modelMatrix = mat4.rotate(
    worldObject.modelMatrix,
    degToRad(degrees),
    axisVec3
  );
}

function scaleWorldObject(worldObject, scaleVec3) {
  worldObject.scale = scaleVec3;
}

// Creating new world objects -------------------------------------------------

function createNewWorldObject(
  worldObjectName,
  empty = false,
  mesh,
  color = "random",
  dividedColors = false
) {
  if (empty) {
    return {
      name: worldObjectName,
      empty: true,
      scale: [1, 1, 1],
      modelMatrix: mat4.identity(mat4.create()),
      children: [],
      parent: null,
    };
  }

  // get random colors for each vertex
  let vertexColors = [];
  if (dividedColors)
    vertexColors = getDividedColor(mesh.vertices.length, color);
  else {
    for (let i = 0; i < mesh.vertices.length; i++)
      vertexColors[i] =
        color == "random"
          ? Math.random()
          : color.length == 1
          ? color[0][i % 3]
          : color[i];
  }
  return {
    name: worldObjectName,
    empty: false,
    vertexPositionBuffer: createVertexBuffer(mesh.vertices),
    vertexColorsBuffer: createVertexBuffer(vertexColors),
    triangleIndicesBuffer: createTriangleIndicesBuffer(mesh.triangles),
    modelMatrix: mat4.identity(mat4.create()),
    scale: [1, 1, 1],
    children: [],
    parent: null,
    numVertices: mesh.vertices.length / 3,
    numTriangles: mesh.triangles.length / 3,
  };
}

function createVertexBuffer(vertices) {
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  vertexBuffer.itemSize = 3; // size of each item- 6 because each vertex has x, y, z, r, g, b
  vertexBuffer.numItems = vertices.length / 3; // total number of items in list; # of coords / 3 coords per item

  return vertexBuffer;
}

function createTriangleIndicesBuffer(indices) {
  let indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  indicesBuffer.numItems = indices.length; // total number of items in list

  return indicesBuffer;
}

// Drawing functions ----------------------------------------------------------

function drawWorldObject(worldObject) {
  if (!worldObject.empty) drawVertices(worldObject);
  worldObject.children.forEach((child) => drawWorldObject(child));
}

function drawVertices(worldObject) {
  // bind position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, worldObject.vertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    worldObject.vertexPositionBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  // bind color buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, worldObject.vertexColorsBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexColorAttribute,
    worldObject.vertexColorsBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  // set model-view matrix
  let modelViewMatrix = mat4.identity(mat4.create());
  modelViewMatrix = mat4.multiply(
    viewMatrix,
    getWorldObjectModelMatrix(worldObject),
    modelViewMatrix
  );
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, modelViewMatrix);

  // set projection matrix
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix);

  // bind triangles buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, worldObject.triangleIndicesBuffer);

  // gl draw elements
  gl.drawElements(
    gl.TRIANGLES,
    worldObject.triangleIndicesBuffer.numItems,
    gl.UNSIGNED_SHORT,
    0
  );
}
