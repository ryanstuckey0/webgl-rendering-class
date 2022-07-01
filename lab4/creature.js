const CREATURE_ROTATION_INTERVAL = 10;
const CREATURE_WALK_SPEED = 0.3;
const CREATURE_RUN_SPEED = 2;
const CREATURE_SCALE_INTERVAL = 0.1;
var creature;
var selectedBodyPart = "neck";
var lockCreatureToCamera = false;

function onKeyDownCreature(event) {
  switch (event.keyCode) {
    case 87: // W - move creature forward
      translateWorldObject(creature.worldObject, [
        0,
        0,
        event.shiftKey ? CREATURE_RUN_SPEED : CREATURE_WALK_SPEED,
      ]);
      break;
    case 68: // D - move creature right
      translateWorldObject(creature.worldObject, [
        -(event.shiftKey ? CREATURE_RUN_SPEED : CREATURE_WALK_SPEED),
        0,
        0,
      ]);
      break;
    case 83: // S - move creature backward
      translateWorldObject(creature.worldObject, [
        0,
        0,
        -(event.shiftKey ? CREATURE_RUN_SPEED : CREATURE_WALK_SPEED),
      ]);
      break;
    case 65: // A - move creature left
      translateWorldObject(creature.worldObject, [
        event.shiftKey ? CREATURE_RUN_SPEED : CREATURE_WALK_SPEED,
        0,
        0,
      ]);
      break;
    case 69: // E - rotate creature CW
      rotateWorldObject(
        creature.worldObject,
        -CREATURE_ROTATION_INTERVAL,
        [0, 1, 0]
      );
      break;
    case 81: // Q - rotate creature CW
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
    case 88: // X - scale up
      scaleCreature(creature.worldObject.scale[0] + CREATURE_SCALE_INTERVAL);
      break;
    case 90: // Z - scale down
      scaleCreature(creature.worldObject.scale[0] - CREATURE_SCALE_INTERVAL);
      break;
  }
}

