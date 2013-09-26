---
layout: post
title: The other side of responsive
---

<p class="lead">Yesterday I gave a talk "The other side of responsive" which was about how responsive web development gives us a great platform for creating interfaces that combine multiple devices. This post explains some of the tech/approaches that I used for it.</p>

<p><strong>I'm writing this in a car, with the limit of a half charged laptop, so apologies for any mistakes or over-wordiness. <small>Also - for context - my mother (who is driving) is playing Mozart Clarinet Concerto in A really loud, which is awesome.</small></strong></p>

## The setup

My laptop has a node.js server which does two things:

1. Serve the static content of the presentation (written with [reveal.js](http://lab.hakim.se/reveal-js/#/))
2. Host a [binary.js](http://binaryjs.com/) server which publishes anything sent to it to any other connected browsers

My phone has a 3g connection, and acts as a hotspot for my laptop (I would have used the wifi, but it was a bit shakey on my phone - this worked a lot better)

There's a page hosted at [benjaminbenben.com/party](https://github.com/benfoxall/benfoxall.github.com/blob/master/party/index.html) which has the markup for each of the phone slides, and some JavaScript to link it up to my talk.  I took some effort to make this as performant as possible (from accessing the web server with your phone, the "hello" is able to display within the first network roundtrip!); so I was glad to hear [Drew](https://twitter.com/intent/user?screen_name=drewm) talk about web performance, it's such an important aspect of working with the web.

I used <a href="http://www.pubnub.com/">PubNub</a> to communicate with the devices in the room.  I had two channels, one to give the status of the slides and another for devices to publish information about themselves and forward touch events when we "went collaborative".  The publish / subscribe style worked brilliantly for this - all devices would publish and the slide deck would be the only subscriber, and the other way round for the slide states.  PubNub has a few features which were really useful for this:

1. multiplexing - this meant that your device only needed one connection for both of the channels.
2. windowing - this option let my slides recieve messages in 500ms batches, which fixes the number of requests that my laptop would make, regardless of how many people connected.
3. backfill - if you were to refresh a device, all the 'hot' messages would be sent down, so the browser would be able to replay them all and catch up with all the other devices; this also allows people to join in half way through.

## The talk

<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F112467729"><!----></iframe>

My first slide was the short url for the [benjaminbenben.com/party](http://benjaminbenben.com/party) with a counter below it.  When someone loads the page, there is a script that:

1. Generates and locks down a uuid for the user, so that reloading the page won't create more devices
2. Uses modernizr to find the capabilities of the device
3. Subscribes to the slide deck messages
4. Publishes a 'hello' message

The hello message looks something like this:

{% highlight javascript %}
{
	uuid: 'some-long-random-id',
	type: 'hello',
	features: 'appcache webgl webrtc ...',
	pixels: 1234567,
	innerC: 'red', // random colours
	outerC: 'blue' // for the circles
}
{% endhighlight %}

The counter on the slide deck increments when it gets one of these messages, the features and colours are stored - so from this point I know that I can display the capabilities chart (which is nice).

I then continue to the title slide and wave my hands about a bit.  I've got the slides open on my phone too, when I go to the next slide I use binary.js to broadcast a message to all other browsers, which proceed to that slide.

The next slide is a file input field, which looks like this:

{% highlight javascript %}
<input type="file" id="photo" accept="image/*" capture="camera"/>
{% endhighlight %}

The capture attribute means that it fires up the camera on my phone rather than asking where I want to get my file from.

When I take and accept the picture of the geek night, it is streamed with binary.js to all other connected slide decks - it's based on [this binary.js example](https://github.com/binaryjs/binaryjs/tree/master/examples/imageshare).

![mkgn](/img/mkgn.png)

Once the image is in the slide deck, this sequence of things happens:

1. It's displayed on the presentation
2. It starts [uploading to s3](http://aws.amazon.com/articles/1434)
3. The s3 url is published to all devices
4. It's base64 encoded and sent to twitter (using [codebird](https://github.com/jublonet/codebird-js), which gives you a proxy to the twitter api for client side apps)
5. The twitter [embed html requested](https://dev.twitter.com/docs/api/1/get/statuses/oembed)
6. The twitter embed html is appended to the presentation is published to all devices
7. The twitter widget script is added to render the tweet (this also happens on the devices)

So, at this point - the the last slide is rendered (on the devices as well). Also, the devices are displaying the picture on screen (I forgot to say that).

The next slide is the interactive slide of circles representing each device, this is an svg generated with d3. There is a basic animation loop which applies and dampens the speed of a circle and repels it from any nearby circles, this was running for the last couple of slides - so they've kind of organised themselves into a nice pattern.

D3 is fantastic, the enter/exit/transition approach is so intuitive for dynamic data - if someone joined at this point, a circle would pop onto the page and everything would just carry on.

By this point a coinciding circle was displayed on each device, when anyone pressed their circle, the x/y coordinates were published with PubNub. When received by the presentation, the x/y speed on the underlying data is incremented accordingly - d3 does the rest.

Moving to the table of capabilities is just stopping the animation loop, then transitioning the elements to new positions and appending new elements for each capability. I &lt;3 D3.

<blockquote class="twitter-tweet"><p><a href="https://twitter.com/benjaminbenben">@benjaminbenben</a> blowing minds with real time analysis of the audience&#39;s devices <a href="https://twitter.com/MKGeekNight">@mkgeeknight</a> <a href="https://twitter.com/search?q=%23mkgn&amp;src=hash">#mkgn</a> <a href="http://t.co/e8bohM3iaL">pic.twitter.com/e8bohM3iaL</a></p>&mdash; Al Power (@alpower) <a href="https://twitter.com/alpower/statuses/380800187490254849">September 19, 2013</a></blockquote>

I then used 3 of [Brad Frosts](https://twitter.com/intent/user?screen_name=brad_frost) slides from his blog post "[this is the web](http://bradfrostweb.com/blog/post/this-is-the-web/)".  Each slide sends a message out to all the devices which keep in sync.  The middle slide (This is the web) just displayed the word "web" on the devices rather than the image, to show that your device is part of that.

The last slide was a quote by Igor Stravinsky about the freedom of constraints. The slide only showed part of the quote (highlighted below) - the full quote was displayed on each of the devices.

> My freedom thus consists in my moving about within the narrow frame that I have assigned to myself for each one of my undertakings.  I shall go even further: **my freedom will be so much the greater and more meaningful the more narrowly I limit my field of action and the more I surround myself with obstacles**. Whatever diminishes constraint diminishes strength. The more constraints one imposes, the more one frees oneself of the claims that shackle the spirit.

I like that quote.
