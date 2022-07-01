/*
 * CSE 5542 - Mini Lab 3
 * By Ryan Stuckey
 * On 10/14/2021
 */

const SCALE_INTERVAL = 0.05;
const TRANSLATION_INTERVAL = 0.025;
const ROTATION_INTERVAL = 5; // degrees

var gl;
var shaderProgram;

var mvMatrix;

var quadBuffer;
var triBuffer;
var axisBuffer;

var drawAxis = true;
var glDrawMode;

var activeTentacle = "t1";

// Initialization Functions ---------------------------------------------------

function webGLStart() {
  console.log("starting webGL");
  var canvas = document.getElementById("lab3-canvas");
  initGL(canvas);
  initShaders();

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.mvMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uMVMatrix"
  );
  shaderProgram.uColor = gl.getUniformLocation(shaderProgram, "uColor");

  initBuffers();
  gl.clearColor(0, 0, 0, 1.0);

  mvMatrix = mat4.create();
  mat4.identity(mvMatrix);

  glDrawMode = gl.TRIANGLE_FAN;

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
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {}
  if (!gl) alert("Could not initialize WebGL!");
}

function initBuffers() {
  var quadVertices = [-0.1, 0.1, 0, -0.1, -0.1, 0, 0.1, -0.1, 0, 0.1, 0.1, 0];
  quadBuffer = createBuffer(quadVertices, 4);

  var triVertices = [-0.1, -0.1, 0.0, 0.1, -0.1, 0.0, 0.0, 0.0732, 0.0];
  triBuffer = createBuffer(triVertices, 3);

  var axisVertices = [0, 0, 0, 0, 0.1, 0, 0, 0, 0, 0.1, 0, 0];
  axisBuffer = createBuffer(axisVertices, 2);
}

// Handle Input ---------------------------------------------------------------

function onKeyDown(event) {
  switch (event.keyCode) {
    case 87: // key W - move up
      mvMatrix = mat4.translate(mvMatrix, [0, TRANSLATION_INTERVAL, 0]);
      break;
    case 68: // key D - move right
      mvMatrix = mat4.translate(mvMatrix, [TRANSLATION_INTERVAL, 0, 0]);
      break;
    case 83: // key S - move down
      mvMatrix = mat4.translate(mvMatrix, [0, -TRANSLATION_INTERVAL, 0]);
      break;
    case 65: //  key A - move left
      mvMatrix = mat4.translate(mvMatrix, [-TRANSLATION_INTERVAL, 0, 0]);
      break;
    case 82: // key R - rotate
      if (event.shiftKey)
        mat4.rotate(mvMatrix, degToRad(ROTATION_INTERVAL), [0, 0, 1]);
      else mat4.rotate(mvMatrix, degToRad(-ROTATION_INTERVAL), [0, 0, 1]);
      break;
    case 70: // key F - scale
      if (event.shiftKey)
        mvMatrix = mat4.scale(mvMatrix, [
          1 + SCALE_INTERVAL,
          1 + SCALE_INTERVAL,
          0,
        ]);
      else
        mvMatrix = mat4.scale(mvMatrix, [
          1 - SCALE_INTERVAL,
          1 - SCALE_INTERVAL,
          0,
        ]);
      break;
    case 90: // key Z - rotate left eye
      if (event.shiftKey) transformations.e11.rotation += ROTATION_INTERVAL;
      else transformations.e11.rotation += -ROTATION_INTERVAL;
      break;
    case 88: // key X - rotate middle eye
      if (event.shiftKey) transformations.e21.rotation += ROTATION_INTERVAL;
      else transformations.e21.rotation += -ROTATION_INTERVAL;
      break;
    case 67: // key C - rotate right eye
      if (event.shiftKey) transformations.e31.rotation += ROTATION_INTERVAL;
      else transformations.e31.rotation += -ROTATION_INTERVAL;
      break;
    case 49: // Key 1 - set tentacle 1 to active
      activeTentacle = "t1";
      break;
    case 50: // Key 2 - set tentacle 2 to active
      activeTentacle = "t2";
      break;
    case 51: // Key 3 - set tentacle 3 to active
      activeTentacle = "t3";
      break;
    case 52: // Key 4 - set tentacle 4 to active
      activeTentacle = "t4";
      break;
    case 53: // Key 5 - set tentacle 5 to active
      activeTentacle = "t5";
      break;
    case 54: // Key 6 - set tentacle 6 to active
      activeTentacle = "t6";
      break;
    case 84: // Key T - rotate main tentacle
      if (event.shiftKey) rotateMainTentacle(ROTATION_INTERVAL);
      else rotateMainTentacle(-ROTATION_INTERVAL);
      break;
    case 89: // Key Y - rotate sub tentacle
      if (event.shiftKey) rotateSubTentacle(ROTATION_INTERVAL);
      else rotateSubTentacle(-ROTATION_INTERVAL);
      break;
    case 71: // Key G - rotate finger/foot 1
      if (event.shiftKey) rotateFingerFoot1(ROTATION_INTERVAL);
      else rotateFingerFoot1(-ROTATION_INTERVAL);
      break;
    case 72: // Key H - rotate finger 2
      if (event.shiftKey) rotateFingerFoot2(ROTATION_INTERVAL);
      else rotateFingerFoot2(-ROTATION_INTERVAL);
      break;
    case 69: // Key E - toggle axis visibility
      drawAxis = !drawAxis;
      break;
    case 81: // Key Q - switch draw mode
      switch (glDrawMode) {
        case gl.TRIANGLE_FAN:
          glDrawMode = gl.LINE_LOOP;
          break;
        case gl.LINE_LOOP:
          glDrawMode = gl.POINTS;
          break;
        case gl.POINTS:
          glDrawMode = gl.TRIANGLE_FAN;
          break;
      }
      break;
    case 86: // Key V - rotate neck
      if (event.shiftKey) transformations.neck.rotation += ROTATION_INTERVAL;
      else transformations.neck.rotation += -ROTATION_INTERVAL;
      break;
    case 66: // Key B - rotate head
      if (event.shiftKey) transformations.head.rotation += ROTATION_INTERVAL;
      else transformations.head.rotation += -ROTATION_INTERVAL;
      break;
  }
  drawScene();
}

