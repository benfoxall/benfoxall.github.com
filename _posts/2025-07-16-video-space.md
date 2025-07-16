---
layout: post.njk
title: Video in Space
permalink: 2025/07/16/video-space/
draft: true
---

Here's a video from my drone as it circles my motorbike and tent with frames of the video aligned with the estimated position of the drone at each frame.

<pose-aligned poses="https://vs.benjaminbenben.com/motocamp/poses.ply" points="https://vs.benjaminbenben.com/motocamp/points.bin.ply">
    <video src="https://vs.benjaminbenben.com/motocamp/720.mp4" crossorigin="anonymous" muted autoplay id="playme"></video>
</pose-aligned>


### Implementation


```html
<pose-aligned poses="poses.ply" points="points.ply">
  <video src="motocamp.mp4"></video>
</pose-aligned>
```

And here’s the same video rendered with frames aligned with an estimate position where the drone captured it from.


<script src="/js/video-space.js"></script>
<script>
    document.getElementById('playme')?.addEventListener('loadeddata', function() {
        this.play();
    });
</script>
