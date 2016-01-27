---
layout: post
cr: gifstack
---

Animated gifs are pretty cool.
{: .lead}

<div id="gs-choose">
<img src="/img/example.gif" id="gs-file-preview" />
<input type="file" accept=".gif" id="gs-choose-file"/>
</div>

They’re also kind of rubbish. We can’t pause a gif, skip to a particular frame, or grab individual stills from the image element.

One way to get this information is to manually read the image file with javascript.

There are a bunch of different libraries that can decode gifs (check out [omggif](omggif), [gify](gify) & [gif-stream](gif-stream)). I’m a fan of the decoder in [jsgif](jsgif): it’s a bit awkward to install, pretty inefficient, and a bit dated, but has a nice api:

{% highlight javascript %}
parse(stream, {
  hdr: (data) => {
    // handle header data
  }
})
{% endhighlight %}

You give an object with a set of callbacks for the different parts of the gif.  Callbacks are called as the parts of the gif are parsed and we can choose what we do with the data.

For example, we can get the global colour table from the header data by adding a callback for `hdr`.

<canvas id="gs-palette"></canvas>
Global colour table for example.gif
{: #gs-palette-label.gs-label}

Each frame of the animated gif starts with a `Graphics Control Extension` which contains information about the section being drawn, followed by the actual (LZW encoded) image data.

_I've skimmed over a lot of really interesting stuff here - for a really in-depth look at gif encoding, check out [this blog post](bytebybyte)._

Once we've got the decoded pixel values back, we can map them through our colour table to get the RGB values for each pixel, and now we've got something we can draw to a canvas with `putImageData`.

<canvas id="gs-canvas" width="500" height="500"></canvas>
Exported frame data
{: .gs-label}

Which is cool.

We can also use this image data elsewhere.

And we're not just limited to the canvas api.  Using threejs

<canvas id="gs-three" width="500" height="500"></canvas>


## Stuff

* Jamie's image format pres
* mp4 in browser
* mpeg tipoi


## Also...

From the gif spec

> **Animation** : The Graphics Interchange Format is not intended as a platform for animation, even though it can be done in a limited way.


> When the flag is set, indicating that user input is expected, the decoder may sound the bell (0x07, 7) to alert the user that input is being expected. In the absence of a specified Delay Time, the decoder should wait for user input indefinitely. It is recommended that the encoder not set the User Input Flag without a Delay Time specified.


[animate_spec]: #
[jamie_pres]: #
[wo]: https://whiteoctober.co.uk
[tipoi]: #

[bytebybyte]: http://matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp

[jsgif]: http://slbkbs.org/jsgif/
[omggif]: https://github.com/deanm/omggif
[gify]: https://github.com/rfrench/gify
[gif-stream]: https://github.com/devongovett/gif-stream
[gifuct]: https://github.com/matt-way/gifuct-js
[gif.js]: https://github.com/jnordberg/gif.js


<!--
http://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art011
http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html
-->
