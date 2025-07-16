---
layout: post.njk
title: Video in Space
permalink: 2025/07/16/video-space/
draft: true
---

Here’s a video I captured with my drone (when I was motocamping a couple of weeks ago!)

<video controls playsinline style="max-width: 100%">
    <source src="https://vs.benjaminbenben.com/motocamp/720.mp4" type="video/mp4" />
</video>

```html
<video controls>
    <source src="motocamp.mp4" type="video/mp4" />
</video>
```

And here’s the same video rendered with frames aligned with an estimate position where the drone captured it from.

<pose-aligned poses="https://vs.benjaminbenben.com/motocamp/poses.ply" points="https://vs.benjaminbenben.com/motocamp/points.bin.ply">
    <video src="https://vs.benjaminbenben.com/motocamp/720.mp4" crossorigin="anonymous" muted></video>
</pose-aligned>

```html
<pose-aligned poses="poses.ply" points="points.ply">
    <video controls>
        <source src="motocamp.mp4" type="video/mp4" />
    </video>
</pose-aligned>
```


<script src="/js/video-space.js"></script>