function generateCreature() {
  let creatureWorldObject = createNewWorldObject("creature", null, true);
  worldObjects.push(creatureWorldObject);
  translateWorldObject(creatureWorldObject, [0, -1.875, -6]);
  rotateWorldObject(creatureWorldObject, 180, [0, 1, 0]);

  let creatureRotations = {
    neck: getRotation([-25, 0, -25], [25, 0, 25]),
    head: getRotation([-Infinity, -135, -25], [Infinity, 135, 25]),
    legLeft: getRotation([-45, 0, -45], [45, 0, 45]),
    footLeft: getRotation([-45, 0, -45], [45, 0, 45]),
    legRight: getRotation([-45, 0, -45], [45, 0, 45]),
    footRight: getRotation([-45, 0, -45], [45, 0, 45]),
    handLeft: getRotation([-45, 0, -45], [45, 0, 135]),
    handRight: getRotation([-45, 0, -135], [45, 0, 45]),
  };

  let body = createNewWorldObject("body", GenerateSphereMesh(0.25));
  body.material = materialsRepo.body;
  scaleWorldObject(body, [2.5, 1, 1]);
  addChildWorldObject(creatureWorldObject, body);

  // legs
  let legLeft = createNewWorldObject("leftLeft", GenerateConeMesh(0.125, 0.5));
  legLeft.material = materialsRepo.leg;
  addChildWorldObject(creatureWorldObject, legLeft);
  translateWorldObject(legLeft, [-0.38, -0.2, 0]);
  rotateWorldObject(legLeft, 180, [0, 0, 1]);
  creatureRotations.legLeft.baseMatrix = mat4.create(legLeft.modelMatrix);

  let footLeft = createNewWorldObject("footLeft", GenerateConeMesh(0.125, 0.5));
  footLeft.material = materialsRepo.foot;
  addChildWorldObject(legLeft, footLeft);
  translateWorldObject(footLeft, [0, 0.25, 0]);
  rotateWorldObject(footLeft, 180, [0, 0, 1]);
  creatureRotations.footLeft.baseMatrix = mat4.create(footLeft.modelMatrix);

  let legRight = createNewWorldObject("legRight", GenerateConeMesh(0.125, 0.5));
  legRight.material = materialsRepo.leg;
  addChildWorldObject(creatureWorldObject, legRight);
  translateWorldObject(legRight, [0.38, -0.2, 0]);
  rotateWorldObject(legRight, 180, [0, 0, 1]);
  creatureRotations.legRight.baseMatrix = mat4.create(legRight.modelMatrix);

  let footRight = createNewWorldObject(
    "footRight",
    GenerateConeMesh(0.125, 0.5)
  );
  footRight.material = materialsRepo.foot;
  addChildWorldObject(legRight, footRight);
  translateWorldObject(footRight, [0, 0.25, 0]);
  rotateWorldObject(footRight, 180, [0, 0, 1]);
  creatureRotations.footRight.baseMatrix = mat4.create(footRight.modelMatrix);

  // arms
  let armLeft = createNewWorldObject("armLeft", GenerateTetrahedronMesh(0.32));
  armLeft.material = materialsRepo.leg;
  addChildWorldObject(creatureWorldObject, armLeft);
  translateWorldObject(armLeft, [-0.6, 0, 0]);
  rotateWorldObject(armLeft, 90, [0, 0, 1]);

  let handLeft = createNewWorldObject("handLeft", GenerateCubeMesh(0.2));
  handLeft.material = materialsRepo.foot;
  addChildWorldObject(armLeft, handLeft);
  translateWorldObject(handLeft, [0, 0.16, 0]);
  rotateWorldObject(handLeft, -45, [0, 0, 1]);
  scaleWorldObject(handLeft, [1, 2, 1]);
  creatureRotations.handLeft.baseMatrix = mat4.create(handLeft.modelMatrix);

  let armRight = createNewWorldObject(
    "armRight",
    GenerateTetrahedronMesh(0.32)
  );
  armRight.material = materialsRepo.leg;
  addChildWorldObject(creatureWorldObject, armRight);
  translateWorldObject(armRight, [0.6, 0, 0]);
  rotateWorldObject(armRight, -90, [0, 0, 1]);

  let handRight = createNewWorldObject("handRight", GenerateCubeMesh(0.2));
  handRight.material = materialsRepo.foot;
  addChildWorldObject(armRight, handRight);
  translateWorldObject(handRight, [0, 0.16, 0]);
  rotateWorldObject(handRight, 45, [0, 0, 1]);
  scaleWorldObject(handRight, [1, 2, 1]);
  creatureRotations.handRight.baseMatrix = mat4.create(handRight.modelMatrix);

  // head
  let neck = createNewWorldObject("neck", GenerateCylinderMesh(0.3, 0.05));
  neck.material = materialsRepo.neck;
  addChildWorldObject(creatureWorldObject, neck);
  translateWorldObject(neck, [0, 0.25, 0]);
  creatureRotations.neck.baseMatrix = mat4.create(neck.modelMatrix);

  let head = createNewWorldObject("head", GenerateCylinderMesh(0.7, 0.05));
  head.material = materialsRepo.head;
  addChildWorldObject(neck, head);
  translateWorldObject(head, [0, 0.15, 0]);
  rotateWorldObject(head, 90, [0, 0, 1]);
  translateWorldObject(head, [0.025, 0, 0]);
  creatureRotations.head.baseMatrix = mat4.create(head.modelMatrix);

  // left eye
  let eye1Left = createNewWorldObject("eye1Left", GenerateCubeMesh(0.25));
  eye1Left.material = materialsRepo.eye;
  addChildWorldObject(head, eye1Left);
  translateWorldObject(eye1Left, [0, 0.475, 0]);

  let eyeballLeft = createNewWorldObject(
    "eyeballLeft",
    GenerateSphereMesh(0.125)
  );
  eyeballLeft.material = materialsRepo.eyeball;
  addChildWorldObject(eye1Left, eyeballLeft);
  translateWorldObject(eyeballLeft, [0.25, 0, 0]);

  let pupilLeft = createNewWorldObject("pupilLeft", GenerateSphereMesh(0.04));
  pupilLeft.material = materialsRepo.pupil;
  addChildWorldObject(eyeballLeft, pupilLeft);
  translateWorldObject(pupilLeft, [0, 0, 0.1]);

  // right eye
  let eye1Right = createNewWorldObject("eye1Right", GenerateCubeMesh(0.25));
  eye1Right.material = materialsRepo.eye;
  addChildWorldObject(head, eye1Right);
  translateWorldObject(eye1Right, [0, -0.475, 0]);

  let eyeballRight = createNewWorldObject(
    "eyeballRight",
    GenerateSphereMesh(0.125)
  );
  eyeballRight.material = materialsRepo.eyeball;
  addChildWorldObject(eye1Right, eyeballRight);
  translateWorldObject(eyeballRight, [0.25, 0, 0]);

  let pupilRight = createNewWorldObject("pupilRight", GenerateSphereMesh(0.04));
  pupilRight.material = materialsRepo.pupil;
  addChildWorldObject(eyeballRight, pupilRight);
  translateWorldObject(pupilRight, [0, 0, 0.1]);

  let creature = {
    worldObject: creatureWorldObject,
    worldObjects: {
      body: body,
      legLeft: legLeft,
      footLeft: footLeft,
      legRight: legRight,
      footRight: footRight,
      armLeft: armLeft,
      handLeft: handLeft,
      armRight: armRight,
      handRight: handRight,
      neck: neck,
      head: head,
      eyeLeft: eye1Left,
      eyeballLeft: eyeballLeft,
      pupilLeft: pupilLeft,
      eyeRight: eye1Right,
      eyeballRight: eyeballRight,
      pupilRight: pupilRight,
    },
    rotations: creatureRotations,
  };

  updateCreatureRotations(creature);
  return creature;
}

