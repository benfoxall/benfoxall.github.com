---
layout: post.njk
title: Video in Space
permalink: 2025/07/16/video-space/
draft: true
---

Here's a video from my [drone] aligned to the path of flight.

<pose-aligned poses="https://vs.benjaminbenben.com/motocamp/poses.ply" points="https://vs.benjaminbenben.com/motocamp/points.bin.ply">
    <video src="https://vs.benjaminbenben.com/motocamp/720.mp4" crossorigin="anonymous" muted id="autoplay"></video>
</pose-aligned>



### Locating frames

Consumer DJI drones can provide you a telemetry data file with it’s location & altitude but unfortunately nothing about the orientation or camera angle.  So I extracted video frames and ran them through [colmap][colmap] to find the orientation of each frame of the video. As a bonus I got a sparse point cloud of the matching points in the scene.

I wrote some slightly scrappy code to extract and serialise the poses and points into a ply file that I could load into a webgl component.

### Implementation

I’m pretty happy with my approach for embedding this, it’s a web component that wraps a `<video />` element with links to the colmap data:

```html
<pose-aligned poses="poses.ply" points="points.ply">
  <video src="motocamp.mp4"></video>
</pose-aligned>
```

Internally it hides the video element, loads the pose/points resources, then adds a canvas and some html controls.  The video element playback drives the visualisation, which I found pretty handy for adding play/pause/seek controls.

The scene is rendered with threejs. The key element is a 2d texture array to stash the all the video frames in, with an instanced mesh that allows everything to be drawn together. My original approach for pushing the frames was using a 2dCanvas to write the pixels into a array buffer, but I found `WebGLArrayRenderTarget` which lets you populate texture arrays directly!

I don’t want/need to capture a pose for every frame of video so downsampled it (from 60 &rarr; 2hz) and interpolated to find the frames. Orientation is quite straightforward in threejs, but for translation I was really happy when I found [curve-interpolator].




<script src="/js/video-space.js"></script>
<script>
    document.getElementById('autoplay')?.addEventListener('loadeddata', function() {
        this.play();
    });
</script>

[drone]: https://www.dji.com/mini-4-pro
[motovideo]: https://customer-j0h94e0v9rsg8l40.cloudflarestream.com/0c7e1abdb84a5752024cbd417fadc08c/watch
[webvtt]: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
[colmap]: https://colmap.github.io/
[done-dataset]: https://fpv.ifi.uzh.ch/datasets/
[curve-interpolator]: https://www.npmjs.com/package/curve-interpolator
