/*
 * CSE 5542 - Lab 5
 * By Ryan Stuckey
 * On 12/10/2021
 */
const TEXTURE_HOST_NAME = "";

const CAMERA_MOVE_WALK_INTERVAL = 0.3;
const CAMERA_MOVE_RUN_INTERVAL = 2;
const CAMERA_ROTATION_INTERVAL = 0.15;

const LIGHT_MOVE_INTERVAL = 0.2;

const FIELD_OF_VIEW = 60;
const Z_NEAR = 0.1;
const Z_FAR = 400;
var aspectRatio = 1;

const VIEW_CAMERA_POSITION_VEC3 = [0, 0, 0];
const VIEW_CAMERA_COI_VEC3 = [0, 0, -1];
const VIEW_CAMERA_UP_VEC3 = [0, 1, 0];

var gl;
var shaders = {};

var currentCamera = "fixed";
var fixedCameraMatrix = mat4.create();
var fpsCameraMatrix = mat4.create();
var car;

var viewMatrix = mat4.create();

var projectionMatrix = mat4.create();

var oldMousePos = [];

var canvas;
var moveCreature = false;
var moveLight = true;

var ambientOn = true;
var diffuseOn = true;
var specularOn = true;

var controlMode = 100;
var controlModes = [
  "lightComponents",
  "lightMovement",
  "camera",
  "creature",
  "car",
];

shadersArray = ["phong", "toon", "normals", "normals-interpolated"];

// Initialization Functions ---------------------------------------------------

function webGLStart() {
  setStatus("Not ready. Initializing");
  console.log("starting webGL");
  canvas = document.getElementById("lab5-canvas");

  setStatus("Not ready. Initializing WebGL");
  initGL(canvas);

  createShaderProgram(gl, shaders, "phong", "phong-vs", "phong-fs");
  createShaderProgram(gl, shaders, "toon", "toon-vs", "toon-fs");
  createShaderProgram(gl, shaders, "gouraud", "gouraud-vs", "gouraud-fs");
  createShaderProgram(gl, shaders, "normals", "normals-vs", "normals-fs");
  createShaderProgram(gl, shaders, "obj", "obj-vs", "obj-fs");
  createShaderProgram(
    gl,
    shaders,
    "normals-interpolated",
    "normals-interpolated-vs",
    "normals-interpolated-fs"
  );
  switchShaderProgram(gl, shaders, "phong");

  document.getElementById("control-mode").innerHTML =
    "Control Mode: " + controlModes[controlMode % 5];

  setStatus("Not ready. Generating world");
  initMatrices();
  generateWorld();
  // generateTestWorld();

  gl.clearColor(0, 0, 0, 1.0);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  switchControlMode(0);

  drawScene();

  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("mousedown", onMouseDown, false);
  window.onresize = onResize;
}

function onResize(event) {
  setStatus("Not ready. Resizing");
  initGL(canvas);
  initPerspective();
  drawScene();
}

function initGL(canvas) {
  canvas.height = window.innerHeight * 0.9;
  canvas.width = window.innerWidth * 0.7;
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
  fixedCameraMatrix = mat4.identity(fixedCameraMatrix);
  fixedCameraMatrix = mat4.translate(fixedCameraMatrix, [-40, 50, -82]);
  fixedCameraMatrix = mat4.rotate(fixedCameraMatrix, degToRad(-135), [0, 1, 0]);
  fixedCameraMatrix = mat4.rotate(fixedCameraMatrix, degToRad(-45), [1, 0, 0]);

  fpsCameraMatrix = mat4.identity(fpsCameraMatrix);
  fpsCameraMatrix = mat4.translate(fpsCameraMatrix, [0, 3, 30]);
  refreshViewMatrix();
}

