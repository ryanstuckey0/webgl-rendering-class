class Material {
  constructor(colorVec3, shininessFloat) {
    this.ambient = colorVec3;
    this.diffuse = colorVec3;
    this.specular = colorVec3;
    this.shininess = shininessFloat;
    this.texture = null;
  }
}

function getTexturedMaterial(materialName, textureSrc, shininess) {
  if (materialsRepo.hasOwnProperty(materialName))
    return materialsRepo[materialName];
  if (!textures.hasOwnProperty(textureSrc))
    textures[textureSrc] = createNewTexture(gl, textureSrc);
  materialsRepo[materialName] = new Material(getColorVec3("white"), shininess);
  materialsRepo[materialName].texture = textures[textureSrc];
  return materialsRepo[materialName];
}

var materialsRepo = {
  grayTile: new Material(getColorVec3("gray", 0.5), 1),
  redTile: new Material(getColorVec3("red", 0.5), 1),
  cylinder: new Material(getColorVec3("red"), 0.1),
  cone: new Material(getColorVec3("orange"), 0.3),
  tetrahedron: new Material(getColorVec3("blue"), 0.5),
  sphere: new Material(getColorVec3("purple"), 0.7),
  cube: new Material(getColorVec3("pink"), 0.9),

  // creature
  body: new Material(getColorVec3("purple", 0.7), 50),
  leg: new Material(getColorVec3("blue", 0.7), 100),
  foot: new Material(getColorVec3("red", 0.7), 100),
  neck: new Material(getColorVec3("brown", 0.7), 1),
  head: new Material(getColorVec3("orange", 0.7), 1),
  eye: new Material(getColorVec3("blue"), 1000),
  eyeball: new Material(getColorVec3("white"), 1000),
  pupil: new Material(getColorVec3("black"), 0.000001),
};
