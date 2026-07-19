---
title: 'Project: Teaching a Computer to See Shapes — No Neural Networks Allowed'
description: 'A 1987 theory of human vision, a watershed algorithm, and four classification rules — plus the rotated square that humbled all of them.'
pubDate: 2026-07-29
---

How hard can it be to tell a square from a triangle? Every neural network demo treats shape recognition as a solved warm-up. So for my robotics coursework I did it the hard way — the *pre-deep-learning* way: no training data, no learned features, just geometry, thresholds, and MATLAB. The assignment: build a complete vision pipeline that finds and labels circles, squares, triangles, and rectangles in real photographs.

The answer to "how hard can it be": delightfully, instructively hard. But first, the part that worked.

<figure>
	<img src="/images/rbc/labeled-blocks.jpg" alt="A photo of four wooden blocks — green cylinder, yellow triangle, red rectangle, blue square — each outlined in red and labeled by the system with its classification, area, perimeter, and aspect ratio" width="754" height="634" loading="lazy" />
	<figcaption>The pipeline's output on real blocks: every shape found, outlined, measured, and correctly named — including the metrics it used to decide.</figcaption>
</figure>

## A theory borrowed from your own head

The project takes its name from **Recognition-by-Components (RBC)** — Irving Biederman's 1987 theory of how *humans* recognize objects. His claim: you don't match whole objects against memory; you decompose what you see into a small alphabet of primitive 3D shapes he called **geons** (cylinders, bricks, wedges, cones), detected via "non-accidental" properties — symmetry, parallelism, curvature — that survive changes in viewpoint and lighting. A mug is a cylinder with a curved handle-geon, from almost any angle.

My version is the 2D miniature: the geon alphabet becomes circle, square, triangle, rectangle, and the non-accidental properties become measurable numbers. The interesting question is what happens when a tidy theory meets untidy pixels.

## Stage one: make the image confess

Raw photos are hostile to geometry — shadows, uneven light, color noise. The pre-processing stage is a sequence of simplifications, each throwing away information the shapes don't need:

1. **RGB → HSV.** In RGB, color and brightness are tangled together, so a shadow changes *everything* about a pixel. HSV separates hue (what color) from value (how bright), which tames lighting variation before anything else happens.
2. **Grayscale + contrast stretch.** Shape analysis doesn't need color at all; `imadjust` then stretches the intensity range so objects stand off the background.
3. **Binarize + despeckle.** Otsu's method picks the black/white threshold automatically, and an area-opening pass deletes any blob smaller than ~20 pixels — noise, dust, JPEG crumbs.

<figure>
	<img src="/images/rbc/hsv-channels.jpg" alt="The same photo of blocks shown as three grayscale images: the hue channel, saturation channel, and value channel" width="654" height="272" loading="lazy" />
	<figcaption>One photo, three opinions: the hue, saturation, and value channels. Splitting them is what lets the pipeline shrug off shadows.</figcaption>
</figure>

One hard-won lesson lives in this stage: the HSV trick that helps color photos actively *sabotages* grayscale line drawings — converting them could tint the background and convince the segmenter that the page, not the shapes, was the object. The fix was a conditional: detect grayscale inputs, invert them instead. Every vision pipeline accumulates these "…except when" branches; this was mine.

## Stage two: flood the landscape

With a clean binary image, the next problem is *separating* objects — especially ones that touch. The tool is the **watershed transform**, and it's the prettiest idea in the project.

Treat the image as terrain: pixel intensity is elevation. Now flood it. Water pools in the basins, and where two pools meet, a ridge line forms — those ridges are your object boundaries. To make each shape its own basin, you first compute a **distance transform**: every pixel's distance to the nearest background pixel, negated, so the *center* of each shape becomes the deepest point in its own valley:

```matlab
D = -bwdist(~bwImg);   % shape centers become the deepest basin points
D = imhmin(D, 2);      % drown shallow puddles (prevents over-segmentation)
L = watershed(D);      % flood; ridge lines between pools = object boundaries
```

The `imhmin` line matters more than it looks: without it, every minor dimple in a shape becomes its own basin and the watershed happily shatters one square into confetti. Suppressing shallow minima is the difference between segmentation and vandalism.

<figure>
	<img src="/images/rbc/watershed-segmentation.png" alt="Side-by-side montage: eight black shapes on white, and the same image after watershed segmentation with each shape colored differently" width="1200" height="341" loading="lazy" />
	<figcaption>Watershed output: each separated region gets its own label (shown as color) — even where shapes touch.</figcaption>
