---
layout: post
title: Web workers with &lt;video&gt;
published: false
---

<p class="lead">Web workers let you to take JavaScript execution off the main UI thread - which can be really useful if you are doing complex things with live video</p>

The other day I was searching a getUserMedia stream for QR codes.  I found a [js qrcode](https://github.com/LazarSoft/jsqrcode) scanner - when I hacked it together,  it worked fine, but the amount of processing was blocking the ui (which was particularly noticable when you're displaying the video).


<div class="cr qr-demo" data-cr="qr-demo">
<a href="javascript:window.open('/qr/web-worker.html','webworker','width=700,height=600');">with web worker</a>
<a href="javascript:window.open('/qr/inline.html','webworker','width=700,height=600');">without web worker</a>
</div>