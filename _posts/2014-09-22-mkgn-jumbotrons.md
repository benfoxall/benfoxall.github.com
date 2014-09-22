---
layout: post
title: MKGN Jumbotrons
published: "draft"
---

I had the pleasure of talking at [MK Geek Night](http://mkgeeknight.co.uk) - a year after [my first talk]({% post_url 2013-09-20-other-side-of-responsive %}) there.  This is a quick overview of the demos/technologies that I used.
{:.lead}


[![Ben Foxall](https://farm3.staticflickr.com/2941/15285734801_419e6096d9_c.jpg){:.img-responsive}](https://www.flickr.com/photos/drewm/15285734801 "Ben Foxall by Drew McLellan, on Flickr")

> Photo by [Drew McLellan](https://twitter.com/drewm)

I showed 4 different demos, the first two were taken from a talk about multi-device interactions that I gave at [LondonJS](http://www.londonjsconf.com/) and [FutureJS](http://futurejs.org/agenda/a-conceptual-future-for-the-multi-device-web).

Overall, the talk was written with a node.js backend split across several server processes (mainly just to keep things modular when I was building it).  The frontend is built with [reveal.js](http://lab.hakim.se/reveal-js/) - with custom code/libraries to make the dynamic slides.

## Communication

This is where I streamed touch events using [four different transports](https://twitter.com/IntiOcean/status/512708278090878976) then rotated the shapes to show a timeline to compare the different approaches.  I describe this better in my [FutureJS talk](http://youtu.be/1mkShXn_buA?t=13m24s), so check that out if you want reminded.

The transports I displayed were:

* webRTC
* websockets
* long polling
* long polling II

For the webRTC transport, I used [peer.js](http://peerjs.com/) - this is a really lovely webrtc library, you should totally check it out.

For the websockets and long polling transports I used [socket.io](http://socket.io/), which is a really popular and useful realtime library. It does a really good job of normalising and falling back to other transports (in fact, I had to hack around this using hidden iframes and extra node server proccesses to split them out).

For the actual display of the visualisation I used [three.js](http://threejs.org/).

## Display

For this I shared [an image](https://www.flickr.com/photos/alpower/12138153215) across all of our devices in the room.  For a more in depth context to this, check out the [Interfaces](http://youtu.be/1mkShXn_buA?t=17m51s) section of my FutureJS talk.

This used:

* [d3.js](http://d3js.org/) - [pack layout](https://github.com/mbostock/d3/wiki/Pack-Layout) to display and layout all the devices
* [PubNub](http://www.pubnub.com/) for distributing positions/transforms out to all devices (PubNub is totally awesome,  you should absolutely check it out)
* [socket.io](http://socket.io) - to stream touch events from my phone/tablet to my laptop
* [hammer.js](http://hammerjs.github.io/) - to re-fire touch events and interpret them as gestures on my laptop (interestingly, my laptop thinks the touch events have actually occured locally)

## Proximity

This is based on a project called [Junkyard Jumbotron](http://c4fcm.github.io/Junkyard-Jumbotron/) that was created by the MIT Center for Civic Media a few years ago.  I re-built it because we now have access to better transports, and browers are powerful enough to perform image recognition.

The crux of these demos is a [javascript port](https://github.com/jcmellado/js-aruco) of the [ArUco](http://www.uco.es/investiga/grupos/ava/node/26) library for recognising AR markers.  It's really powerful, well written and robust.

The horse came from a [webgl morph targets example](http://threejs.org/examples/webgl_morphtargets_horse.html) for three.js and was created by [mirada](http://mirada.com/) for [ro.me](http://www.ro.me/).

Combining the devices was pretty hard, I've put some of the code up on [github](https://github.com/benfoxall/jumbotrons) - and the rest was hacked over the top in a pretty ugly fashion.


<!-- https://twitter.com/markwilsonit/status/512712251078225920-->
