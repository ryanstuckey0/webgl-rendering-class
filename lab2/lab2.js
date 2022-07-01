/*
 * CSE 5542 - Lab 2
 * By Ryan Stuckey
 * On 10/3/2021
 */

const SCALE_INTERVAL = 0.1;
const TRANSLATION_INTERVAL = 0.05;
const ROTATION_INTERVAL = 10; // degrees

var gl;
var shaderProgram;

var specialShapeActive = false;

var CurrentColor = "r";
var VertexColorBufferDict = { r: -1, g: -1, b: -1 };

var CurrentShape = ""; // options include p, l, t, or q for point, line, triangle, or quad, respectively
var ShapeCodes = ["p", "l", "t", "q"];

var ShapeInfoDictionary = {
  p: {
    glMode: -1,
    buffer: -1,
    transformations: [],
    colors: [],
    count: 0,
  },
  l: {
    glMode: -1,
    buffer: -1,
    transformations: [],
    colors: [],
    count: 0,
  },
  t: {
    glMode: -1,
    buffer: -1,
    transformations: [],
    colors: [],
    count: 0,
  },
  q: {
    glMode: -1,
    buffer: -1,
    transformations: [],
    colors: [],
    count: 0,
  },
};

// Initialization Functions ---------------------------------------------------

function webGLStart() {
  console.log("starting webGL");
  var canvas = document.getElementById("lab2-canvas");
  initGL(canvas);
  initGlShapeCodes();
  initShaders();
  initBuffers();
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

function initBuffers() {
  var pointVertices = [0.0, 0.0, 0.0];
  ShapeInfoDictionary.p.buffer = createBuffer(pointVertices, 1);

  var lineVertices = [-0.1, -0.1, 0.0, 0.1, 0.1, 0.0];
  ShapeInfoDictionary.l.buffer = createBuffer(lineVertices, 2);

  var triangleVertices = [-0.1, -0.1, 0.0, 0.1, -0.1, 0.0, 0.0, 0.0732, 0.0];
  ShapeInfoDictionary.t.buffer = createBuffer(triangleVertices, 3);

  var squareVertices = [
    -0.1, -0.1, 0.0, 0.1, -0.1, 0.0, 0.1, 0.1, 0.0, -0.1, -0.1, 0.0, 0.1, 0.1,
    0.0, -0.1, 0.1, 0.0,
  ];
  ShapeInfoDictionary.q.buffer = createBuffer(squareVertices, 6);

  var colorVertices = [
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
  ];
  VertexColorBufferDict.r = createBuffer(colorVertices, 1);

  var colorVertices = [
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
  ];
  VertexColorBufferDict.g = createBuffer(colorVertices, 1);

  var colorVertices = [
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
  ];
  VertexColorBufferDict.b = createBuffer(colorVertices, 1);
}

function initGlShapeCodes() {
  ShapeInfoDictionary.p.glMode = gl.POINTS;
  ShapeInfoDictionary.l.glMode = gl.LINES;
  ShapeInfoDictionary.t.glMode = gl.TRIANGLES;
  ShapeInfoDictionary.q.glMode = gl.TRIANGLES;
}

// Handle Input ---------------------------------------------------------------

function onKeyDown(event) {
  switch (event.keyCode) {
    case 80: // draw point
      addNewShape("p");
      break;
    case 76: // draw line
      addNewShape("l");
      break;
    case 84: // draw triangle
      addNewShape("t");
      break;
    case 81: // draw square
      addNewShape("q");
      break;
    case 87: // move up
      translateShape([0, TRANSLATION_INTERVAL, 0]);
      break;
    case 68: // move right
      translateShape([TRANSLATION_INTERVAL, 0, 0]);
      break;
    case 83: // move down
      translateShape([0, -TRANSLATION_INTERVAL, 0]);
      break;
    case 65: // move left
      translateShape([-TRANSLATION_INTERVAL, 0, 0]);
      break;
    case 69: // scale shape
      if (event.shiftKey) scaleShape(parseFloat(1 + SCALE_INTERVAL));
      else scaleShape(parseFloat(1 - SCALE_INTERVAL));
      break;
    case 82: // change to red (r) or rotate (R)
      if (event.shiftKey) rotateShape(ROTATION_INTERVAL);
      else CurrentColor = "r";
      break;
    case 71: // change to green
      CurrentColor = "g";
      break;
    case 66: // change to blue
      CurrentColor = "b";
      break;
    case 79:
      generateSpecialShape();
      specialShapeActive = true;
      break;
    case 67: // clear
      clearViewport();
      break;
    default:
      break;
  }
  redrawScene();
  if(specialShapeActive) drawSpecialShape();
}

// Transformation Functions ---------------------------------------------------

function rotateShape(rotation) {
  if (specialShapeActive) rotateSpecialShape(rotation);
  if (CurrentShape == "") return;
  var shapeCount = ShapeInfoDictionary[CurrentShape].count;
  var matrix =
    ShapeInfoDictionary[CurrentShape].transformations[shapeCount - 1];
  ShapeInfoDictionary[CurrentShape].transformations[shapeCount - 1] =
    mat4.rotate(matrix, degToRad(rotation), [0, 0, 1]);
}

function translateShape(translation) {
  if (specialShapeActive) translateSpecialShape(translation);
  if (CurrentShape == "") return;
  var shapeCount = ShapeInfoDictionary[CurrentShape].count;
  var matrix =
    ShapeInfoDictionary[CurrentShape].transformations[shapeCount - 1];
  ShapeInfoDictionary[CurrentShape].transformations[shapeCount - 1] =
    mat4.translate(matrix, translation);
}

function scaleShape(scale) {
  if (specialShapeActive) scaleSpecialShape(scale);
  if (CurrentShape == "") return;

  var shapeCount = ShapeInfoDictionary[CurrentShape].count;
  var matrix =
    ShapeInfoDictionary[CurrentShape].transformations[shapeCount - 1];
  ShapeInfoDictionary[CurrentShape].transformations[shapeCount - 1] =
    mat4.scale(matrix, [scale, scale, scale]);
}

// Shape Creation Functions ---------------------------------------------------

function addNewShape(shapeCode) {
  CurrentShape = shapeCode;
  ShapeInfoDictionary[shapeCode].count++;
  pushMatrix(ShapeInfoDictionary[shapeCode].transformations);
  ShapeInfoDictionary[shapeCode].colors.push(CurrentColor);
}

// Drawing Functions ----------------------------------------------------------

function redrawScene() {
  console.log("redrawing scene");
  drawScene();
  for (var i = 0; i < ShapeCodes.length; i++) drawShapes(ShapeCodes[i]);
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

function drawShapes(shapeCode) {
  var shapeDict = ShapeInfoDictionary[shapeCode];
  gl.bindBuffer(gl.ARRAY_BUFFER, shapeDict.buffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    shapeDict.buffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  for (var i = 0; i < shapeDict.count; i++) {
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexColorBufferDict[shapeDict.colors[i]]);
    gl.vertexAttribPointer(
      shaderProgram.vertexColorAttribute,
      VertexColorBufferDict[shapeDict.colors[i]].itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.uniformMatrix4fv(
      shaderProgram.mvMatrixUniform,
      false,
      shapeDict.transformations[i]
    );

    gl.drawArrays(shapeDict.glMode, 0, shapeDict.buffer.numItems);
  }
}

function clearViewport() {
  console.log("clearing viewport");

  CurrentShape = "";
  specialShapeActive = false;
  resetShapeDict();
  drawScene();
}

// Utility Functions -----------------------

function createBuffer(vertices, numItems) {
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  vertexBuffer.itemSize = 3; // size of each item- 6 because each vertex has x, y, z, r, g, b
  vertexBuffer.numAttributeFloats = 3; // number of floats per attribute
  vertexBuffer.numItems = numItems; // total number of items in list

  return vertexBuffer;
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function pushMatrix(matrixArray) {
  matrixArray.push(mat4.identity(mat4.create()));
}

function resetShapeDict() {
  for (var i = 0; i < ShapeCodes.length; i++) {
    ShapeInfoDictionary[ShapeCodes[i]].transformations = [];
    ShapeInfoDictionary[ShapeCodes[i]].colors = [];
    ShapeInfoDictionary[ShapeCodes[i]].count = 0;
  }
}
