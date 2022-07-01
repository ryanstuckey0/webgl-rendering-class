//////////////////////////////////////////////////////////////////
//
//  CSE 5542 OBJ Loader
//

function initOBJLoader(objSrc, mtlSrc, worldObject) {
  setStatus("Not ready. Reading OBJ files...");
  var request = new XMLHttpRequest();
  request.open("GET", objSrc);
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      console.log("state =" + request.readyState);
      mtlLoader(request.responseText, mtlSrc, worldObject);
    }
  };
  request.send();
}

function mtlLoader(objText, mtlSrc, worldObject) {
  var request = new XMLHttpRequest();
  request.open("GET", mtlSrc);
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      console.log("state =" + request.readyState);
      let obj = parseOBJ(objText);
      let mtl = parseMTL(request.responseText);
      initOBJBuffers(obj, mtl, worldObject);
    }
  };
  request.send();
}

function initOBJBuffers(objData, mtlData, worldObject) {
  let objVertexPositionBuffers = [];
  let objVertexNormalBuffers = [];
  let objVertexTexCoordBuffers = [];
  let mtlKa = [];
  let mtlKd = [];
  let mtlKs = [];
  let mtlShininess = [];
  let mtlMapKa = [];
  let mtlMapKd = [];
  let mtlMapKs = [];
  console.log(objData);
  console.log(mtlData);
  for (let geometry of objData.geometries) {
    let curVertexPositionBuffers = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, curVertexPositionBuffers);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.data.position),
      gl.STATIC_DRAW
    );
    curVertexPositionBuffers.itemSize = 3;
    curVertexPositionBuffers.numItems = geometry.data.position.length / 3;
    objVertexPositionBuffers.push(curVertexPositionBuffers);

    let curVertexNormalBuffers = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, curVertexNormalBuffers);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.data.normal),
      gl.STATIC_DRAW
    );
    curVertexNormalBuffers.itemSize = 3;
    curVertexNormalBuffers.numItems = geometry.data.normal.length / 3;
    objVertexNormalBuffers.push(curVertexNormalBuffers);

    let curVertexTexCoordBuffers = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, curVertexTexCoordBuffers);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.data.texcoord),
      gl.STATIC_DRAW
    );
    curVertexTexCoordBuffers.itemSize = 2;
    curVertexTexCoordBuffers.numItems = geometry.data.texcoord.length / 2;
    objVertexTexCoordBuffers.push(curVertexTexCoordBuffers);

    mtlKa.push(mtlData[geometry.material].ambient);
    mtlKd.push(mtlData[geometry.material].diffuse);
    mtlKs.push(mtlData[geometry.material].specular);
    mtlShininess.push(mtlData[geometry.material].shininess);

    if (mtlData[geometry.material].ambientMap != null)
      mtlMapKa.push(mtlData[geometry.material].ambientMap);
    else mtlMapKa.push(null);
    if (mtlData[geometry.material].diffuseMap != null)
      mtlMapKd.push(mtlData[geometry.material].diffuseMap);
    else mtlMapKd.push(null);
    if (mtlData[geometry.material].specularMap != null)
      mtlMapKs.push(mtlData[geometry.material].specularMap);
    else mtlMapKs.push(null);
  }

  worldObject.empty = false;
  worldObject.obj = {
    objVertexPositionBuffers: objVertexPositionBuffers,
    objVertexNormalBuffers: objVertexNormalBuffers,
    objVertexTexCoordBuffers: objVertexTexCoordBuffers,
    mtlKa: mtlKa,
    mtlKd: mtlKd,
    mtlKs: mtlKs,
    mtlShininess: mtlShininess,
    mtlMapKa: mtlMapKa,
    mtlMapKd: mtlMapKd,
    mtlMapKs: mtlMapKs,
  };

  drawScene();
  setStatus("Ready.");
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