function refreshViewMatrix() {
  document.getElementById("camera").innerHTML = "<b>Selected Camera: </b>" + currentCamera;
  let cameraMatrixToUse =
    currentCamera == "fixed" ? fixedCameraMatrix : fpsCameraMatrix;

  // set camera position vector
  let cameraPositionVector = [];
  mat4.multiplyVec4(
    cameraMatrixToUse,
    vec3ToVec4(VIEW_CAMERA_POSITION_VEC3),
    cameraPositionVector
  );

  // copy camera matrix & set view center of interest vector
  let coiVector = [];
  mat4.multiplyVec4(
    cameraMatrixToUse,
    vec3ToVec4(VIEW_CAMERA_COI_VEC3),
    coiVector
  );

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
    case 52: // 4 - switch to toon shader
      switchShaderProgram(gl, shaders, "phong");
      break;
    case 53: // 5 - switch to phong shader
      switchShaderProgram(gl, shaders, "toon");
      break;
    case 54: // 7 - switch to interpolated normals shading
      switchShaderProgram(gl, shaders, "normals-interpolated");
      break;
    case 55: // 8 - switch to vertex normals shading
      switchShaderProgram(gl, shaders, "normals");
      break;
  }

  switch (controlModes[controlMode % 5]) {
    case "creature":
      onKeyDownCreature(event);
      break;
    case "lightComponents":
      onKeyDownLightComponents(event);
      break;
    case "lightMovement":
      onKeyDownLightMovement(event);
      break;
    case "camera":
      onKeyDownCamera(event);
      break;
    case "car":
      onKeyDownCar(event);
      break;
  }
  refreshViewMatrix();
  drawScene();
}

