class Material {
  constructor(colorVec3, shininessFloat) {
    this.ambient = colorVec3;
    this.diffuse = colorVec3;
    this.specular = colorVec3;
    this.shininess = shininessFloat;
  }
}

var materialsRepo = {
  light: new Material(getColorVec3("yellow"), 100),
  grass: new Material(getColorVec3("green", 0.4), 0.001),
  sky: new Material(getColorVec3("blue", 1.2), 0.001),
  grayTile: new Material(getColorVec3("gray", 0.5), 0.5),
  redTile: new Material(getColorVec3("red", 0.5), 0.5),
  cylinder: new Material(getColorVec3("red"), 0.1),
  cone: new Material(getColorVec3("orange"), 0.3),
  tetrahedron: new Material(getColorVec3("blue"), 0.5),
  sphere: new Material(getColorVec3("purple"), 0.7),
  cube: new Material(getColorVec3("pink"), 0.9),

  // creature
  body: new Material(getColorVec3("purple", 0.7), 0.1),
  leg: new Material(getColorVec3("blue", 0.7), 0),
  foot: new Material(getColorVec3("red", 0.7), 0.2),
  neck: new Material(getColorVec3("brown", 0.7), 0),
  head: new Material(getColorVec3("orange", 0.7), 0),
  eye: new Material(getColorVec3("blue"), 0.2),
  eyeball: new Material(getColorVec3("white"), 0.5),
  pupil: new Material(getColorVec3("black"), 0),
};
