/*
 * CSE 5542 - Lab 3
 * By Ryan Stuckey
 * On 11/05/2021
 */

const CAMERA_MOVE_WALK_INTERVAL = 0.3;
const CAMERA_MOVE_RUN_INTERVAL = 2;
const CAMERA_ROTATION_INTERVAL = 0.15;

const FIELD_OF_VIEW = 60;
const Z_NEAR = 0.1;
const Z_FAR = 400;
var aspectRatio = 1;

const VIEW_CAMERA_POSITION_VEC3 = [0, 0, 0];
const VIEW_CAMERA_COI_VEC3 = [0, 0, -1];
const VIEW_CAMERA_UP_VEC3 = [0, 1, 0];

var gl;
var shaderProgram;

var cameraMatrix = mat4.create();
var viewMatrix = mat4.create();

var projectionMatrix = mat4.create();

var oldMousePos = [];

const CREATURE_ROTATION_INTERVAL = 10;
const CREATURE_WALK_SPEED = 0.3;
const CREATURE_RUN_SPEED = 2;
const CREATURE_SCALE_INTERVAL = 0.1;
var creature;
var selectedBodyPart = "neck";
var lockCreatureToCamera = false;

var canvas;

// Initialization Functions ---------------------------------------------------

function webGLStart() {
  console.log("starting webGL");
  canvas = document.getElementById("lab3-canvas");

  initGL(canvas);

  initShaders();
  initShaderVariables();

  initMatrices();
  generateWorld();

  gl.clearColor(0, 0, 0, 1.0);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  drawScene();

  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("mousedown", onMouseDown, false);
  window.onresize = onResize;
}

function onResize(event) {
  initGL(canvas);
  initPerspective();
  drawScene();
}

function initGL(canvas) {
  canvas.height = window.innerHeight * 0.9;
  canvas.width = window.innerWidth * 0.9
  aspectRatio = canvas.width / canvas.height;
  console.log(
    "initializing WebGL on canvas:",
    canvas.id,
    "with width:",
    canvas.width,
    "and height:",
    canvas.height
  );
  try {
    gl = !gl ? canvas.getContext("experimental-webgl") : gl;
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {}
  if (!gl) alert("Could not initialize WebGL!");
}

function initShaderVariables() {
  // vertex position attribute
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  // vertex color attribute
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexColor"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  // model view matrix uniform
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uMVMatrix"
  );

  // projection matrix uniform
  shaderProgram.pMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uPMatrix"
  );
}

function initMatrices() {
  initCamera();
  initPerspective();
}

function initPerspective() {
  projectionMatrix = mat4.identity(projectionMatrix);
  projectionMatrix = mat4.perspective(
    FIELD_OF_VIEW,
    aspectRatio,
    Z_NEAR,
    Z_FAR,
    projectionMatrix
  );
}

function initCamera() {
  cameraMatrix = mat4.identity(cameraMatrix);
  cameraMatrix = mat4.translate(cameraMatrix, VIEW_CAMERA_POSITION_VEC3);
  refreshViewMatrix();
}

function refreshViewMatrix() {
  // set camera position vector
  let cameraPositionVector = [];
  mat4.multiplyVec4(
    cameraMatrix,
    vec3ToVec4(VIEW_CAMERA_POSITION_VEC3),
    cameraPositionVector
  );

  // copy camera matrix & set view center of interest vector
  let coiVector = [];
  mat4.multiplyVec4(cameraMatrix, vec3ToVec4(VIEW_CAMERA_COI_VEC3), coiVector);

  // get look at matrix
  viewMatrix = mat4.lookAt(
    vec4ToVec3(cameraPositionVector),
    vec4ToVec3(coiVector),
    VIEW_CAMERA_UP_VEC3,
    viewMatrix
  );
}

// Handle Input ---------------------------------------------------------------

