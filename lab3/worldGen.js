function generateWorld() {
  let world = createNewWorldObject("world", true);
  worldObjects.push(world);

  let sky = CreateNewCube("sky", [getColor("blue", 0.75)]);
  translateWorldObject(sky, [0, 22.5, -15]);
  scaleWorldObject(sky, [45, 45, 0.1]);
  addChildWorldObject(world, sky);

  let grassArea = createNewWorldObject("grassArea", true);
  addChildWorldObject(world, grassArea);

  let grass = CreateNewCube("grass", [getColor("green", 0.75)]);
  scaleWorldObject(grass, [45, 0.1, 30]);
  addChildWorldObject(grassArea, grass);

  let sidewalk = createBrickSidewalk([-1.25, 0, 15]);
  addChildWorldObject(grassArea, sidewalk);

  createAllTrees(grassArea);

  create3DObjects(grassArea);

  creature = generateCreature();

  translateWorldObject(world, [0, -3, -70]);
}

// Misc 3D Objects ------------------------------------------------------------

const DISTANCE_FROM_CENTER = 6;

function create3DObjects(parent) {
  // parent empty object
  let shapes = createNewWorldObject("3dShapes", true);
  translateWorldObject(shapes, [0, 0, 20]);
  addChildWorldObject(parent, shapes);

  // cylinders
  let cylinders = createNewWorldObject("cylinders", true);
  translateWorldObject(cylinders, [0, 0, 20]);
  addChildWorldObject(shapes, cylinders);

  let cylinderLeft = CreateNewCylinder("cylinderLeft", "random", false, 4),
    cylinderRight = CreateNewCylinder("cylinderRight", "random", false, 4);
  translateWorldObject(cylinderLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(cylinderRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(cylinders, cylinderLeft);
  addChildWorldObject(cylinders, cylinderRight);

  // cones
  let cones = createNewWorldObject("cones", true);
  translateWorldObject(cones, [0, 0, 15]);
  addChildWorldObject(shapes, cones);

  let coneLeft = CreateNewCone("coneLeft", "random", false, 1, 4),
    coneRight = CreateNewCone("coneRight", "random", false, 1, 4);
  translateWorldObject(coneLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(coneRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(cones, coneLeft);
  addChildWorldObject(cones, coneRight);

  // tetrahedrons
  let tetrahedrons = createNewWorldObject("tetrahedrons", true);
  translateWorldObject(tetrahedrons, [0, 0, 10]);
  addChildWorldObject(shapes, tetrahedrons);

  let tetrahedronLeft = CreateNewTetrahedron(
      "tetrahedronLeft",
      "random",
      false,
      4
    ),
    tetrahedronRight = CreateNewTetrahedron(
      "tetrahedronRight",
      "random",
      false,
      4
    );
  translateWorldObject(tetrahedronLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(tetrahedronRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(tetrahedrons, tetrahedronLeft);
  addChildWorldObject(tetrahedrons, tetrahedronRight);

  // spheres
  let spheres = createNewWorldObject("spheres", true);
  translateWorldObject(spheres, [0, 0, 5]);
  addChildWorldObject(shapes, spheres);

  let sphereLeft = CreateNewSphere("sphereLeft", "random", false, 2),
    sphereRight = CreateNewSphere("sphereRight", "random", false, 2);
  translateWorldObject(sphereLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(sphereRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(spheres, sphereLeft);
  addChildWorldObject(spheres, sphereRight);

  // cubes
  let cubes = createNewWorldObject("cubes", true);
  translateWorldObject(cubes, [0, 0, 0]);
  addChildWorldObject(shapes, cubes);

  let cubeLeft = CreateNewCube("cubeLeft", "random", false, 3),
    cubeRight = CreateNewCube("cubeRight", "random", false, 3);
  translateWorldObject(cubeLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(cubeRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(cubes, cubeLeft);
  addChildWorldObject(cubes, cubeRight);
}

// Sidewalk -------------------------------------------------------------------

const SIDEWALK_NUM_ROWS = 100;
const SIDEWALK_TILE_LENGTH = 0.5;

function createBrickSidewalk(positionVec3) {
  let sidewalk = createNewWorldObject("sidewalk", true);
  translateWorldObject(sidewalk, positionVec3);

  let tile;
  let color = "red";
  for (
    let z = SIDEWALK_TILE_LENGTH / 2;
    z < SIDEWALK_NUM_ROWS * SIDEWALK_TILE_LENGTH;
    z += SIDEWALK_TILE_LENGTH
  ) {
    for (
      let x = SIDEWALK_TILE_LENGTH / 2;
      x < SIDEWALK_TILE_LENGTH * 5;
      x += SIDEWALK_TILE_LENGTH
    ) {
      color = color == "red" ? "gray" : "red";
      tile = CreateNewCube("tile" + x + "-" + z, [getColor(color, 0.5)]);
      addChildWorldObject(sidewalk, tile);
      translateWorldObject(tile, [x, 0, z]);
      scaleWorldObject(tile, [SIDEWALK_TILE_LENGTH, 0.1, SIDEWALK_TILE_LENGTH]);
    }
  }
  return sidewalk;
}

// Trees ----------------------------------------------------------------------

const NUM_TREES = 20;
const NUM_TREE_LEAVES = 30;

function createAllTrees(parent) {
  let height, tree;
  for (let i = 0; i < NUM_TREES; i++) {
    height = Math.random() * 7 + 6;
    tree = createTree(
      height,
      [Math.random() * 45 - 22.5, height / 2, Math.random() * 30 - 15],
      parent
    );
    addChildWorldObject(parent, tree);
  }
}

function createTree(height, positionVec3, parent) {
  let tree = createNewWorldObject("tree", true);
  tree.modelMatrix = mat4.translate(tree.modelMatrix, positionVec3);

  let trunk = CreateNewCylinder(
    "tree-trunk",
    [getColor("brown", Math.random() * 0.25 + 0.5)],
    false,
    height,
    height * 0.06
  );
  addChildWorldObject(tree, trunk);

  for (let i = 0; i < NUM_TREE_LEAVES; i++) {
    let leaf = CreateNewSphere(
      "leaf-" + i,
      [getColor("green", Math.random() * 0.5 + 0.5)],
      false,
      Math.random() * 0.5 + 0.5
    );
    addChildWorldObject(tree, leaf);
    translateWorldObject(leaf, [
      Math.random() * 4 - 2,
      Math.random() * 4 + height / 2,
      Math.random() * 4 - 2,
    ]);
  }
  return tree;
}
