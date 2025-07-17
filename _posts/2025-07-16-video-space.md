---
layout: post.njk
title: Video Space
description: Pose-aligned video tracking with WebGL
permalink: 2025/07/16/video-space/
image: /img/social/video-space.jpg
draft: true
---

Here's a drone video aligned with it's flight path
{: .lead}

<pose-tracker poses="https://vs.benjaminbenben.com/motocamp/poses.ply" points="https://vs.benjaminbenben.com/motocamp/points.bin.ply">
    <video src="https://vs.benjaminbenben.com/motocamp/720.mp4" crossorigin="anonymous" muted autoplay playsinline></video>
</pose-tracker>

… it's interactive! Drag around to see from different angles.

### Locating my drone

[My drone][drone] records telemetry data with it’s location & altitude but unfortunately nothing about the orientation or camera angle. So I decided to extract video frames and use [colmap][colmap] to calculate the orientation of each frame of the video. As a bonus I got a sparse point cloud generated in the process.

I wrote some slightly scrappy code to extract and serialise the poses and points into a ply file that I could load into a webgl component.

You can see some of the process for this on my [bluesky] post.

### Implementation

I’m pretty happy with how this is structured, it’s a web component that wraps a `<video />` element with links to the colmap data:

```html
<pose-tracker poses="poses.ply" points="points.ply">
  <video src="motocamp.mp4"></video>
</pose-tracker>
```

Internally the video element is hidden but still drives the playback of the component, which is some html controls & a webgl canvas element.

The canvas is rendered by threejs. The key trick is using a single 2d texture array to stash the all the video frames, with an instanced mesh that allows everything to be drawn together. My original approach for pushing the frames was using a 2dCanvas to write the pixels into a array buffer, but I found `WebGLArrayRenderTarget` which lets you populate texture arrays directly!

It would have been quite time consuming to calculate the poses for every frame of the video so downsampled it (from 60 &rarr; 2 Hz) and interpolate to find the position at a set timestamp. Orientation is quite straightforward in threejs, but for translation I was really happy when I found [curve-interpolator].

## Other videos

This works for other videos too.

- <a href="#wall">Walking along a beach towards some grafitti</a>
- <a href="#bike-dog">Cycling next to a friendly dog</a>
- <a href="#drone-chile">A confluence in Chile</a>
- <a href="#mizen-walk">A start/finish line</a>
- <a href="#mizen-fly">Flying over some cliffs</a>

<output id="vs">
    <section class="blank-vs"></section>
</output>

<script>
    // not sure why this is needed
    document.querySelector('[autoplay]')?.addEventListener('loadeddata', function() {
        this.play();
    });

    const valid = [ "wall", "bike-dog", "drone-chile", "mizen-fly", "mizen-walk" ]
    const output = document.querySelector("output#vs")

    function update() {
        const hash = location.hash.slice(1);

        if(valid.includes(hash)) {
            output.innerHTML = `
                <pose-tracker poses="https://vs.benjaminbenben.com/${hash}/poses.ply" points="https://vs.benjaminbenben.com/${hash}/points.bin.ply">
                    <video src="https://vs.benjaminbenben.com/${hash}/720.mp4" crossorigin="anonymous" muted autoplay playsinline></video>
                </pose-tracker>
            `

            output.querySelector("video").play()
        }
    }

    window.addEventListener("hashchange", update);
    update()

</script>

<script src="/js/pose-tracker.js" async></script>

<style>
    .blank-vs {
        background-color: #eee;
        background: linear-gradient(180deg,rgba(238, 238, 238, 1) 0%, rgba(170, 170, 170, 1) 100%);

        display: flex;
        padding: 0;
        position: relative;
        margin: auto;
        aspect-ratio: 16 / 9;
        max-height: 80vh;
        max-width: 90vw;
        overflow: hidden;
        opacity: 0.2;
        border-radius: 5px 
    }
</style>

[drone]: https://www.dji.com/mini-4-pro
[motovideo]: https://customer-j0h94e0v9rsg8l40.cloudflarestream.com/0c7e1abdb84a5752024cbd417fadc08c/watch
[webvtt]: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
[colmap]: https://colmap.github.io/
[done-dataset]: https://fpv.ifi.uzh.ch/datasets/
[curve-interpolator]: https://www.npmjs.com/package/curve-interpolator
[bluesky]: https://bsky.app/profile/benfoxall.bsky.social/post/3lt2wjk6tgc22
