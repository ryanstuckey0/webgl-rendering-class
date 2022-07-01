# Lab 4

My lab has five different shaders:

1. Phong - shades by interpolating values and calculating lighting in fragment shader
2. Toon - like Phong, but scales colors by a constant that changes depending on the color's intensity
3. Gouraud - shades by calculating values in vertex shader
4. Interpolated Normals - a debugging shader I used to make sure my normals were correct for the shapes
5. Normals - another debugging shader I used to make sure my normals were correct

Each of these shaders is implemented in my index.html file, but I have also extracted them to files under the [shaders](shaders/) folder for easier viewing and correct syntax highlighting.

Something I noticed with my Phong shader is that it only lights up part of my sky and grass shapes. I believe this is due to how I calculated my vertex normals and the shape of the object. When I create my objects, I set the normals to the same position as the vertex since my object is drawn centered at 0,0,0. Additionally, I scale that cube to be thinner and I think that is messing up my normals. I tried using the normals matrix (inverse transform of modelView matrix), but this caused my scene to go dark so that only ambient light was applied. I tried to figure it out for a long time without any luck. Eventually, I tried to calculate the normals in a different way by calculating them per face, but this did not fix my issue. It seems to fix the issue for objects with less curves, like the cube. But, it makes the image worse for curved objects, like the sphere.

## Controls

My program has four distinct control modes that change the scene in various ways. The controls for each mode are outlined below. Additionally, there are some controls that are available at all times.

| Action                                | Control |
| :------------------------------------ | :-----: |
| Switch to previous control mode       |    [    |
| Switch to next control mode           |    ]    |
| Switch to phong shader                |    4    |
| Switch to toon shader                 |    5    |
| Switch to gouraud shader              |    6    |
| Switch to interpolated normals shader |    7    |
| Switch to normals shader              |    8    |

The current shader and control mode can be seen at the bottom of the page. The default shader is Phong and the default control mode is light components.

### Control Mode: Light Components

This control mode controls which light components (i.e., ambient, diffuse, specular) are visible at a time.

| Action                  | Control |
| :---------------------- | :-----: |
| All light components on |    w    |
| Ambient light only      |    a    |
| Specular light only     |    s    |
| Diffuse light only      |    d    |
| Ambient light on/off    |    1    |
| Diffuse light on/off    |    2    |
| Specular light on/off   |    3    |

### Control Mode: Light Movement

This control mode allows the user to move the light around.

| Action        |  Control   |
| :------------ | :--------: |
| Move forward  |     w      |
| Move right    |     d      |
| Move backward |     s      |
| Move left     |     a      |
| Move up       |     e      |
| Move down     |     q      |
| Move faster   | Hold SHIFT |

### Control Mode: Camera

All camera controls are relative to its local transformation, meaning rotating the camera will changes which way up/down/left/right is. The camera works similar to the Unity Game Engine Editor camera when in Scene view.

| Action        |     Control      |
| :------------ | :--------------: |
| Move forward  |        w         |
| Move right    |        d         |
| Move backward |        s         |
| Move left     |        a         |
| Move up       |        e         |
| Move down     |        q         |
| Move faster   |    Hold SHIFT    |
| Rotate        | LMB + Move mouse |
| Reset         |        r         |

### Creature Controls

All creature controls are also relative to the creatures local transformation, similar to the camera.

Number keys 1-8 can be used to select which body part to rotate. Some parts can only be rotated along certain axis or they have a limited range of motion.

The movement can be locked to the camera with R, meaning W/A/S/D will also move the creature at the same time as the camera.

| Creature Controls           |            |
| :-------------------------- | :--------: |
| Move forward                |     w      |
| Move right                  |     d      |
| Move backward               |     s      |
| Move left                   |     a      |
| Move faster                 | Hold SHIFT |
| Rotate                      |    q/e     |
| Scale                       |    z/x     |
| Select neck to rotate       |     1      |
| Select head to rotate       |     2      |
| Select left leg to rotate   |     3      |
| Select left foot to rotate  |     4      |
| Select right leg to rotate  |     5      |
| Select right foot to rotate |     6      |
| Select left hand to rotate  |     7      |
| Select right hand to rotate |     8      |
| Rotate body part x-axis     |    f/c     |
| Rotate body part y-axis     |    g/v     |
| Rotate body part z-axis     |    h/b     |

---

## Files

- lab4.js - main file; contains functions used to respond to user input and draw scene
- index.html - html file to load scripts; also contains WebGL shaders
- glMatrix-0.9.5.min.js - contains functions for manipulating GL transformation matrices
- shaderSetup.js - initializes and compiles shaders
- worldHierarchyManager.js - a script I made used to handle parent-child relationship among objects in my scene; makes it easier to create complex object hierarchies with scene and then to get the matrix for each object in the hierarchy
- shapeGenerator.js - contains functions to generate new shapes in the scene or get meshes for shapes
- creature.js - contains all code necessary for creating and controlling creature in scene
- utilities.js - contains multiple useful functions used across the project
- worldGen.js - contains code specific to this scene that builds the shapes and adds them to the scene
- Material.js - includes a Material object and a materials repo that holds various materials used in my project
