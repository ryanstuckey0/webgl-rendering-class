function vec3ToVec4(vec3) {
  return [vec3[0], vec3[1], vec3[2], 1];
}

function vec4ToVec3(vec4) {
  return [vec4[0], vec4[1], vec4[2]];
}

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function getColor(color, intensity = 1) {
  switch (color) {
    case "red":
      return [1 * intensity, 0 * intensity, 0 * intensity, 1];
    case "green":
      return [0 * intensity, 1 * intensity, 0 * intensity, 1];
    case "blue":
      return [0 * intensity, 0 * intensity, 1 * intensity, 1];
    case "yellow":
      return [1 * intensity, 1 * intensity, 0 * intensity, 1];
    case "orange":
      return [1 * intensity, 0.4 * intensity, 0 * intensity, 1];
    case "purple":
      return [0.44 * intensity, 0 * intensity, 1 * intensity, 1];
    case "brown":
      return [0.65 * intensity, 0.16 * intensity, 0.16 * intensity, 1];
    case "pink":
      return [1 * intensity, 0 * intensity, 0.65 * intensity, 1];
    case "black":
      return [0 * intensity, 0 * intensity, 0 * intensity, 1];
    case "white":
      return [1 * intensity, 1 * intensity, 1 * intensity, 1];
    case "burgundy":
      return [0.51 * intensity, 0 * intensity, 0.125 * intensity, 1];
    case "gray":
      return [0.75 * intensity, 0.75 * intensity, 0.75 * intensity, 1];
  }
}

function getDividedColor(numVertices, colors) {
  let vertexColors = [];
  let numDivisions = colors.length;
  let sectionSize = numVertices / numDivisions;
  for (let i = 0; i < numDivisions; i++)
    for (let j = i * sectionSize; j < i * sectionSize + sectionSize; j++)
      vertexColors[j] = colors[i][j % 3];
  return vertexColors;
}
