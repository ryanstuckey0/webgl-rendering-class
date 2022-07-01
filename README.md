# cse5542-rendering

A repo for the class I took at The Ohio State University, CSE 5542- Real Time Rendering.

Real Time Rendering served as an introduction to lower level graphics APIs. In this class, we learned a lot about how rendering works by talking about talking about WebGL.

## Tips & Tricks

### Passing Uniforms to Shaders

The following methods can be used to pass uniforms to shaders:

```GLSL
// passing floats in vectors
gl.uniform1f (floatUniformLoc, v)             // for float
gl.uniform1fv(floatUniformLoc, [v])            // for float or float arr
gl.uniform2f (vec2UniformLoc, v0,v1)         // for vec2
gl.uniform2fv(vec2UniformLoc, [v0,v1])        // for vec2 or vec2 array
gl.uniform3f (vec3UniformLoc, v0,v1,v2)      // for vec3
gl.uniform3fv(vec3UniformLoc, [v0,v1,v2])     // for vec3 or vec3 arr
gl.uniform4f (vec4UniformLoc, v0,v1,c2,v3)   // for vec4
gl.uniform4fv(vec4UniformLoc, [v0,v1,v2,v3])  // for vec4 or vec4 arr

// passing floats in matrices
gl.uniformMatrix2fv(mar2UniformLoc, false, [ 4x elements arr]) //mat2|mat2 arr
gl.uniformMatrix3fv(mar3UniformLoc, false, [ 9x elements arr]) //mat3|mat3 arr
gl.uniformMatrix3fv(mar3UniformLoc, false, [16x elements arr]) //mat4|mat4 arr

// passing ints in vectors
gl.uniform1i (intUniformLoc, v);            // for int
gl.uniform1iv(intUniformLoc, [v]);           // for int or int array
gl.uniform2i (ivec2UniformLoc, v0, v1);     // for ivec2
gl.uniform2iv(ivec2UniformLoc, [v0, v1]);    // for ivec2 or ivec2 arr
gl.uniform3i (ivec3UniformLoc, v0, v1, v2)  // for ivec3
gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]) // for ivec3 or invec3 arr
gl.uniform4i (ivec3UniformLoc, v0, v1, v2, v3)  // for ivec4
gl.uniform4iv(ivec3UniformLoc, [v0, v1, v2, v3]) // for ivec4 or ivec4 arr
```