function drawOBJ(obj, mv, p, shaderProgram, light) {
  for (let i = 0; i < obj.objVertexPositionBuffers.length; i++) {
    // 1. bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.objVertexPositionBuffers[i]);
    gl.vertexAttribPointer(
      shaderProgram.aVertexPosition,
      obj.objVertexPositionBuffers[i].itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    // 2. bind color buffer
    // not used

    // 3. bind materials uniforms
    if (shaders.activeShader.uMaterialAmbient != null)
      gl.uniform3f(
        shaderProgram.uMaterialAmbient,
        obj.mtlKa[i][0],
        obj.mtlKa[i][1],
        obj.mtlKa[i][2],
        1.0
      );
    if (shaders.activeShader.uMaterialDiffuse != null)
      gl.uniform3f(
        shaderProgram.uMaterialDiffuse,
        obj.mtlKd[i][0],
        obj.mtlKd[i][1],
        obj.mtlKd[i][2],
        1.0
      );
    if (shaders.activeShader.uMaterialSpecular != null)
      gl.uniform3f(
        shaderProgram.uMaterialSpecular,
        obj.mtlKs[i][0],
        obj.mtlKs[i][1],
        obj.mtlKs[i][2],
        1.0
      );
    if (shaders.activeShader.uMaterialShininess != null)
      gl.uniform1f(shaderProgram.uMaterialShininess, 25 / obj.mtlShininess[i]);

    // 4. bind normals buffer
    if (shaders.activeShader.aVertexNormal != -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, obj.objVertexNormalBuffers[i]);
      gl.vertexAttribPointer(
        shaderProgram.aVertexNormal,
        obj.objVertexNormalBuffers[i].itemSize,
        gl.FLOAT,
        false,
        0,
        0
      );
    }

    // 5. Set matrix uniforms
    gl.uniformMatrix4fv(shaders.activeShader.uModelViewMatrix, false, mv);
    gl.uniformMatrix4fv(shaders.activeShader.uProjectionMatrix, false, p);

    // 6. light uniforms
    if (shaderProgram.uLightPosition != null)
      gl.uniform3fv(shaderProgram.uLightPosition, light.position);

    if (shaderProgram.uLightAmbient != null)
      gl.uniform3fv(
        shaderProgram.uLightAmbient,
        ambientOn ? light.ambient : [0, 0, 0]
      );

    if (shaderProgram.uLightDiffuse != null)
      gl.uniform3fv(
        shaderProgram.uLightDiffuse,
        diffuseOn ? light.diffuse : [0, 0, 0]
      );

    if (shaderProgram.uLightSpecular != null)
      gl.uniform3fv(
        shaderProgram.uLightSpecular,
        specularOn ? light.specular : [0, 0, 0]
      );

    // 8. Set texture attributes/uniform
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.objVertexTexCoordBuffers[i]);
    gl.vertexAttribPointer(
      shaderProgram.aVertexTexCoord,
      obj.objVertexTexCoordBuffers[i].itemSize,
      gl.FLOAT,
      false,
      0,
      0
    );

    // 9. set texture lighting maps

    if (obj.mtlMapKa[i] != null) {
      gl.uniform1i(shaderProgram.uEnableMapKa, 1);
      gl.activeTexture(gl.TEXTURE0); // set texture unit 0 to use
      gl.bindTexture(gl.TEXTURE_2D, obj.mtlMapKa[i]); // bind the texture object to the texture unit
      gl.uniform1i(shaderProgram.uTextureKa, 0); // pass the texture unit to the shader
    } else gl.uniform1i(shaderProgram.uEnableMapKa, 0);

    if (obj.mtlMapKd[i] != null) {
      gl.uniform1i(shaderProgram.uEnableMapKd, 1);
      gl.activeTexture(gl.TEXTURE1); // set texture unit 0 to use
      gl.bindTexture(gl.TEXTURE_2D, obj.mtlMapKd[i]); // bind the texture object to the texture unit
      gl.uniform1i(shaderProgram.uTextureKd, 1); // pass the texture unit to the shader
    } else gl.uniform1i(shaderProgram.uEnableMapKd, 0);

    if (obj.mtlMapKs[i] != null) {
      gl.uniform1i(shaderProgram.uEnableMapKs, 1);
      gl.activeTexture(gl.TEXTURE2); // set texture unit 1 to use
      gl.bindTexture(gl.TEXTURE_2D, obj.mtlMapKs[i]); // bind the texture object to the texture unit
      gl.uniform1i(shaderProgram.uTextureKs, 2); // pass the texture unit to the shader
    } else gl.uniform1i(shaderProgram.uEnableMapKs, 0);

    // 10. draw
    gl.drawArrays(gl.TRIANGLES, 0, obj.objVertexPositionBuffers[i].numItems);
  }
}
