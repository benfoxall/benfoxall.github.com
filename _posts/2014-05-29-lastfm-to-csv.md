---
layout: post
title: LastFM to CSV
---

I made [lastfm to csv](www) - a page for downloading lastfm listening data as a csv file.  API requests are made directly from the browser, avoiding the need for any server-side code.
{: .lead}

[give it a shot now][www]{: .btn.btn-primary} (my username is benjaminf)

My friend [Andy][andy-twitter] wanted some lastfm listening data for a visualisation project so I wrote him a [ruby script][gist] that uses the [user.getrecenttracks][api-call] method to get the track history for a user.  This worked fine though if someone else wanted to use it - they would need to install ruby, and have a familiarity of the command line.



I figured it might be easier for people to do this in the browser - so I put together [lastfm-to-csv][www], which lets you enter a username and download a csv file containing all the tracks for a user.

[![lastfm-to-csv](/img/lastfm-to-csv.png){: .img-responsive}][www]

## Using the browser

Generating a csv of all the tracks requires many requests to the api, these need to be processed and combined together. I decided to do this all from the browser, by using xhr to make requests to the api and storing the processed csv data in a javascript Blob.

A few libraries that I found useful:

* [reqwest](https://github.com/ded/reqwest) - for making xhr calls, nice and lightweight.
* [async](https://github.com/caolan/async) - for organising the calls to the api and processing the results.
* [Filesaver.js](https://github.com/eligrey/FileSaver.js/) - lets you download the resulting Blob objects as a file.

Building the logic in the browser rather than server means a few things:

* people have access to their data instantly - no waiting around for a file to be generated on the server
* no servers to keep running - all code runs in the browser
* you don't have control over api limiting - it someone gathers data in several windows, they are likely to hit rate limiting issues
* access issues. Last fm gives you a nice [cors][cors] endpoint, and also lets you access a lot of the methods with a simple public api-key auth.

## Other things

Andy blogged about his [last fm visualisations][andy-lastfm] - turns out that I'm [quite obsessive][andy-lastfm-obsessive].

[andy-twitter]: https://twitter.com/acotgreave
[gist]: https://gist.github.com/benfoxall/7976631
[www]: http://benjaminbenben.com/lastfm-to-csv/
[github]: https://github.com/benfoxall/lastfm-to-csv
[api-call]: http://www.last.fm/api/show/user.getRecentTracks
[andy-lastfm]: http://gravyanecdote.com/uncategorized/lastfmthesummary/
[andy-lastfm-obsessive]: http://gravyanecdote.com/uncategorized/last-fm-part-3-obsessions/
[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
