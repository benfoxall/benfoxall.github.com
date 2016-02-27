---
layout: post
cr: gifstack
---

<div id="gs-choose">
<img src="/img/example.gif" id="gs-file-preview" />
</div>


Animated gifs are cool…
{: .lead}

…But they’re also kind of limited. We can’t pause a gif, skip to a particular point, or grab an individual frames from the image element.

One way around this limitation is to load the file contents with JavaScript, and parse it manually.

There are a bunch of different libraries that can decode gif (check out [omggif](omggif), [gify](gify) & [gif-stream](gif-stream)). I’m a fan of the decoder in [jsgif](jsgif); it’s awkward to use, pretty inefficient, a bit dated, but feels nice.

{% highlight javascript %}
parse(file, {
  hdr: (data) => {
    // handle header data
  }
})
{% endhighlight %}

You provide an object with a set of callbacks for the different parts of the gif.  Callbacks are fired as soon as that part of the gif is parsed and we can choose what we do with the data.

For example, we can get the global colour table from the header data by adding a callback for `hdr`.

<canvas id="gs-palette"></canvas>
Global colour table for example.gif
{: #gs-palette-label.gs-label}

Coming to actually pull out image data; each frame of the animated gif starts with a `Graphics Control Extension` which contains information about the section being drawn, followed by the actual (LZW encoded) pixel data.

_I've skimmed over a lot of really interesting stuff here - for a really in-depth look at gif encoding, check out [this blog post](bytebybyte)._

Once we've got those decoded pixel values back, we can map them through our colour table to get the RGB values for each pixel, and now we've got something that we can draw to a canvas.

<canvas id="gs-canvas" width="500" height="500"></canvas>
Exported frame data
{: .gs-label}

We've got access to each of the individual frames - so now we can play/pause/scrub through the gif if we want (for a fuller example of this (based on the same gif parser) have a look at [libgif-js](buzzfeed-libgif)).

Also - we're not constrained to canvas `drawImage`, we can load the our image data into a `WebGL` texture, which makes more powerful visualisations possible:

<canvas id="gs-three" width="500" height="500"></canvas>


<hr />

Have a look at some other gifs:

* [An awesome Bees + Bombs Hexagon thing](/img/example-bees+bombs.gif){: .gif-link}
* [An awesome Bees + Bombs Cube thing](/img/example-iso.gif){: .gif-link}
* Your own - <input type="file" accept=".gif" id="gs-choose-file"/>




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
[buzzfeed-libgif]: https://github.com/buzzfeed/libgif-js


<!--
http://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art011
http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html
-->
