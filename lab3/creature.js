function generateCreature() {
  let creatureWorldObject = createNewWorldObject("creature", true);
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

  let body = CreateNewSphere(
    "body",
    [
      getColor("red"),
      getColor("purple"),
      getColor("blue"),
      getColor("black"),
      getColor("red"),
      getColor("purple"),
    ],
    true,
    0.25
  );
  scaleWorldObject(body, [2.5, 1, 1]);
  addChildWorldObject(creatureWorldObject, body);

  // legs
  let legLeft = CreateNewCone("legLeft", "random", false, 0.125, 0.5);
  addChildWorldObject(creatureWorldObject, legLeft);
  translateWorldObject(legLeft, [-0.38, -0.2, 0]);
  rotateWorldObject(legLeft, 180, [0, 0, 1]);
  creatureRotations.legLeft.baseMatrix = mat4.create(legLeft.modelMatrix);

  let footLeft = CreateNewCone("footLeft", "random", false, 0.125, 0.5);
  addChildWorldObject(legLeft, footLeft);
  translateWorldObject(footLeft, [0, 0.25, 0]);
  rotateWorldObject(footLeft, 180, [0, 0, 1]);
  creatureRotations.footLeft.baseMatrix = mat4.create(footLeft.modelMatrix);

  let legRight = CreateNewCone("legRight", "random", false, 0.125, 0.5);
  addChildWorldObject(creatureWorldObject, legRight);
  translateWorldObject(legRight, [0.38, -0.2, 0]);
  rotateWorldObject(legRight, 180, [0, 0, 1]);
  creatureRotations.legRight.baseMatrix = mat4.create(legRight.modelMatrix);

  let footRight = CreateNewCone("footRight", "random", false, 0.125, 0.5);
  addChildWorldObject(legRight, footRight);
  translateWorldObject(footRight, [0, 0.25, 0]);
  rotateWorldObject(footRight, 180, [0, 0, 1]);
  creatureRotations.footRight.baseMatrix = mat4.create(footRight.modelMatrix);

  // arms
  let armLeft = CreateNewTetrahedron("armLeft", "random", false, 0.32);
  addChildWorldObject(creatureWorldObject, armLeft);
  translateWorldObject(armLeft, [-0.6, 0, 0]);
  rotateWorldObject(armLeft, 90, [0, 0, 1]);

  let handLeft = CreateNewCube(
    "handLeft",
    [getColor("green", 0.25)],
    false,
    0.2
  );
  addChildWorldObject(armLeft, handLeft);
  translateWorldObject(handLeft, [0, 0.16, 0]);
  rotateWorldObject(handLeft, -45, [0, 0, 1]);
  scaleWorldObject(handLeft, [1, 2, 1]);
  creatureRotations.handLeft.baseMatrix = mat4.create(handLeft.modelMatrix);

  let armRight = CreateNewTetrahedron("armRight", "random", false, 0.32);
  addChildWorldObject(creatureWorldObject, armRight);
  translateWorldObject(armRight, [0.6, 0, 0]);
  rotateWorldObject(armRight, -90, [0, 0, 1]);

  let handRight = CreateNewCube(
    "handRight",
    [getColor("green", 0.25)],
    false,
    0.2
  );
  addChildWorldObject(armRight, handRight);
  translateWorldObject(handRight, [0, 0.16, 0]);
  rotateWorldObject(handRight, 45, [0, 0, 1]);
  scaleWorldObject(handRight, [1, 2, 1]);
  creatureRotations.handRight.baseMatrix = mat4.create(handRight.modelMatrix);

  // head
  let neck = CreateNewCylinder(
    "neck",
    [
      getColor("orange", 0.5),
      getColor("blue", 0.5),
      getColor("orange", 0.5),
      getColor("blue", 0.5),
      getColor("orange", 0.5),
      getColor("blue", 0.5),
      getColor("orange", 0.5),
      getColor("blue", 0.5),
    ],
    true,
    0.3,
    0.05
  );
  addChildWorldObject(creatureWorldObject, neck);
  translateWorldObject(neck, [0, 0.25, 0]);
  creatureRotations.neck.baseMatrix = mat4.create(neck.modelMatrix);

  let head = CreateNewCylinder("head", "random", false, 0.7, 0.05);
  addChildWorldObject(neck, head);
  translateWorldObject(head, [0, 0.15, 0]);
  rotateWorldObject(head, 90, [0, 0, 1]);
  translateWorldObject(head, [0.025, 0, 0]);
  creatureRotations.head.baseMatrix = mat4.create(head.modelMatrix);

  // left eye
  let eye1Left = CreateNewCube(
    "eye1Left",
    [getColor("orange", 0.75)],
    false,
    0.25
  );
  addChildWorldObject(head, eye1Left);
  translateWorldObject(eye1Left, [0, 0.475, 0]);

  let eyeballLeft = CreateNewSphere(
    "eyeballLeft",
    [getColor("white")],
    false,
    0.125
  );
  addChildWorldObject(eye1Left, eyeballLeft);
  translateWorldObject(eyeballLeft, [0.25, 0, 0]);

  let pupilLeft = CreateNewSphere(
    "pupilLeft",
    [getColor("black")],
    false,
    0.04
  );
  addChildWorldObject(eyeballLeft, pupilLeft);
  translateWorldObject(pupilLeft, [0, 0, 0.1]);

  // right eye
  let eye1Right = CreateNewCube(
    "eye1Right",
    [getColor("orange", 0.75)],
    false,
    0.25
  );
  addChildWorldObject(head, eye1Right);
  translateWorldObject(eye1Right, [0, -0.475, 0]);

  let eyeballRight = CreateNewSphere(
    "eyeballRight",
    [getColor("white")],
    false,
    0.125
  );
  addChildWorldObject(eye1Right, eyeballRight);
  translateWorldObject(eyeballRight, [0.25, 0, 0]);

  let pupilRight = CreateNewSphere(
    "pupilRight",
    [getColor("black")],
    false,
    0.04
  );
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
