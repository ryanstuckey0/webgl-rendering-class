/*
 * CSE 5542 - Lab 1
 * By Ryan Stuckey
 * On 9/15/2021
 */

var gl;
var shaderProgram;

var PointVertices = [];
var NumPoints = 0;

var LineVertices = [];
var NumLines = 0;

var TriangleVertices = [];
var NumTriangles = 0;

function webGLStart() {
  console.log("starting webGL");
  var canvas = document.getElementById("lab1-canvas");
  initGL(canvas);
  initShaders();
  gl.clearColor(0, 0, 0, 1.0);
  drawScene();

  document.addEventListener("keydown", onKeyDown, false);
}

function initGL(canvas) {
  console.log(
    "initializing WebGL on canvas:",
    canvas.id,
    "with width:",
    canvas.width,
    "and height:",
    canvas.height
  );
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.canvasWidth = canvas.width;
    gl.canvasHeight = canvas.height;
  } catch (e) {}
  if (!gl) alert("Could not initialize WebGL!");
}

function drawScene() {
  vpMinX = 0;
  vpMaxX = gl.canvasWidth;
  vpWidth = vpMaxX - vpMinX;
  vpMinY = 0;
  vpMaxY = gl.canvasHeight;
  vpHeight = vpMaxY - vpMinY;
  gl.viewport(vpMinX, vpMinY, vpWidth, vpHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

// Handle Input
function onKeyDown(event) {
  switch (event.keyCode) {
    case 80: // draw point
      addNewPoint();
      redrawScene();
      break;
    case 72: // draw horizontal line
      addNewHorizontalLine();
      redrawScene();
      break;
    case 86: // draw vertical line
      addNewVerticalLine();
      redrawScene();
      break;
    case 84: // draw triangle
      addNewTriangle();
      redrawScene();
      break;
    case 83: // draw square
      addNewSquare();
      redrawScene();
      break;
    case 67:
      clearViewport();
    default:
      break;
  }
}

function redrawScene() {
  drawScene();
  drawAllPoints();
  drawAllLines();
  drawAllTriangles();
}

function addNewPoint() {
  NumPoints++;
  PointVertices.push(getRandomValue(-1, 1), getRandomValue(-1, 1), 0);
  pushRandomColor(PointVertices);
}

function addNewHorizontalLine() {
  NumLines++;
  length = 0.25;
  x = getRandomValue(-1, 1 - length);
  y = getRandomValue(-1, 1);
  LineVertices.push(x, y, 0);
  pushRandomColor(LineVertices);
  LineVertices.push(x + length, y, 0);
  pushRandomColor(LineVertices);
}

function addNewVerticalLine() {
  NumLines++;
  length = 0.25;
  x = getRandomValue(-1, 1);
  y = getRandomValue(-1, 1 - length);
  LineVertices.push(x, y, 0);
  pushRandomColor(LineVertices);
  LineVertices.push(x, y + length, 0);
  pushRandomColor(LineVertices);
}

function addNewTriangle() {
  NumTriangles++;
  size = 0.25;
  x = getRandomValue(-1, 1 - size);
  y = getRandomValue(-1, 1 - size);
  TriangleVertices.push(x, y, 0);
  pushRandomColor(TriangleVertices);
  TriangleVertices.push(x, y + size, 0);
  pushRandomColor(TriangleVertices);
  TriangleVertices.push(x + size, y, 0);
  pushRandomColor(TriangleVertices);
}

function addNewSquare() {
  NumTriangles += 2;
  size = 0.25;
  x = getRandomValue(-1, 1 - size);
  y = getRandomValue(-1, 1 - size);
  corner1Color = getRandomColor();
  corner2Color = getRandomColor();

  // triangle 1
  TriangleVertices.push(x, y, 0); // bottom left corner
  pushRandomColor(TriangleVertices);
  TriangleVertices.push(x + size, y, 0); // bottom right corner
  TriangleVertices.push(corner1Color[0], corner1Color[1], corner1Color[2]);
  TriangleVertices.push(x, y + size, 0); // top left corner
  TriangleVertices.push(corner2Color[0], corner2Color[1], corner2Color[2]);

  // triangle 2
  TriangleVertices.push(x + size, y + size, 0); // top right corner
  pushRandomColor(TriangleVertices);
  TriangleVertices.push(x, y + size, 0); // top left corner
  TriangleVertices.push(corner2Color[0], corner2Color[1], corner2Color[2]);
  TriangleVertices.push(x + size, y, 0); // bottom right corner
  TriangleVertices.push(corner1Color[0], corner1Color[1], corner1Color[2]);
}

function drawAllPoints() {
  vertexBuffer = createBuffer(PointVertices, NumPoints);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  stride = vertexBuffer.itemSize * 4; // # of floats per items @ 4B per float
  offset = 0;
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

  gl.drawArrays(gl.POINTS, 0, NumPoints);
}

function drawAllLines() {
  vertexBuffer = createBuffer(LineVertices, NumLines * 2); // 2 vertex per line
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  stride = vertexBuffer.itemSize * 4;
  offset = 0;
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

  gl.drawArrays(gl.LINES, 0, vertexBuffer.numItems);
}

function drawAllTriangles() {
  vertexBuffer = createBuffer(TriangleVertices, NumTriangles * 3); // 3 vertex per triangle
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  stride = vertexBuffer.itemSize * 4;
  offset = 0;
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

  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numItems);
}

function clearViewport() {
  console.log("clearing viewport");

  NumPoints = 0;
  PointVertices = [];

  NumLines = 0;
  LineVertices = [];

  NumTriangles = 0;
  TriangleVertices = [];
  drawScene();
}

function createBuffer(vertices, numItems) {
  vertexBuffer = gl.createBuffer();
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

function pushRandomColor(vertexArray) {
  color = getRandomColor();
  vertexArray.push(color[0], color[1], color[2]);
  return color;
}

function getRandomColor() {
  minColorVal = 0;
  return [
    getRandomValue(minColorVal, 1),
    getRandomValue(minColorVal, 1),
    getRandomValue(minColorVal, 1),
  ];
}
