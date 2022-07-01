/*
 * CSE 5542 - Lab 2
 * By Ryan Stuckey
 * On 10/3/2021
 *
 * This file creates the special shape, which can be viewed by pressing O on the keyboard. To make
 * the shape transform as desired, I had to actually store the position of each vertex in the buffer
 * instead of storing the position in a matrix like I did for the first part of the lab. The reason this is
 * is because we want the shape to act as one when transforming it (i.e., it all rotates/scales together).
 * To do this, I needed to use one matrix for the entire shape instead of one matrix per vertex.
 */

var generated = false;

var SpecialShapeInfo = {
  p: {
    vertices: [],
    count: 0,
  },
  l: {
    vertices: [],
    count: 0,
  },
  t: {
    vertices: [],
    count: 0,
  },
};

var specialShapeMatrix; // apply global matrix to all vertices

function initSpecialShapeInfo() {
  var shapeCodes = ["p", "l", "t"];
  for (var i = 0; i < 3; i++) {
    SpecialShapeInfo[shapeCodes[i]].vertices = [];
    SpecialShapeInfo[shapeCodes[i]].count = 0;
  }
}

function generateSpecialShape() {
  clearViewport();
  initSpecialShapeInfo();
  specialShapeMatrix = mat4.identity(mat4.create());

  // cloud 1
  createNewSquare([-0.75, 0.75, 0], 0, 1, "b", 0, 1, "b");
  createNewSquare([-0.65, 0.8, 0], 0, 1, "b");
  createNewSquare([-0.7, 0.65, 0], 0, 1, "b");
  createNewSquare([-0.55, 0.85, 0], 0, 1, "b");
  createNewSquare([-0.5, 0.7, 0], 0, 1, "b");
  createNewSquare([-0.4, 0.6, 0], 0, 1, "b");
  createNewSquare([-0.35, 0.75, 0], 0, 1.5, "b");
  createNewSquare([-0.25, 0.85, 0], 0, 0.75, "b");
  createNewSquare([-0.15, 0.75, 0], 0, 0.75, "b");

  // cloud 2
  createNewSquare([0.75, 0.5, 0], 0, 1, "b");
  createNewSquare([0.65, 0.55, 0], 0, 1, "b");
  createNewSquare([0.7, 0.4, 0], 0, 1, "b");
  createNewSquare([0.55, 0.6, 0], 0, 1, "b");
  createNewSquare([0.5, 0.45, 0], 0, 1, "b");
  createNewSquare([0.4, 0.35, 0], 0, 1, "b");
  createNewSquare([0.35, 0.5, 0], 0, 1.5, "b");
  createNewSquare([0.25, 0.6, 0], 0, 0.75, "b");
  createNewSquare([0.15, 0.5, 0], 0, 0.75, "b");

  // lightning 1
  createNewTriangle([-0.75, 0.55, 0], 45, 1, "r");
  createNewTriangle([-0.75, 0.45, 0], 65, 1, "r");
  createNewTriangle([-0.65, 0.35, 0], 65, 1.2, "r");
  createNewTriangle([-0.6, 0.25, 0], -55, 0.9, "r");
  createNewTriangle([-0.55, 0.15, 0], -75, 0.9, "r");
  createNewTriangle([-0.55, 0, 0], -75, 0.9, "r");

  // branch 1
  createNewTriangle([-0.65, -0.1, 0], -75, 0.9, "r");
  createNewTriangle([-0.75, -0.15, 0], 0, 0.8, "r");
  createNewTriangle([-0.85, -0.2, 0], 25, 1.3, "r");
  createNewTriangle([-0.85, -0.35, 0], 25, 1, "r");
  createNewTriangle([-0.9, -0.5, 0], 75, 0.65, "r");
  createNewTriangle([-0.95, -0.6, 0], 75, 0.9, "r");
  createNewTriangle([-0.97, -0.8, 0], 110, 1.4, "r");
  createNewTriangle([-0.98, -0.9, 0], -101, 0.9, "r");
  createNewTriangle([-0.98, -0.95, 0], -101, 1.1, "r");
  createNewTriangle([-0.85, -1.1, 0], 180, 1.4, "r");

  // explosion 1
  createNewPoint([-0.75, -0.94, 0], "g");
  createNewPoint([-0.7, -0.93, 0], "g");
  createNewPoint([-0.8, -0.935, 0], "g");
  createNewPoint([-0.72, -0.85, 0], "g");
  createNewPoint([-0.95, -0.7, 0], "g");
  createNewPoint([-0.95, -0.55, 0], "g");
  createNewPoint([-0.65, -0.75, 0], "g");
  createNewPoint([-0.76, -0.55, 0], "g");
  createNewPoint([-0.55, -0.45, 0], "g");
  createNewPoint([-0.45, -0.65, 0], "g");
  createNewPoint([-0.4, -0.3, 0], "g");
  createNewPoint([-0.98, -0.4, 0], "g");
  createNewPoint([-0.3, -0.75, 0], "g");
  createNewPoint([-0.35, -0.4, 0], "g");
  createNewPoint([-0.25, -0.65, 0], "g");

  // rain
  for (var i = 0; i < 500; i++) {
    createNewLine(
      [getRandomValue(-1, 1), getRandomValue(-1, 1), 0],
      15,
      getRandomValue(0.45, 1.1),
      "b"
    );
  }
}

