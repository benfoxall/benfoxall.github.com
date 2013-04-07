---
layout: post
---

<p class="lead">Plotting goecoded tweets on a globe with canvas</p>

<canvas height="550" width="600" class="cr" data-cr="tweet-globe">Requires Canvas Support</canvas>

I gathered a few hours of geocoded tweets from the [twitter streaming api](https://dev.twitter.com/docs/streaming-apis) (using the [maptime](http://benjaminbenben.com/2012/12/05/maptime/) code as a base).  This was to explore some ideas that we'd been talking about at [White October](http://whiteoctober.co.uk).

Drawing the globe is [relatively straightforward](https://gist.github.com/benfoxall/5332944#file-tweet-globe-js).  The lat/long pairs are converted into position vectors, which are then transformed based on the mouse position.  The [Sylvester library](http://sylvester.jcoglan.com/) was pretty handy for transforming the points ([Pete](https://twitter.com/intent/user?screen_name=peterjwest) talked about Sylvester at [jsoxford](http://jsoxford.com/) recently).

The original plan was to animate this over a period of time,  though it looked quite random / noisy so I went for this static view instead.

[Gareth](https://twitter.com/intent/user?screen_name=4foot30) pointed me to a post about [the effects in tron legacy](http://jtnimoy.net/?q=178&utm_source=buffer&buffer_share=254f1) which makes me want to make this a lot more awesome!

