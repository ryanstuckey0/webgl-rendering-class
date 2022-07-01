# Lab 5

## New Features

### Required Features:

1. Texture Mapping - nearly all surfaces have some sort of texture on
2. Parametric Surface- there are two trefoil knots that can be seen right away when starting up the program. The trefoil knot has the equation:

   ```
   x = sin(t) + 2sin(2t)
   y = cos(t) - 2cos(2t)
   z = -sin(3t)
   ```

   where _t_ is on [0, 2\*PI]. The code for how this is generated can be seen in shapeGenerator.js, in the function GenerateTrefoilMesh. In short, I moved from 0 to 1 in arbitrary increments determined by my resolution. I then multiplied the value of my iterator by 2\*PI to get my value for t.

3. Textured Parametric Surface- both trefoil knots have a fire texture on them. The texture coordinates were chosen based on the value of the iterator mentioned above.
4. Polygonal Model- I have included a model of a McLaren sports car in my scene using the provided OBJLoader utilities.
5. 3D Environment- I created a unique 3D environment with shapes, a road, randomly generated trees, a sky, and a controllable creature.

### Bonus Features:

6. Environmental cube mapping- not completed
7. Textured Polygonal Model- my model has textures so that it is not all one color.
8. First Person Camera- the scene initially starts out in a fixed camera, but it can be switch to a moveable first person camera by clicking the "FPS" button on the right side of the screen. The camera can then be moved by selecting the "Camera" control mode button on the right side of the screen. The controls for it are below.
9. Class presentation- I presented in class on 12/7.

---

## Controls

My program has five distinct control modes that change the scene in various ways. The controls for each mode are outlined below and can be changed via the buttons on the right side of the screen. Additionally, the shaders can be switched at any time with these keys:

| Action                                | Control |
| :------------------------------------ | :-----: |
| Switch to phong shader                |    4    |
| Switch to toon shader                 |    5    |
| Switch to interpolated normals shader |    6    |
| Switch to normals shader              |    7    |

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

### Control Mode: Car

The car can be moved back and forth along the road.

| Action        |     Control      |
| :------------ | :--------------: |
| Move forward  |        w         |
| Move backward |        s         |

### Control Mode: Creature Controls

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

- lab5.js - main file; contains functions used to respond to user input and draw scene
- index.html - html file to load scripts; also contains WebGL shaders
- glMatrix-0.9.5.min.js - contains functions for manipulating GL transformation matrices
- shaderSetup.js - initializes and compiles shaders
- worldHierarchyManager.js - a script I made used to handle parent-child relationship among objects in my scene; makes it easier to create complex object hierarchies with scene and then to get the matrix for each object in the hierarchy
- shapeGenerator.js - contains functions to generate new shapes in the scene or get meshes for shapes
- creature.js - contains all code necessary for creating and controlling creature in scene
- utilities.js - contains multiple useful functions used across the project
- worldGen.js - contains code specific to this scene that builds the shapes and adds them to the scene
- Material.js - includes a Material object and a materials repo that holds various materials used in my project
- Texture.js - utility file to load textures
