var worldObjects = [];
var lightWorldObject;

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

function createNewWorldObject(worldObjectName, mesh, empty = false) {
  if (empty) {
    return {
      name: worldObjectName,
      empty: true,
      scale: [1, 1, 1],
      modelMatrix: mat4.identity(mat4.create()),
      children: [],
      parent: null,
      light: null,
    };
  }

  return {
    name: worldObjectName,
    empty: false,
    vertexPositionBuffer: createVertexBuffer(mesh.vertices),
    triangleIndicesBuffer: createTriangleIndicesBuffer(mesh.triangles),
    material: getMaterial(),
    modelMatrix: mat4.identity(mat4.create()),
    scale: [1, 1, 1],
    children: [],
    parent: null,
    light: null,
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

function getMaterial() {
  return {
    ambient: [0.4, 0.4, 0],
    diffuse: [1, 1, 0], // color
    specular: [0.6, 0.6, 0.6],
    shininess: 1,
  };
}

function getLight() {
  return {
    ambient: [0.5, 0.5, 0.5],
    diffuse: [0.8, 0.8, 0.8],
    specular: [0.5, 0.5, 0.5],
  };
}

// Drawing functions ----------------------------------------------------------

function drawWorldObject(worldObject, light) {
  if (!worldObject.empty) drawVertices(worldObject, light);
  worldObject.children.forEach((child) => drawWorldObject(child, light));
}

function drawVertices(worldObject, light) {
  let modelMatrix = getWorldObjectModelMatrix(worldObject);
  let modelViewMatrix = mat4.identity(mat4.create());
  modelViewMatrix = mat4.multiply(viewMatrix, modelMatrix, modelViewMatrix);

  // 1. bind position buffer ------------------
  gl.bindBuffer(gl.ARRAY_BUFFER, worldObject.vertexPositionBuffer);
  gl.vertexAttribPointer(
    shaders.activeShader.aVertexPosition,
    worldObject.vertexPositionBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  // 2. bind color buffer ------------------
  // not used

  // 3. bind materials uniforms ------------
  if (shaders.activeShader.uMaterialAmbient != null)
    gl.uniform3fv(
      shaders.activeShader.uMaterialAmbient,
      worldObject.material.ambient
    );
  if (shaders.activeShader.uMaterialDiffuse != null)
    gl.uniform3fv(
      shaders.activeShader.uMaterialDiffuse,
      worldObject.material.diffuse
    );
  if (shaders.activeShader.uMaterialSpecular != null)
    gl.uniform3fv(
      shaders.activeShader.uMaterialSpecular,
      worldObject.material.specular
    );
  if (shaders.activeShader.uMaterialShininess != null)
    gl.uniform1f(
      shaders.activeShader.uMaterialShininess,
      1.0 / worldObject.material.shininess
    );

  // 4. bind normals buffer ----------------
  if (shaders.activeShader.aVertexNormal != -1) {
    gl.bindBuffer(gl.ARRAY_BUFFER, worldObject.vertexPositionBuffer);
    gl.vertexAttribPointer(
      shaders.activeShader.aVertexNormal,
      worldObject.vertexPositionBuffer.itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // 5. bind triangles buffer --------------
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, worldObject.triangleIndicesBuffer);

  // 6. Set matrix uniforms ----------------
  // i. projection matrix
  if (shaders.activeShader.uProjectionMatrix != null)
    gl.uniformMatrix4fv(
      shaders.activeShader.uProjectionMatrix,
      false,
      projectionMatrix
    );

  // ii. model-view matrix
  if (shaders.activeShader.uModelViewMatrix != null)
    gl.uniformMatrix4fv(
      shaders.activeShader.uModelViewMatrix,
      false,
      modelViewMatrix
    );

  // 7. Set light uniforms -----------------
  if (shaders.activeShader.uLightPosition != null)
    gl.uniform3fv(shaders.activeShader.uLightPosition, light.position);

  if (shaders.activeShader.uLightAmbient != null)
    gl.uniform3fv(
      shaders.activeShader.uLightAmbient,
      ambientOn ? light.ambient : [0, 0, 0]
    );

  if (shaders.activeShader.uLightDiffuse != null)
    gl.uniform3fv(
      shaders.activeShader.uLightDiffuse,
      diffuseOn ? light.diffuse : [0, 0, 0]
    );

  if (shaders.activeShader.uLightSpecular != null)
    gl.uniform3fv(
      shaders.activeShader.uLightSpecular,
      specularOn ? light.specular : [0, 0, 0]
    );

  // gl draw elements
  gl.drawElements(
    gl.TRIANGLES,
    worldObject.triangleIndicesBuffer.numItems,
    gl.UNSIGNED_SHORT,
    0
  );
}