function drawSpecialShape() {
  drawSpecialShapeVertexArrays(
    SpecialShapeInfo.p.vertices,
    SpecialShapeInfo.p.count,
    gl.POINTS
  );
  drawSpecialShapeVertexArrays(
    SpecialShapeInfo.l.vertices,
    SpecialShapeInfo.l.count * 2,
    gl.LINES
  );
  drawSpecialShapeVertexArrays(
    SpecialShapeInfo.t.vertices,
    SpecialShapeInfo.t.count * 3,
    gl.TRIANGLES
  );
}

function drawSpecialShapeVertexArrays(vertices, numVertices, glMode) {
  var vertexBuffer = createSpecialShapeBuffer(vertices, numVertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  var stride = vertexBuffer.itemSize * 4; // # of floats per items @ 4B per float
  var offset = 0;
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    vertexBuffer.numAttributeFloats,
    gl.FLOAT,
    false,
    stride,
    offset
  );

  offset = 3 * 4; // skip 3 vertex floats @ 4B per float
  gl.vertexAttribPointer(
    shaderProgram.vertexColorAttribute,
    vertexBuffer.numAttributeFloats,
    gl.FLOAT,
    false,
    stride,
    offset
  );

  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, specialShapeMatrix);

  gl.drawArrays(glMode, 0, vertexBuffer.numItems);
}

function createSpecialShapeBuffer(vertices, numItems) {
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  vertexBuffer.itemSize = 6; // size of each item- 6 because each vertex has x, y, z, r, g, b
  vertexBuffer.numAttributeFloats = 3; // number of floats per attribute
  vertexBuffer.numItems = numItems; // total number of items in list

  return vertexBuffer;
}

function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

function rotateSpecialShape(rotation) {
  specialShapeMatrix = mat4.rotate(
    specialShapeMatrix,
    degToRad(rotation),
    [0, 0, 1]
  );
}

function translateSpecialShape(translation) {
  specialShapeMatrix = mat4.translate(specialShapeMatrix, translation);
}

function scaleSpecialShape(scale) {
  specialShapeMatrix = mat4.scale(specialShapeMatrix, [scale, scale, scale]);
}

function createNewPoint(translation, color) {
  var matrix = getMatrix(translation, 0, 1);
  var pos = [mat4.multiplyVec3(matrix, [0, 0, 0])];
  SpecialShapeInfo.p.vertices.push(pos[0][0]);
  SpecialShapeInfo.p.vertices.push(pos[0][1]);
  SpecialShapeInfo.p.vertices.push(pos[0][2]);
  SpecialShapeInfo.p.vertices.push(getColor(color)[0]);
  SpecialShapeInfo.p.vertices.push(getColor(color)[1]);
  SpecialShapeInfo.p.vertices.push(getColor(color)[2]);
  SpecialShapeInfo.p.count++;
}

function createNewLine(translation, rotation, scale, color) {
  var matrix = getMatrix(translation, rotation, scale);
  var pos = [
    mat4.multiplyVec3(matrix, [-0.1, -0.1, 0.0]),
    mat4.multiplyVec3(matrix, [0.1, 0.1, 0.0]),
  ];
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 3; j++) SpecialShapeInfo.l.vertices.push(pos[i][j]);
    for (var j = 0; j < 3; j++)
      SpecialShapeInfo.l.vertices.push(getColor(color)[j]);
  }
  SpecialShapeInfo.l.count++;
}

function createNewTriangle(translation, rotation, scale, color) {
  var matrix = getMatrix(translation, rotation, scale);
  var pos = [
    mat4.multiplyVec3(matrix, [-0.1, -0.1, 0.0]),
    mat4.multiplyVec3(matrix, [0.1, -0.1, 0.0]),
    mat4.multiplyVec3(matrix, [0.0, 0.0732, 0.0]),
  ];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) SpecialShapeInfo.t.vertices.push(pos[i][j]);
    for (var j = 0; j < 3; j++)
      SpecialShapeInfo.t.vertices.push(getColor(color)[j]);
  }
  SpecialShapeInfo.t.count++;
}

function createNewSquare(translation, rotation, scale, color) {
  var matrix = getMatrix(translation, rotation, scale);
  var pos = [
    mat4.multiplyVec3(matrix, [-0.1, -0.1, 0.0]),
    mat4.multiplyVec3(matrix, [0.1, -0.1, 0.0]),
    mat4.multiplyVec3(matrix, [0.1, 0.1, 0.0]),
    mat4.multiplyVec3(matrix, [-0.1, -0.1, 0.0]),
    mat4.multiplyVec3(matrix, [0.1, 0.1, 0.0]),
    mat4.multiplyVec3(matrix, [-0.1, 0.1, 0.0]),
  ];
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 3; j++) SpecialShapeInfo.t.vertices.push(pos[i][j]);
    for (var j = 0; j < 3; j++)
      SpecialShapeInfo.t.vertices.push(getColor(color)[j]);
  }
  SpecialShapeInfo.t.count += 2;
}

function getColor(colorCode) {
  return [
    colorCode == "r" ? 1.0 : 0.0,
    colorCode == "g" ? 1.0 : 0.0,
    colorCode == "b" ? 1.0 : 0.0,
  ];
}

function getMatrix(translation, rotation, scale) {
  var matrix = mat4.identity(mat4.create());
  matrix = mat4.translate(matrix, translation);
  matrix = mat4.rotate(matrix, degToRad(rotation), [0, 0, 1]);
  matrix = mat4.scale(matrix, [scale, scale, scale]);
  return matrix;
}
