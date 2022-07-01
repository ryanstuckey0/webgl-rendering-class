# Mini Lab 3

All the transformations for my creature lie in the file "2d-creature.js" to
reduce the amount of code in my main javascript file.

My creature has six different arms/legs, so I made a system to select
which arm to control to cut down on the number of keys needed to
manipulate my drawing. The arms are number 1-6, starting at the top left
and going counter-clockwise (e.g., arm #1 is the top left, arm #2 is the
middle left, etc). After selecting a arm using the number keys, it can be
controlled using the keys below. Not every arm is the same, so some
controls cannot be used on specific arms.

| Basic Controls         |           |
| :--------------------- | :-------: |
| Move shape up          |     w     |
| Move shape right       |     d     |
| Move shape down        |     s     |
| Move shape left        |     a     |
| Make shape smaller     |     f     |
| Make shape bigger      | F + Shift |
| Rotate CW              |     r     |
| Rotate CCW             | R + shift |
| Toggle Axis Visibility |     e     |
| Switch Draw Mode       |     q     |

| Head Movement Controls |           |
| :--------------------- | :-------: |
| Rotate Neck CW         |     v     |
| Rotate Neck CCW        | V + Shift |
| Rotate Head CW         |     b     |
| Rotate Head CCW        | B + Shift |
| Rotate Left Eye CW     |     z     |
| Rotate Left Eye CCW    | Z + Shift |
| Rotate Middle Eye CW   |     x     |
| Rotate Middle Eye CCW  | X + Shift |
| Rotate Right Eye CW    |     c     |
| Rotate Right Eye CCW   | C + Shift |

| Tentacle Movement Controls |                |
| :------------------------- | :------------: |
| Select Tentacle to Move    | Number Row 1-6 |
| Rotate main tentacle CW    |       t        |
| Rotate main tentacle CCW   |   T + Shift    |
| Rotate sub-tentacle CW     |       y        |
| Rotate sub-tentacle CWW    |   Y + Shift    |
| Rotate Finger/Foot 1 CW    |       g        |
| Rotate Finger/Foot 1 CCW   |   G + Shift    |
| Rotate Finger 2 CW         |       h        |
| Rotate Finger 2 CCW        |   H + Shift    |

\*CW = clockwise, CCW = counter-clockwise
