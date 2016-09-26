---
layout: post
title: The speed of sound
---

I've been toying with the idea of using audio to locate devices in a room -  I tested it out at [Full Stack Fest](http://fullstackfest.com) a couple of weeks ago. It didn't work that well, though it's still kind of interesting.
{: .lead}

## The plan

Given that each device in the room has a microphone, and I have control of two speakers (right and left channels), I was hoping to triangulate between the speakers by using either:

1. The relative volume of each speaker
2. The time it takes to reach each microphone

## Playing sounds

I decided to use two tones: <a href="#tone">350Hz</a> & <a href="#tone">450Hz</a>, mostly because they sound okay.
{:data-cr="sound-tones"}
{: .cr}

With WebAudio, you can generate these tones pretty easily using an OscillatorNode:

```js
var audioCtx = new AudioContext()

var oscillator = audioCtx.createOscillator()
oscillator.frequency.value = 350
oscillator.connect(audioCtx.destination)

// play for .5s
oscillator.start()
oscillator.stop(audioCtx.currentTime + 0.5)
```

To make them sound a bit nicer - you add in a gain node to quickly fade the tone in and out.

## Listening for sounds

On our other device(s) we want to listen for the incoming audio. We can do this using getUserMedia - which gives us a media stream that we can then handle using webAudio.

Once we're in WebAudio land, we can pipe the microphone input into an Analyser node, which gives us access to properties of the

```js
var analyser = audioCtx.createAnalyser()

// This won't work in browsers like IE6 & Safari.
navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream =>
    audioCtx.createMediaStreamSource(stream)
      .connect(analyser)
  )
```

Now we have an analyser node that is listening to our microphone output.  You can get two pieces of information from an analyser node - the waveform and the frequencies data.  You do this by passing a typedArray to the analyser which gets populated with the appropriate data.

```js
// get the waveform
var bufferLength = analyser.fftSize
var data = new Uint8Array(bufferLength)
analyser.getByteTimeDomainData(data)

// get the frequencies
var bufferLength = analyser.frequencyBinCount
var data = new Uint8Array(bufferLength)
analyser.getByteFrequencyData(data)
```

<canvas data-cr="sound-frequency-graph" class="cr" height="350" width="500"></canvas>

## Trying it out

## Other stuff

* I also built a midi-over-web to connect

## Next things

* try better
* manual analyser nodes - accessing raw data could allow more accurate positioning
* multi-frequency/delay phasing -