function onMouseMove(event) {
  if(currentCamera == "fixed") return;
  let delta = [event.clientX - oldMousePos[0], event.clientY - oldMousePos[1]];

  fpsCameraMatrix = mat4.rotate(
    fpsCameraMatrix,
    -delta[0] * degToRad(CAMERA_ROTATION_INTERVAL),
    [0, 1, 0]
  );

  fpsCameraMatrix = mat4.rotate(
    fpsCameraMatrix,
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
  worldObjects.forEach((worldObject) =>
    drawWorldObject(
      worldObject,
      getLightInEyeSpace(lightWorldObject, viewMatrix)
    )
  );
}

function onKeyDownLightComponents(event) {
  switch (event.keyCode) {
    case 87: // W - ambient, diffuse, specular all on
      ambientOn = true;
      diffuseOn = true;
      specularOn = true;
      break;
    case 65: // A - ambient only
      ambientOn = true;
      diffuseOn = false;
      specularOn = false;
      break;
    case 51: // 3 - specular on/off
    case 83: // S - specular on/off
      specularOn = !specularOn;
      break;
    case 68: // D - diffuse only
      ambientOn = false;
      diffuseOn = true;
      specularOn = false;
      break;
    case 49: // 1 - ambient on/off
      ambientOn = !ambientOn;
      break;
    case 50: // 2 - diffuse on/off
      diffuseOn = !diffuseOn;
      break;
  }
  updateLightComponentLabels();
}

function onKeyDownCar(event) {
  switch (event.keyCode) {
    case 87: // W - move camera forward
      translateWorldObject(car, [
        0,
        0,
        event.shiftKey ? CAMERA_MOVE_RUN_INTERVAL : CAMERA_MOVE_WALK_INTERVAL,
      ]);
      break;
    case 83: // S - move camera back
      translateWorldObject(car, [
        0,
        0,
        -(event.shiftKey
          ? CAMERA_MOVE_RUN_INTERVAL
          : CAMERA_MOVE_WALK_INTERVAL),
      ]);
      break;
  }
}

function onKeyDownCamera(event) {
  if (currentCamera == "fixed") return;
  switch (event.keyCode) {
    case 87: // W - move camera forward
      fpsCameraMatrix = mat4.translate(fpsCameraMatrix, [
        0,
        0,
        -(event.shiftKey
          ? CAMERA_MOVE_RUN_INTERVAL
          : CAMERA_MOVE_WALK_INTERVAL),
      ]);
      break;
    case 68: // D - move camera right
      fpsCameraMatrix = mat4.translate(fpsCameraMatrix, [
        event.shiftKey ? CAMERA_MOVE_RUN_INTERVAL : CAMERA_MOVE_WALK_INTERVAL,
        0,
        0,
      ]);
      break;
    case 83: // S - move camera backward
      fpsCameraMatrix = mat4.translate(fpsCameraMatrix, [
        0,
        0,
        event.shiftKey ? CAMERA_MOVE_RUN_INTERVAL : CAMERA_MOVE_WALK_INTERVAL,
      ]);
      break;
    case 65: // A - move camera left
      fpsCameraMatrix = mat4.translate(fpsCameraMatrix, [
        -(event.shiftKey
          ? CAMERA_MOVE_RUN_INTERVAL
          : CAMERA_MOVE_WALK_INTERVAL),
        0,
        0,
      ]);
      break;
    case 69: // E - move camera up
      fpsCameraMatrix = mat4.translate(fpsCameraMatrix, [
        0,
        event.shiftKey ? CAMERA_MOVE_RUN_INTERVAL : CAMERA_MOVE_WALK_INTERVAL,
        0,
      ]);
      break;
    case 81: // Q - move camera down
      fpsCameraMatrix = mat4.translate(fpsCameraMatrix, [
        0,
        -(event.shiftKey
          ? CAMERA_MOVE_RUN_INTERVAL
          : CAMERA_MOVE_WALK_INTERVAL),
        0,
      ]);
      break;
    case 82: // R - reset camera
      initCamera();
      break;
  }
}

function onKeyDownLightMovement(event) {
  switch (event.keyCode) {
    case 87: // W - move light forward
      translateWorldObject(lightWorldObject, [
        0,
        0,
        (event.shiftKey ? 2 : 1) * -LIGHT_MOVE_INTERVAL,
      ]);
      break;
    case 68: // D - move light right
      translateWorldObject(lightWorldObject, [
        (event.shiftKey ? 2 : 1) * LIGHT_MOVE_INTERVAL,
        0,
        0,
      ]);
      break;
    case 83: // S - move light backward
      translateWorldObject(lightWorldObject, [
        0,
        0,
        (event.shiftKey ? 2 : 1) * LIGHT_MOVE_INTERVAL,
      ]);
      break;
    case 65: // A - move light left
      translateWorldObject(lightWorldObject, [
        (event.shiftKey ? 2 : 1) * -LIGHT_MOVE_INTERVAL,
        0,
        0,
      ]);
      break;
    case 69: // E - move light up
      translateWorldObject(lightWorldObject, [
        0,
        (event.shiftKey ? 2 : 1) * LIGHT_MOVE_INTERVAL,
        0,
      ]);
      break;
    case 81: // Q - move light down
      translateWorldObject(lightWorldObject, [
        0,
        (event.shiftKey ? 2 : 1) * -LIGHT_MOVE_INTERVAL,
        0,
      ]);
      break;
  }
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

function setBackground(vec3) {
  gl.clearColor(vec3[0], vec3[1], vec3[2], 1.0);
  drawScene();
}

function updateLightComponentLabels() {
  document.getElementById("ambient-status").innerHTML = ambientOn
    ? "on"
    : "off";
  document.getElementById("diffuse-status").innerHTML = diffuseOn
    ? "on"
    : "off";
  document.getElementById("specular-status").innerHTML = specularOn
    ? "on"
    : "off";
}

function toggleAmbient() {
  ambientOn = !ambientOn;
  updateLightComponentLabels();
  drawScene();
}

function toggleDiffuse() {
  diffuseOn = !diffuseOn;
  updateLightComponentLabels();
  drawScene();
}

function toggleSpecular() {
  specularOn = !specularOn;
  updateLightComponentLabels();
  drawScene();
}

function switchControlMode(i) {
  controlMode = i;
  document.getElementById("control-mode").innerHTML =
    "<b>Control Mode: </b>" + controlModes[i];
}

function switchShader(i) {
  switchShaderProgram(gl, shaders, shadersArray[i]);
  drawScene();
}

function setStatus(status) {
  document.getElementById("status").innerHTML = "<b>Status: </b>" + status;
}

function switchToFpsCamera() {
  currentCamera = "fps";
  refreshViewMatrix();
  drawScene();
}

function switchToFixedCamera() {
  currentCamera = "fixed";
  refreshViewMatrix();
  drawScene();
}