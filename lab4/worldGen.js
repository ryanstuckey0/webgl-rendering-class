function generateWorld() {
  lightWorldObject = createNewWorldObject("light", GenerateSphereMesh(4));
  lightWorldObject.light = getLight();
  lightWorldObject.material = materialsRepo.light;
  translateWorldObject(lightWorldObject, [14, 34, -80]);
  worldObjects.push(lightWorldObject);

  let world = createNewWorldObject("world", null, true);
  worldObjects.push(world);

  let sky = createNewWorldObject("sky", GenerateCubeMesh());
  sky.material = materialsRepo.sky;
  translateWorldObject(sky, [0, 22.5, -15]);
  scaleWorldObject(sky, [45, 45, 0.1]);
  addChildWorldObject(world, sky);

  let grassArea = createNewWorldObject("grassArea", null, true);
  addChildWorldObject(world, grassArea);

  let grass = createNewWorldObject("grass", GenerateCubeMesh());
  grass.material = materialsRepo.grass;
  scaleWorldObject(grass, [45, 0.1, 30]);
  addChildWorldObject(grassArea, grass);

  let sidewalk = createBrickSidewalk([-1.25, 0, 15]);
  addChildWorldObject(grassArea, sidewalk);

  createAllTrees(grassArea);

  create3DObjects(grassArea);

  creature = generateCreature();

  translateWorldObject(world, [0, -3, -70]);
}

function generateTestWorld() {
  lightWorldObject = createNewWorldObject("light", GenerateSphereMesh());
  lightWorldObject.light = getLight();
  lightWorldObject.material = materialsRepo.light;
  translateWorldObject(lightWorldObject, [0, 3, -5]);
  worldObjects.push(lightWorldObject);

  let cube = createNewWorldObject("cube", GenerateCubeMesh(4));
  cube.material.shininess = 0.1;
  translateWorldObject(cube, [0, -2, -20]);
  worldObjects.push(cube);
}

// Misc 3D Objects ------------------------------------------------------------

const DISTANCE_FROM_CENTER = 6;

function create3DObjects(parent) {
  // parent empty object
  let shapes = createNewWorldObject("3dShapes", null, true);
  translateWorldObject(shapes, [0, 0, 20]);
  addChildWorldObject(parent, shapes);

  // cylinders
  let cylinders = createNewWorldObject("cylinders", null, true);
  translateWorldObject(cylinders, [0, 0, 20]);
  addChildWorldObject(shapes, cylinders);

  let cylinderLeft = createNewWorldObject(
      "cylinderLeft",
      GenerateCylinderMesh(4)
    ),
    cylinderRight = createNewWorldObject(
      "cylinderRight",
      GenerateCylinderMesh(4)
    );
  cylinderLeft.material = materialsRepo.cylinder;
  cylinderRight.material = materialsRepo.cylinder;
  translateWorldObject(cylinderLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(cylinderRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(cylinders, cylinderLeft);
  addChildWorldObject(cylinders, cylinderRight);

  // cones
  let cones = createNewWorldObject("cones", null, true);
  translateWorldObject(cones, [0, 0, 15]);
  addChildWorldObject(shapes, cones);

  let coneLeft = createNewWorldObject("coneLeft", GenerateConeMesh(1, 4)),
    coneRight = createNewWorldObject("coneRight", GenerateConeMesh(1, 4));
  coneLeft.material = materialsRepo.cone;
  coneRight.material = materialsRepo.cone;
  translateWorldObject(coneLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(coneRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(cones, coneLeft);
  addChildWorldObject(cones, coneRight);

  // tetrahedrons
  let tetrahedrons = createNewWorldObject("tetrahedrons", null, true);
  translateWorldObject(tetrahedrons, [0, 0, 10]);
  addChildWorldObject(shapes, tetrahedrons);

  let tetrahedronLeft = createNewWorldObject(
      "tetrahedronLeft",
      GenerateTetrahedronMesh(4)
    ),
    tetrahedronRight = createNewWorldObject(
      "tetrahedronRight",
      GenerateTetrahedronMesh(4)
    );
  tetrahedronLeft.material = materialsRepo.tetrahedron;
  tetrahedronRight.material = materialsRepo.tetrahedron;
  translateWorldObject(tetrahedronLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(tetrahedronRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(tetrahedrons, tetrahedronLeft);
  addChildWorldObject(tetrahedrons, tetrahedronRight);

  // spheres
  let spheres = createNewWorldObject("spheres", null, true);
  translateWorldObject(spheres, [0, 0, 5]);
  addChildWorldObject(shapes, spheres);

  let sphereLeft = createNewWorldObject("sphereLeft", GenerateSphereMesh(2)),
    sphereRight = createNewWorldObject("sphereRight", GenerateSphereMesh(2));
  sphereLeft.material = materialsRepo.sphere;
  sphereRight.material = materialsRepo.sphere;
  translateWorldObject(sphereLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(sphereRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(spheres, sphereLeft);
  addChildWorldObject(spheres, sphereRight);

  // cubes
  let cubes = createNewWorldObject("cubes", null, true);
  translateWorldObject(cubes, [0, 0, 0]);
  addChildWorldObject(shapes, cubes);

  let cubeLeft = createNewWorldObject("cubeLeft", GenerateCubeMesh(3)),
    cubeRight = createNewWorldObject("cubeRight", GenerateCubeMesh(3));
  cubeLeft.material = materialsRepo.cube;
  cubeRight.material = materialsRepo.cube;
  translateWorldObject(cubeLeft, [-DISTANCE_FROM_CENTER, 2, 0]);
  translateWorldObject(cubeRight, [DISTANCE_FROM_CENTER, 2, 0]);
  addChildWorldObject(cubes, cubeLeft);
  addChildWorldObject(cubes, cubeRight);
}

// Sidewalk -------------------------------------------------------------------

const SIDEWALK_NUM_ROWS = 100;
const SIDEWALK_TILE_LENGTH = 0.5;

function createBrickSidewalk(positionVec3) {
  let sidewalk = createNewWorldObject("sidewalk", null, true);
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
      tile = createNewWorldObject("tile" + x + "-" + z, GenerateCubeMesh());
      tile.material =
        color == "red" ? materialsRepo.redTile : materialsRepo.grayTile;
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

function createTree(height, positionVec3) {
  let tree = createNewWorldObject("tree", null, true);
  tree.modelMatrix = mat4.translate(tree.modelMatrix, positionVec3);

  let trunk = createNewWorldObject(
    "treeTrunk",
    GenerateCylinderMesh(height, height * 0.06)
  );
  trunk.material = new Material(
    getColorVec3("brown", Math.random() * 0.25 + 0.5),
    0
  );
  addChildWorldObject(tree, trunk);

  for (let i = 0; i < NUM_TREE_LEAVES; i++) {
    let leaf = createNewWorldObject(
      "leaf-" + i,
      GenerateSphereMesh(Math.random() * 0.5 + 0.5)
    );
    leaf.material = new Material(
      getColorVec3("green", Math.random() * 0.5 + 0.5),
      0.05
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
