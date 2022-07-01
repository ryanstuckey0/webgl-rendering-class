# Lab 3

## Controls

### Camera Controls

All camera controls are relative to its local transformation, meaning rotating the camera will changes which way up/down/left/right is. The camera works similar to the Unity Game Engine Editor camera when in Scene view.

| Camera Controls |                  |
| :-------------- | :--------------: |
| Move forward    |        w         |
| Move right      |        d         |
| Move backward   |        s         |
| Move left       |        a         |
| Move up         |        e         |
| Move down       |        q         |
| Move faster     |    Hold SHIFT    |
| Rotate          | LMB + Move mouse |
| Reset           |        t         |

### Creature Controls

All creature controls are also relative to the creatures local transformation, similar to the camera.

Number keys 1-8 can be used to select which body part to rotate. Some parts can only be rotated along certain axis or they have a limited range of motion.

The movement can be locked to the camera with R, meaning W/A/S/D will also move the creature at the same time as the camera.

| Creature Controls           |            |
| :-------------------------- | :--------: |
| Move forward                |     i      |
| Move right                  |     l      |
| Move backward               |     k      |
| Move left                   |     j      |
| Move faster                 | Hold SHIFT |
| Lock movement to camera     |     r      |
| Rotate                      |    u/o     |
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

- lab3.js - main file; contains functions used to respond to user input and draw scene
- lab3.html - html file to load scripts; also contains WebGL shaders
- glMatrix-0.9.5.min.js - contains functions for manipulating GL transformation matrices
- shaderSetup.js - initializes and compiles shaders
- worldHierarchyManager.js - a script I made used to handle parent-child relationship among objects in my scene; makes it easier to create complex object hierarchies with scene and then to get the matrix for each object in the hierarchy
- shapeGenerator.js - contains functions to generate new shapes in the scene or get meshes for shapes
- creature.js - contains all code necessary for creating and controlling creature in scene
- utilities.js - contains multiple useful functions used across the project
- worldGen.js - contains code specific to this scene that builds the shapes and adds them to the scene
