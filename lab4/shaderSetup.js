// Based on shader-setup.js created by Han-Wei Shen (shen.94@osu.edu)
// From https://github.com/imindseye/WebGL-tutorial/blob/master/shaders_setup.js

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function createShaderProgram(
  gl,
  shaders,
  name,
  vertexShaderId,
  fragmentShaderId
) {
  let shaderProgram = gl.createProgram();

  var fragmentShader = getShader(gl, fragmentShaderId);
  var vertexShader = getShader(gl, vertexShaderId);

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialize shaders");
  }

  gl.useProgram(shaderProgram);

  fetchShaderVariables(gl, shaderProgram);
  enableShaderVariables(gl, shaderProgram);

  shaderProgram.name = name;
  shaders[name] = shaderProgram;
}

function switchShaderProgram(gl, shaders, name) {
  if (!name in shaders) {
    console.log("Shader program with name " + name + " could not be found.");
    return;
  }
  let newShaderProgram = shaders[name];
  shaders.activeShader = newShaderProgram;
  gl.useProgram(newShaderProgram);
  enableShaderVariables(gl, newShaderProgram);
  document.getElementById("current-shader").innerHTML = "Current Shader: " + name;
}

function enableShaderVariables(gl, shaderProgram) {
  // enable vertex attributes
  gl.enableVertexAttribArray(shaderProgram.aVertexPosition);
  gl.enableVertexAttribArray(shaderProgram.aVertexNormal);
}

function fetchShaderVariables(gl, shaderProgram) {
  // get vertex attributes
  shaderProgram.aVertexPosition = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition"
  );

  shaderProgram.aVertexNormal = gl.getAttribLocation(
    shaderProgram,
    "aVertexNormal"
  );

  // get matrix uniforms
  shaderProgram.uModelMatrix = gl.getUniformLocation(
    shaderProgram,
    "uModelMatrix"
  );

  shaderProgram.uViewMatrix = gl.getUniformLocation(
    shaderProgram,
    "uViewMatrix"
  );

  shaderProgram.uProjectionMatrix = gl.getUniformLocation(
    shaderProgram,
    "uProjectionMatrix"
  );

  shaderProgram.uNormalMatrix = gl.getUniformLocation(
    shaderProgram,
    "uNormalMatrix"
  );

  shaderProgram.uModelViewMatrix = gl.getUniformLocation(
    shaderProgram,
    "uModelViewMatrix"
  );

  shaderProgram.uModelViewProjectionMatrix = gl.getUniformLocation(
    shaderProgram,
    "uModelViewProjectionMatrix"
  );

  // get light uniforms
  shaderProgram.uLightPosition = gl.getUniformLocation(
    shaderProgram,
    "uLightPosition"
  );

  shaderProgram.uLightAmbient = gl.getUniformLocation(
    shaderProgram,
    "uLightAmbient"
  );

  shaderProgram.uLightDiffuse = gl.getUniformLocation(
    shaderProgram,
    "uLightDiffuse"
  );

  shaderProgram.uLightSpecular = gl.getUniformLocation(
    shaderProgram,
    "uLightSpecular"
  );

  // material uniforms
  shaderProgram.uMaterialAmbient = gl.getUniformLocation(
    shaderProgram,
    "uMaterialAmbient"
  );

  shaderProgram.uMaterialDiffuse = gl.getUniformLocation(
    shaderProgram,
    "uMaterialDiffuse"
  );

  shaderProgram.uMaterialSpecular = gl.getUniformLocation(
    shaderProgram,
    "uMaterialSpecular"
  );

  shaderProgram.uMaterialShininess = gl.getUniformLocation(
    shaderProgram,
    "uMaterialShininess"
  );
}