// Drawing Functions ----------------------------------------------------------

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var modelMatrix = mat4.create();
  mat4.identity(modelMatrix);
  modelMatrix = mat4.multiply(modelMatrix, mvMatrix);

  var matrixStack = [];

  // draw main body
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.body,
    getColor("purple")
  );

  pushMatrix(matrixStack, modelMatrix); // start of branch neck

  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.neck,
    getColor("white")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.head,
    getColor("burgundy")
  );

  pushMatrix(matrixStack, modelMatrix); // start of branch e1

  // draw eye 1
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.e11,
    getColor("red")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.e12,
    getColor("blue")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch e1
  pushMatrix(matrixStack, modelMatrix); // start of branch e2

  // draw eye 2
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.e21,
    getColor("red")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.e22,
    getColor("blue")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch e2
  pushMatrix(matrixStack, modelMatrix); // start of branch e3

  // draw eye 3
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.e31,
    getColor("red")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.e32,
    getColor("blue")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch e3
  modelMatrix = popMatrix(matrixStack); // end of branch neck

  pushMatrix(matrixStack, modelMatrix); // start of branch t3

  // draw tentacle 3
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t31,
    getColor("burgundy")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t32,
    getColor("burgundy")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t33,
    getColor("red")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t3
  pushMatrix(matrixStack, modelMatrix); // start of branch t4

  // draw tentacle 4
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t41,
    getColor("burgundy")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t42,
    getColor("burgundy")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t43,
    getColor("red")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t4
  pushMatrix(matrixStack, modelMatrix); // start of branch t2

  // draw tentacle 2
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t21,
    getColor("green")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t22,
    getColor("orange")
  );

  pushMatrix(matrixStack, modelMatrix); // start of branch t2f1

  // draw tentacle 2, finger 1 (t2f1)
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.t2f1,
    getColor("yellow")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t2f1
  pushMatrix(matrixStack, modelMatrix); // start of branch t2f2

  // draw tentacle 2, finger 2 (t2f2)
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.t2f2,
    getColor("yellow")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t2f2
  modelMatrix = popMatrix(matrixStack); // end of branch t2
  pushMatrix(matrixStack, modelMatrix); // start of branch t5

  // draw tentacle 5
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t51,
    getColor("green")
  );
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t52,
    getColor("orange")
  );

  pushMatrix(matrixStack, modelMatrix); // start of branch t5f1

  // draw tentacle 5, finger 1 (t5f1)
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.t5f1,
    getColor("yellow")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t5f1
  pushMatrix(matrixStack, modelMatrix); // start of branch t5f2

  // draw tentacle 5, finger 2 (t5f2)
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.t5f2,
    getColor("yellow")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t5f2
  modelMatrix = popMatrix(matrixStack); // end of branch t5
  pushMatrix(matrixStack, modelMatrix); // start of branch t1

  // draw tentacle 1 (t11)
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t1,
    getColor("blue")
  );

  pushMatrix(matrixStack, modelMatrix); // start of branch t1f1

  // draw tentacle 1, finger 1 (t1f1)
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.t1f1,
    getColor("yellow")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t1f1
  pushMatrix(matrixStack, modelMatrix); // start of branch t1f2

  // draw tentacle 1, finger 2 (t1f2)
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.t1f2,
    getColor("yellow")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t1f2
  modelMatrix = popMatrix(matrixStack); // end of branch t1
  pushMatrix(matrixStack, modelMatrix); // start of branch t6

  // draw tentacle 6 (t6)
  modelMatrix = drawTransformedQuad(
    matrixStack,
    modelMatrix,
    transformations.t6,
    getColor("blue")
  );

  pushMatrix(matrixStack, modelMatrix); // start of branch t6f1

  // draw tentacle 6, finger 1 (t6f1)
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.t6f1,
    getColor("yellow")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t6f1
  pushMatrix(matrixStack, modelMatrix); // start of branch t6f2

  // draw tentacle 6, finger 2 (t6f2)
  modelMatrix = drawTransformedTri(
    matrixStack,
    modelMatrix,
    transformations.t6f2,
    getColor("yellow")
  );

  modelMatrix = popMatrix(matrixStack); // end of branch t6f2
  modelMatrix = popMatrix(matrixStack); // end of branch t6
}

