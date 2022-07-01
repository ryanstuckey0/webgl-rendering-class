function createNewTexture(gl, src) {
  let texture = gl.createTexture();
  texture.name = src;
  texture.image = new Image();
  texture.image.onload = function () {
    onTextureLoad(texture);
  };
  texture.image.src = src;

  return texture;
}

function initializeTextures(gl, texturePaths) {
  texturePaths.forEach((path) => {
    textures[path] = createNewTexture(gl, path);
  });
}

function initOrGetTexture(gl, texturePath) {
  if(texturePath == null) return null;
  if (textures.hasOwnProperty(texturePath)) return textures[texturePath];
  textures[texturePath] = createNewTexture(gl, texturePath);
}

function getTexture(texturePath) {
  return textures[texturePath];
}

function onTextureLoad(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    texture.image
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  drawScene();
}