</figure>

## Stage three: measure, then judge

For each segmented region, `regionprops` reports the raw facts — area, perimeter, bounding box, centroid — and from those, three derived metrics do all the actual thinking:

| Metric | Formula | What it whispers |
| ------ | ------- | ---------------- |
| Circle metric | P² / A | ≈ 4π (~12.57) only for a true circle |
| Aspect ratio | width / height | ≈ 1 for squares and circles |
| Extent | A / bounding-box area | how much of its box the shape fills |

The circle metric is my favorite: it's the isoperimetric inequality moonlighting as a classifier — the circle is the *only* shape where perimeter² over area hits 4π, and the ratio is scale-invariant for free. The rules then fall in a cascade:

```matlab
if abs(circleMetric - 4*pi) < 2
    shapeType = 'Circle';
elseif abs(aspectRatio - 1) < 0.2 && extent > 0.85
    shapeType = 'Square';       % square-ish box, and it fills it
elseif extent < 0.65
    shapeType = 'Triangle';     % triangles can't fill their box
else
    shapeType = 'Rectangle';    % everything else
end
```

Four rules, three thresholds, zero training. On clean scenes — separated shapes, decent contrast — it simply works, as the photo up top shows. And then it meets a rotated square.

## The failure gallery

**Exhibit A: the 45° square.** Rotate a square and the system calls it a triangle — *consistently*. The bug is beautiful once you see it: the bounding box is **axis-aligned**, so a square rotated 45° sits inside a box roughly twice its area. Extent drops from ~1.0 to ~0.5, sails under the 0.65 triangle threshold, and the rule cascade never gets a chance to reconsider. The classifier isn't seeing the shape; it's seeing the shape's *shadow on the pixel grid's axes* — precisely the viewpoint-dependence Biederman's theory says real perception avoids.

<figure>
	<img src="/images/rbc/rotated-fail.png" alt="Several rotated squares outlined and incorrectly labeled as triangles, alongside an upright square and a circle labeled correctly" width="809" height="537" loading="lazy" />
	<figcaption>Exhibit A: every rotated square confidently labeled “Triangle.” The upright square and the circle, unbothered, classify fine.</figcaption>
</figure>

**Exhibit B: the imperfect circle.** A real wooden cylinder, photographed slightly squashed, pushed P²/A just past the ±2 tolerance — and fell through the cascade to the default label. The system printed "Rectangle" on a circle with total confidence.

<figure>
	<img src="/images/rbc/circle-fail.jpg" alt="A stack of blocks where a green circular block is outlined and mislabeled as a rectangle" width="532" height="620" loading="lazy" />
	<figcaption>Exhibit B: one slightly imperfect circle, one confidently wrong label. Fixed thresholds don't do “almost.”</figcaption>
</figure>

**Exhibit C: composite scenes.** A stick figure, a house, a toy car — arrangements where shapes touch and overlap heavily. The watershed merged what it couldn't separate, and the classifier gamely labeled the merged blobs. Garbage segmentation in, garbage classification out: every stage depends entirely on the one before it.

## What the failures teach

Each threshold in that cascade — the ±2, the 0.2, the 0.65, the 0.85 — is a small confession: *here is exactly where my model of "square" ends*. That's the trade at the heart of classical vision. Rule-based systems are transparent — when mine failed, I could point to the exact comparison that failed and *why*, something no CNN will offer — but brittle, because the rules encode assumptions (like "bounding boxes align with shapes") that reality ignores. Learned systems flip the bargain: robust to rotation and imperfection, opaque about their reasons.

The fixes are knowable, which is the charm of this approach: a rotation-invariant box (`MinFeretDiameter` or PCA orientation) dissolves Exhibit A; adaptive tolerances soften Exhibit B; smarter markers help C. And the ideas here don't retire — segmentation, region properties, and structural decomposition all live on inside modern pipelines, just with learned components where my thresholds sat.

It also reframed a plan of mine. The [pick-and-place gantry](/blog/pick-and-place-gantry/) currently waits for an ultrasonic ping to announce an object at a fixed station; its roadmap says "camera-based detection." Having now built the seeing part by hand, I know exactly what that upgrade costs — and that when the gripper someday reaches for a square that's rotated 45°, I'll be checking the extent threshold first.
