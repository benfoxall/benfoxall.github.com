---
layout: post.njk
title: Video Space
description: Pose-aligned video tracking with WebGL
permalink: 2025/07/16/video-space/
image: /img/social/video-space.jpg
draft: true
---

Here's a video that's played back in the space it was captured
{:.lead}

👀 It's interactive, drag the viewer to explore

<pose-tracker poses="https://vs.benjaminbenben.com/motocamp/poses.ply" points="https://vs.benjaminbenben.com/motocamp/points.bin.ply">
    <video src="https://vs.benjaminbenben.com/motocamp/720.mp4" crossorigin="anonymous" muted autoplay playsinline></video>
</pose-tracker>

<script src="/js/pose-tracker.js" async></script>

<label style="padding-top: .5em; display: block">
    <select>
        <option value="motocamp">Motocamping</option>
        <option value="wall">Walking along a beach towards some grafitti</option>
        <option value="bike-dog">Cycling next to a friendly dog</option>
        <option value="drone-chile">A confluence in Chile</option>
        <option value="mizen-walk">A start/finish line</option>
        <option value="mizen-fly">Flying over some cliffs</option>
    </select>
    <script>
        document.currentScript.previousElementSibling.addEventListener('change', ({target: {value}}) => {
            document.querySelector('pose-tracker').outerHTML = `
                    <pose-tracker 
                        poses="https://vs.benjaminbenben.com/${value}/poses.ply" 
                        points="https://vs.benjaminbenben.com/${value}/points.bin.ply">
                        <video src="https://vs.benjaminbenben.com/${value}/720.mp4" crossorigin="anonymous" muted autoplay playsinline></video>
                    </pose-tracker>
                `
            document.querySelector('pose-tracker video').play()
        })
    </script>
    &larr; More videos 
</label>

### Locating frames

I was hoping to use the telemetry data from my [drone]; it produces a text file with the location of the drone as it captures video.  However this doesn't include orientation or camera gimble info so I wasn't able to map it into a pose.

So I decided to use [COLMAP], a Structure-from-Motion tool which allows you to take a series of images to build a 3d scene.  COLMAP also captures the position from which each image was captured which I was able to use for aligning the video frames. As a bonus, this works for for other video sources, not just drones.

I wrote some slightly scrappy code to extract and serialise the poses and points into a ply file that I could load into a webgl component.  You can read some of the process (and see some gaussian splats) on this [bluesky] thread.

### Implementation

I’m pretty happy with how this is structured, it’s a web component that wraps a `<video />` element with links to the colmap data:

```html
<pose-tracker poses="poses.ply" points="points.ply">
  <video src="motocamp.mp4"></video>
</pose-tracker>
```

Internally the video element is hidden but still drives the playback of the component, which is some html controls & a webgl canvas element.

The canvas is rendered by threejs. The key trick is using a single 2d texture array to stash the historical video frames, with an instanced mesh that allows everything to be drawn together. My original approach for pushing the frames was using a 2dCanvas to write the pixels into a array buffer, but I found `WebGLArrayRenderTarget` which lets you populate texture arrays directly!

I didn't want/need every frame of the video, so I sampled it (from 60 &rarr; 2-5 Hz) and interpolate to find the position at a set timestamp. Orientation is quite straightforward in threejs, but for translation I was really happy when I found [curve-interpolator].

## Data sources & formats

Using structure from motion is cool, but you can get potentially richer data from sensors on the capture device.

For drones, the [UZH-FPV Drone Racing Dataset][done-dataset] is a great example of the sort of data that's available.

For capturing from a mobile device [WebXR Raw Camera Access][webxr] could be an option for capturing pose-aligned video.

GoPro cameras have a [telemetry format][gpmf] which looks like it captures a bunch of metadata.

And for output formats, I enjoyed using [ply] because it's so lightweight/flexible (it can be just a text file!). But if I was doing this properly I'd probably use something like [mcap] to link everything together.


[drone]: https://www.dji.com/mini-4-pro
[motovideo]: https://customer-j0h94e0v9rsg8l40.cloudflarestream.com/0c7e1abdb84a5752024cbd417fadc08c/watch
[webvtt]: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
[COLMAP]: https://colmap.github.io/
[done-dataset]: https://fpv.ifi.uzh.ch/datasets/
[webxr]: https://immersive-web.github.io/raw-camera-access/
[curve-interpolator]: https://www.npmjs.com/package/curve-interpolator
[bluesky]: https://bsky.app/profile/benfoxall.bsky.social/post/3lt2wjk6tgc22
[gpmf]: https://github.com/gopro/gpmf-parser
[ply]: https://en.wikipedia.org/wiki/PLY_(file_format)
[mcap]: https://mcap.dev/
