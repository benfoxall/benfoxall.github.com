---
layout: post
title: Reading QR codes from getUserMedia with web workers
---

### tl;dr - examples (currently requires chrome):

<h3><a href="javascript:window.open('/qr/web-worker.html','scanner','width=700,height=600');">&gt;with web worker</a> <small>(should be smoother)</small></h3>

<h3><a href="javascript:window.open('/qr/inline.html','scanner','width=700,height=600');">&gt;without web worker</a></h3>


<hr />


<p class="lead">Web workers let you to take JavaScript execution off the main UI thread - which can be really useful if you are doing complex things with video</p>

I came across a javascript [qr-code reader](https://github.com/LazarSoft/jsqrcode) a few days ago.  When I started using it to scan from a getUserMedia stream - it worked fine, but the extra processing was blocking the ui, which was particularly noticable when you're displaying the video.

I thought it was a pretty good candidate for taking the processing off to a web worker;  which turned out pretty well.

![Scanning QR code with getUserMedia](/img/gum-ww.png)

Once you've got the [imageData](https://developer.mozilla.org/en-US/docs/HTML/Canvas/Pixel_manipulation_with_canvas) from your canvas,  you can run it through [jsqrcode](https://github.com/LazarSoft/jsqrcode) by setting attributes of the qrcode object, then call .render():


{% highlight javascript %}
qrcode.imagedata = imagedata;
qrcode.width = imagedata.width;
qrcode.height = imagedata.height;

var content = qrcode.process();
{% endhighlight %}

It was [pretty straightforward](https://github.com/benfoxall/jsqrcode/blob/master/src/worker.js) to pull the code into a web worker,  I spent a bit of time before I realised that console.logs were making it fall over.  Here's the interface for responding to messages with the worker:

{% highlight javascript %}
self.onmessage = function(event) {
    var imagedata = event.data;
    qrcode.imagedata = imagedata;
    qrcode.width = imagedata.width;
    qrcode.height = imagedata.height;

    var resp;
    try{
        resp = qrcode.process();
    } catch(e){
        resp = ''; // *mostly* "no code found"
    }
    postMessage(resp);
};
{% endhighlight %}


Back in the original page,  you can creater the worker and deliver messages to it using the `.postMessage` function.  You can optionally list [Transferable objects](http://www.whatwg.org/specs/web-apps/current-work/multipage/common-dom-interfaces.html#transferable) to efficiently move them to the web worker.

{% highlight javascript %}
var worker = new Worker("jsqrcode/worker.js"),
worker.onmessage = function(event) {
    console.log("qr code is:" + event.data);
}

// imagedata = ctx.getImageData(…)
worker.postMessage(imagedata, [imagedata.data.buffer]);
{% endhighlight %}


Jsqrcode is on [github](https://github.com/LazarSoft/jsqrcode), as is [my fork](https://github.com/benfoxall/jsqrcode) with the starts of the worker interface. You can either view source on the examples above, or view them on [github](https://github.com/benfoxall/benfoxall.github.com/tree/master/qr).