function getRotation(min, max, baseMatrix = mat4.identity(mat4.create())) {
  return {
    angle: [0, 0, 0],
    min: min,
    max: max,
    baseMatrix: baseMatrix,
  };
}

function enforceClampedRotation(rotation) {
  for (let i = 0; i < 3; i++) {
    if (rotation.angle[i] >= rotation.max[i])
      rotation.angle[i] = rotation.max[i];
    if (rotation.angle[i] <= rotation.min[i])
      rotation.angle[i] = rotation.min[i];
  }
}

function updateCreatureRotations(creature) {
  updateRotation(
    creature.worldObjects.legLeft,
    creature.rotations.legLeft,
    [0, 0.15, 0]
  );
  updateRotation(
    creature.worldObjects.footLeft,
    creature.rotations.footLeft,
    [0, -0.25, 0]
  );
  updateRotation(
    creature.worldObjects.legRight,
    creature.rotations.legRight,
    [0, 0.15, 0]
  );
  updateRotation(
    creature.worldObjects.footRight,
    creature.rotations.footRight,
    [0, -0.25, 0]
  );
  updateRotation(
    creature.worldObjects.handLeft,
    creature.rotations.handLeft,
    [0, 0.2, 0]
  );
  updateRotation(
    creature.worldObjects.handRight,
    creature.rotations.handRight,
    [0, 0.2, 0]
  );
  updateRotation(
    creature.worldObjects.neck,
    creature.rotations.neck,
    [0, 0.15, 0]
  );
  updateRotation(
    creature.worldObjects.head,
    creature.rotations.head,
    [0.025, 0, 0]
  );
}

function updateRotation(worldObject, rotation, translateVec3 = 0) {
  worldObject.modelMatrix = mat4.create(rotation.baseMatrix);
  enforceClampedRotation(rotation);
  rotateWorldObject(worldObject, rotation.angle[0], [1, 0, 0]);
  rotateWorldObject(worldObject, rotation.angle[1], [0, 1, 0]);
  rotateWorldObject(worldObject, rotation.angle[2], [0, 0, 1]);
  if (translateVec3 != 0) translateWorldObject(worldObject, translateVec3);
}

function rotateNeck(creature, rotationVec3) {
  for (let i = 0; i < 3; i++)
    creature.rotations.neck.angle[i] += rotationVec3[i];
}

function rotateHead(creature, rotationVec3) {
  creature.rotations.head.angle[0] += rotationVec3[1];
  creature.rotations.head.angle[1] += rotationVec3[0];
  creature.rotations.head.angle[2] += rotationVec3[2];
}

function rotateLegLeft(creature, rotationVec3) {
  for (let i = 0; i < 3; i++)
    creature.rotations.legLeft.angle[i] += rotationVec3[i];
}

function rotateFootLeft(creature, rotationVec3) {
  for (let i = 0; i < 3; i++)
    creature.rotations.footLeft.angle[i] += rotationVec3[i];
}

function rotateLegRight(creature, rotationVec3) {
  for (let i = 0; i < 3; i++)
    creature.rotations.legRight.angle[i] += rotationVec3[i];
}

function rotateFootRight(creature, rotationVec3) {
  for (let i = 0; i < 3; i++)
    creature.rotations.footRight.angle[i] += rotationVec3[i];
}

function rotateHandLeft(creature, rotationVec3) {
  for (let i = 0; i < 3; i++)
    creature.rotations.handLeft.angle[i] += rotationVec3[i];
}

function rotateHandRight(creature, rotationVec3) {
  for (let i = 0; i < 3; i++)
    creature.rotations.handRight.angle[i] += rotationVec3[i];
}