function onKeyDown(event) {
  switch (event.keyCode) {
    case 87: // W - move camera forward
      cameraMatrix = mat4.translate(cameraMatrix, [
        0,
        0,
        -(event.shiftKey
          ? CAMERA_MOVE_RUN_INTERVAL
          : CAMERA_MOVE_WALK_INTERVAL),
      ]);
      if (!lockCreatureToCamera) break;
    case 73: // I - move creature forward
      translateWorldObject(creature.worldObject, [
        0,
        0,
        event.shiftKey ? CREATURE_RUN_SPEED : CREATURE_WALK_SPEED,
      ]);
      break;
    case 68: // D - move camera right
      cameraMatrix = mat4.translate(cameraMatrix, [
        event.shiftKey ? CAMERA_MOVE_RUN_INTERVAL : CAMERA_MOVE_WALK_INTERVAL,
        0,
        0,
      ]);
      if (!lockCreatureToCamera) break;
    case 76: // I - move creature right
      translateWorldObject(creature.worldObject, [
        -(event.shiftKey ? CREATURE_RUN_SPEED : CREATURE_WALK_SPEED),
        0,
        0,
      ]);
      break;
    case 83: // S - move camera backward
      cameraMatrix = mat4.translate(cameraMatrix, [
        0,
        0,
        event.shiftKey ? CAMERA_MOVE_RUN_INTERVAL : CAMERA_MOVE_WALK_INTERVAL,
      ]);
      if (!lockCreatureToCamera) break;
    case 75: // I - move creature backward
      translateWorldObject(creature.worldObject, [
        0,
        0,
        -(event.shiftKey ? CREATURE_RUN_SPEED : CREATURE_WALK_SPEED),
      ]);
      break;
    case 65: // A - move camera left
      cameraMatrix = mat4.translate(cameraMatrix, [
        -(event.shiftKey
          ? CAMERA_MOVE_RUN_INTERVAL
          : CAMERA_MOVE_WALK_INTERVAL),
        0,
        0,
      ]);
      if (!lockCreatureToCamera) break;
    case 74: // I - move creature left
      translateWorldObject(creature.worldObject, [
        event.shiftKey ? CREATURE_RUN_SPEED : CREATURE_WALK_SPEED,
        0,
        0,
      ]);
      break;
    case 69: // E - move camera up
      cameraMatrix = mat4.translate(cameraMatrix, [
        0,
        event.shiftKey ? CAMERA_MOVE_RUN_INTERVAL : CAMERA_MOVE_WALK_INTERVAL,
        0,
      ]);
      break;
    case 81: // Q - move camera down
      cameraMatrix = mat4.translate(cameraMatrix, [
        0,
        -(event.shiftKey
          ? CAMERA_MOVE_RUN_INTERVAL
          : CAMERA_MOVE_WALK_INTERVAL),
        0,
      ]);
      break;
    case 79: // O - rotate creature CW
      rotateWorldObject(
        creature.worldObject,
        -CREATURE_ROTATION_INTERVAL,
        [0, 1, 0]
      );
      break;
    case 85: // U - rotate creature CW
      rotateWorldObject(
        creature.worldObject,
        CREATURE_ROTATION_INTERVAL,
        [0, 1, 0]
      );
      break;
    case 49: // 1 - select neck for transform
      selectedBodyPart = "neck";
      break;
    case 50: // 2 - select neck for transform
      selectedBodyPart = "head";
      break;
    case 51: // 3 - select neck for transform
      selectedBodyPart = "legLeft";
      break;
    case 52: // 4 - select neck for transform
      selectedBodyPart = "footLeft";
      break;
    case 53: // 5 - select neck for transform
      selectedBodyPart = "legRight";
      break;
    case 54: // 6 - select neck for transform
      selectedBodyPart = "footRight";
      break;
    case 55: // 7 - select neck for transform
      selectedBodyPart = "handLeft";
      break;
    case 56: // 8 - select neck for transform
      selectedBodyPart = "handRight";
      break;
    case 70: // F - rotate on +x axis
      rotateCreatureBodyPart([CREATURE_ROTATION_INTERVAL, 0, 0]);
      break;
    case 67: // C - rotate on -x axis
      rotateCreatureBodyPart([-CREATURE_ROTATION_INTERVAL, 0, 0]);
      break;
    case 71: // G - rotate on +y axis
      rotateCreatureBodyPart([0, CREATURE_ROTATION_INTERVAL, 0]);
      break;
    case 86: // V - rotate on -y axis
      rotateCreatureBodyPart([0, -CREATURE_ROTATION_INTERVAL, 0]);
      break;
    case 72: // H - rotate on +z axis
      rotateCreatureBodyPart([0, 0, CREATURE_ROTATION_INTERVAL]);
      break;
    case 66: // B - rotate on -z axis
      rotateCreatureBodyPart([0, 0, -CREATURE_ROTATION_INTERVAL]);
      break;
    case 84: // T - reset camera
      initCamera();
      break;
    case 82:
      lockCreatureToCamera = !lockCreatureToCamera;
      break;
    case 88: // X - scale up
      scaleCreature(creature.worldObject.scale[0] + CREATURE_SCALE_INTERVAL);
      break;
    case 90: // Z - scale down
      scaleCreature(creature.worldObject.scale[0] - CREATURE_SCALE_INTERVAL);
      break;
  }
  refreshViewMatrix();
  drawScene();
}

function onMouseMove(event) {
  let delta = [event.clientX - oldMousePos[0], event.clientY - oldMousePos[1]];

  cameraMatrix = mat4.rotate(
    cameraMatrix,
    -delta[0] * degToRad(CAMERA_ROTATION_INTERVAL),
    [0, 1, 0]
  );

  cameraMatrix = mat4.rotate(
    cameraMatrix,
    -delta[1] * degToRad(CAMERA_ROTATION_INTERVAL),
    [1, 0, 0]
  );

  refreshViewMatrix();
  drawScene();

  oldMousePos = [event.clientX, event.clientY];
}

function onMouseDown(event) {
  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("mouseup", onMouseUp, false);

  oldMousePos = [event.clientX, event.clientY];
}

function onMouseUp(event) {
  document.removeEventListener("mousemove", onMouseMove, false);
  document.removeEventListener("mouseup", onMouseUp, false);
}

// Other Functions ----------------------------------------------------------

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  worldObjects.forEach((worldObject) => drawWorldObject(worldObject));
}

function rotateCreatureBodyPart(rotationVec3) {
  switch (selectedBodyPart) {
    case "neck":
      rotateNeck(creature, rotationVec3);
      break;
    case "head":
      rotateHead(creature, rotationVec3);
      break;
    case "legLeft":
      rotateLegLeft(creature, rotationVec3);
      break;
    case "footLeft":
      rotateFootLeft(creature, rotationVec3);
      break;
    case "legRight":
      rotateLegRight(creature, rotationVec3);
      break;
    case "footRight":
      rotateFootRight(creature, rotationVec3);
      break;
    case "handLeft":
      rotateHandLeft(creature, rotationVec3);
      break;
    case "handRight":
      rotateHandRight(creature, rotationVec3);
      break;
  }
  updateCreatureRotations(creature);
}

function scaleCreature(size) {
  let oldSize = creature.worldObject.scale[0];
  scaleWorldObject(creature.worldObject, [size, size, size]);
  translateWorldObject(creature.worldObject, [0, (size - oldSize) * 1.1, 0]);
}
