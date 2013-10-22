---
layout: post
published: "draft"
---
<p class="lead">The artwork for Joy Division's <a href="http://en.wikipedia.org/wiki/Unknown_Pleasures">Unknown Pleasures</a> album is based on a graph of radio waves from the first identified pulsar - this is a graph of radio waves from the same pulsar, but recorded in 2012.</p>

<div id="pulsar" class="cr" data-cr="pulsar" data-cr-defer="">
  <div id="pulsar-graph"><!-- --></div>
  <form>
    <label>
      <input id="pulsar-colouring" type="checkbox" value="" />
      Encyclopedia of Astronomy colouring
    </label>
    <label>
      <input id="pulsar-transparent" type="checkbox" value="" />
      Transparent fill
    </label>
    <label>
      <input id="pulsar-scale" type="checkbox" value="" />
      "Full scale"
    </label>
  </form>
</div>

## Origins of the Joy Division artwork

Stephen Morris (the Joy Division drummer) found this image in the Cambridge Encyclopedia of Astronomy.  It's a graph showing the regularity of the pulses of [CP 1919 (PSR B1919+21)](http://en.wikipedia.org/wiki/PSR_B1919%2B21) - the first radio pulsar discovered (in 1967).

The original image had a light background and dark lines, Peter Saville inverted this image for the cover of Unknown Pleasures.

Check out [this blog post](http://adamcap.com/2011/05/19/history-of-joy-division-unknown-pleasures-album-art/) for more information about when the image appeared.

## Data

<p class="lead"><strong>Disclaimer: I know almost nothing about pulsars</strong></p>

The data for the graph above comes from [Pulsar Group CSIRO Astronomy and Space Science](http://www.atnf.csiro.au/people/pulsar/index.html?n=Main.Audio).

> Recording of the first-discovered pulsar CP1919 (PSR B1919+21) made at the Parkes radio telescope in April 2012. The observing frequency was 732 MHz and bandwidth 64 MHz. The audio is the detected and dedispersed signal modulating white noise. 
> 
> Credit: R. N. Manchester, G. Hobbs and J. Khoo, CSIRO Astronomy and Space Science

You can listen to it [here](http://www.atnf.csiro.au/research/pulsar/audio/CP1919.wav) - you're listening to a star which is pretty mental.

I took that wav file and had a look at the data with [sox](http://sox.sourceforge.net/) (I eventually pulled out numbers with [canvas_waveform](https://github.com/aalin/canvas_waveform)).

<p><a href="/img/un-pl-spectrogram.png"><img alt="Spectogram of CP1919 (PSR B1919+21)" src="/img/un-pl-spectrogram.png" class="img-responsive" /></a></p>

There was a lot of blank space in the data. I'm not sure if this is because of the way that I extracted it, or the way that it had been pre-processed.  Also, when I managed to plot it, it's no-where as pretty as the original one; I'm not sure if this is because the equipment is all fancy digital now or what.

## Visualisation

Looking at the original plot, I thought that the peaks obscuring the preceeding ones above meant a loss of information.  Though when I plotted it with a transparency it became a lot harder to read - you don't know whether lines were going up or down and it looks a bit messy too.  Though I could see that some lines were totally flat, which is cool and I don't know why.

Another thing that I realised when I came to plot the graph was that there is a period of silence between each of the peaks (the pulsar has a period of 1.33730s and a 0.04s pulse width) - I've added a toggle so that you can see pluses along with the silence.

Both of these points are good cases for the original visualisation which is to show how periodic the pulsar is (I think).

Also, this shows 80 cycles of the pulsar - so it covers about 1m47s (I was slightly sad that none of the songs on the album are this length).

## Other things

If you liked listening to the stars, check out this [list of unexplained sounds](http://en.wikipedia.org/wiki/List_of_unexplained_sounds) on Wikipedia, they are mostly things in the sea and pretty awesome. I like how the [52-hertz whale](http://en.wikipedia.org/wiki/52-Hertz_whale) is described as being "just higher than the lowest note on a tuba".