function drawTransformedQuad(matrixStack, modelMatrix, transformations, color) {
  modelMatrix = getTransformedMatrix(modelMatrix, transformations);
  pushMatrix(matrixStack, modelMatrix);
  modelMatrix = mat4.scale(modelMatrix, transformations.scale);
  drawQuad(modelMatrix, color, drawAxis);
  return popMatrix(matrixStack);
}

function drawTransformedTri(matrixStack, modelMatrix, transformations, color) {
  modelMatrix = getTransformedMatrix(modelMatrix, transformations);
  pushMatrix(matrixStack, modelMatrix);
  modelMatrix = mat4.scale(modelMatrix, transformations.scale);
  drawTri(modelMatrix, color, drawAxis);
  return popMatrix(matrixStack);
}

function drawQuad(matrix, color, drawAxis) {
  drawVertices(matrix, color, glDrawMode, quadBuffer);
  if (drawAxis) drawShapeAxis(matrix);
}

function drawTri(matrix, color, drawAxis) {
  drawVertices(matrix, color, glDrawMode, triBuffer);
  if (drawAxis) drawShapeAxis(matrix);
}

function drawShapeAxis(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    axisBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);

  gl.uniform4fv(shaderProgram.uColor, getColor("gray"));
  gl.drawArrays(gl.LINES, 0, 2);

  gl.uniform4fv(shaderProgram.uColor, getColor("black"));
  gl.drawArrays(gl.LINES, 2, 2);
}

function drawVertices(matrix, color, glDrawMode, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    buffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);
  gl.uniform4fv(shaderProgram.uColor, color);
  gl.drawArrays(glDrawMode, 0, buffer.numItems);
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

function rotateMainTentacle(rotation) {
  switch (activeTentacle) {
    case "t1":
      transformations.t1.rotation += rotation;
      break;
    case "t2":
      transformations.t21.rotation += rotation;
      break;
    case "t3":
      transformations.t31.rotation += rotation;
      break;
    case "t4":
      transformations.t41.rotation += rotation;
      break;
    case "t5":
      transformations.t51.rotation += rotation;
      break;
    case "t6":
      transformations.t6.rotation += rotation;
      break;
  }
}

function rotateSubTentacle(rotation) {
  switch (activeTentacle) {
    case "t2":
      transformations.t22.rotation += rotation;
      break;
    case "t3":
      transformations.t32.rotation += rotation;
      break;
    case "t4":
      transformations.t42.rotation += rotation;
      break;
    case "t5":
      transformations.t52.rotation += rotation;
      break;
  }
}

function rotateFingerFoot1(rotation) {
  switch (activeTentacle) {
    case "t1":
      transformations.t1f1.rotation += rotation;
      break;
    case "t2":
      transformations.t2f1.rotation += rotation;
      break;
    case "t3":
      transformations.t33.rotation += rotation;
      break;
    case "t4":
      transformations.t43.rotation += rotation;
      break;
    case "t5":
      transformations.t5f1.rotation += rotation;
      break;
    case "t6":
      transformations.t6f1.rotation += rotation;
      break;
  }
}

function rotateFingerFoot2(rotation) {
  switch (activeTentacle) {
    case "t1":
      transformations.t1f2.rotation += rotation;
      break;
    case "t2":
      transformations.t2f2.rotation += rotation;
      break;
    case "t5":
      transformations.t5f2.rotation += rotation;
      break;
    case "t6":
      transformations.t6f2.rotation += rotation;
      break;
  }
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function pushMatrix(matrixStack, matrix) {
  var matrixCopy = mat4.create(matrix);
  matrixStack.push(matrixCopy);
}

function popMatrix(matrixStack) {
  return matrixStack.pop();
}

function getTransformedMatrix(baseMatrix, transforms) {
  baseMatrix = mat4.translate(baseMatrix, transforms.rotateTranslation);
  baseMatrix = mat4.rotate(
    baseMatrix,
    degToRad(transforms.rotation),
    [0, 0, 1]
  );
  baseMatrix = mat4.translate(baseMatrix, transforms.translation);
  return baseMatrix;
}

function getColor(color) {
  switch (color) {
    case "red":
      return [1, 0, 0, 1];
    case "green":
      return [0, 1, 0, 1];
    case "blue":
      return [0, 0, 1, 1];
    case "yellow":
      return [1, 1, 0, 1];
    case "orange":
      return [1, 0.4, 0, 1];
    case "purple":
      return [0.44, 0, 1, 1];
    case "brown":
      return [0.65, 0.16, 0.16, 1];
    case "pink":
      return [1, 0, 0.65, 1];
    case "black":
      return [0, 0, 0, 1];
    case "white":
      return [1, 1, 1, 1];
    case "burgundy":
      return [0.51, 0, 0.125, 1];
    case "gray":
      return [0.75, 0.75, 0.75, 1];
  }
}
