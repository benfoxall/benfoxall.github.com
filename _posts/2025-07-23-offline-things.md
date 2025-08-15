---
layout: post.njk
title: Offline QR Codes
description: Have you tried using a QR Code for that?
permalink: 2025/08/15/offline-qr-codes/
draft: true
---

Using QR Codes to send data from offline devices
{:.lead}

## 👉 From a sensor

If a sensor has a display, it can show a qr code with the data encoded in a url. A use case for this might be [a temperature sensor][sensor] sharing recent values in a [collector page][sensor_values].

![A Pi Pico + e-ink display linking to a web page that shows a graph of values](/img/offline-collector.png){:.no-border}

🛜 **Everything works offline**. The microcontroller has no network code and the collector page uses a service worker to load offline.

🔋 **Power efficient**. E-ink displays don't require continous power so controller could go into deep sleep between updates.

🔨 **Robust**. You could take a polaroid photo of the sensor and mail it to your friend for them to scan it.

💾 **Collection**. If we want to store historical data we could forward to server when [back online][background sync].

---

## 👉 From a web page

You don't need a microcontroller to collect data. Browsers are a rich source of content. When you draw in the box below it'll encode your art in a qr code ([source][qdraw]).

<div class="qdraw" data-target="https://benjaminbenben.com/qdraw/">
  <canvas class="qdraw-paint" width="1024" height="1024"></canvas>
  <a href="#" class="qdraw-link" target="_blank">
    <canvas class="qdraw-qr" width="100" height="100"></canvas>
  </a>
  <script src="/js/qdraw.js"></script>
  <script>
    document.querySelector('.qdraw-paint').addEventListener('touchstart', e => e.preventDefault())
  </script>
</div>

You might notice as you add more lines the QR code becomes more dense. There's some limits to the amount of content you can share, but with path simplification and compression it's not too bad.

The key requirement is that target page state should be derived from the url, and once you've got that you can save and share content in any number of ways, not just a qr code.

---

## 👉 Between web pages

Browser can also **scan** QR Codes using [media streams][media] and [barcode detection][barcode]. This allows us to create a bidirectional socket between two offline devices using their front-facing cameras.

![QR Socket Demo](/img/qr-socket-sim.svg){:.no-border}

I [implemented this][QRSocket] – initially as a joke but when I ironed out issues it started feeling pretty cool.

**Data format**. When transferring data, the QR code is a string "**[RX, TX, …Data]**"

- RX - is the last message id seen by the device
- TX - is the message id being transmitted
- Data - the payload

👋 **Bootstrapping**. Before the socket goes into "data mode", I show the url of the current page. This turned out pretty neat choice for giving people demos - by scanning the first code they're on the right page to send data.

📦 **Chunking**. I chose an arbitraty chunk size. This could be improved to fit with a selected qr code size, and I guess it would be possible to cycle between code sizes to switch to a higher capacity.

_Side note: QR Codes support [structured append] for spreading messages over multiple codes. Pretty cool, but I didn't use it._

📡 **Offline**. The page has a service worker which means that it loads offline. There's something cool that it works while you're on aeroplane mode.

💻 **Usage**. [Panda] and I hacked together [QRSocket], which feels a bit like a WebSocket.

```js
const qs = new QRSocket();

qs.on("message", (message) => console.log(message));
qs.send("Hello World!");
```

One issue is that it feels awkward to keep a connection/camera open, maybe something to solve at a UX level by entering a sync mode.

🕹️ **Demos**. There's some stuff to play around with at [remotehack.space/QR-TX][QRSocket]

- [Chat](https://remotehack.space/QR-TX/?demo=chat) - a chat demo which shows pending message state.
- [Signalling](https://remotehack.space/QR-TX/?demo=signal) - negotiates a peer-to-peer webrtc video connection between devices.  This upgrade works even when both devices are connected to a local-only network.

🤔 **Data Sync**. I think this could fit pretty well with a [CRDT] - where you've got a local version of some content and you use qr codes to sync state with other devices.

🎙️ **Talks**. I demoed this at [Future of Coding][foclondon] last year [[slides][foc slides]]. And also gave a longer talk about QR Codes and other stuff at [MKGN][mkgn50] [[video][mkgn video]].

---

## More things

That I've built:

- [QR Code Scanner](https://benjaminbenben.com/qr/) - I couldn't find one that did what I want; when a qr code is detected visit that link (including if that url is 'javascript:alert("hello")' 😬).
- [QR Undistort](https://benjaminbenben.com/flatten/live.html) - This looks for a QR Code from a camera feed and transforms the video element so that it's central. [Like this](/img/qr-undistort.jpg)!
- [QR Text](https://benjaminbenben.com/qtext/) - An text-based version of [qdraw].

Other things:

- ["I built a QR code with my bare hands to see how it works"][veritasium] - great video exploring how qr codes work. This made reed solomon encoding finally click for me.
- [Snake in a QR Code][snake-bin] - there's something I love about "chmod +x" on something you captured from your webcam.
- [qrs] & [txr] - cool approach for one-way streaming using [fountain] codes.


[background sync]: https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API
[Panda]: https://www.ticklethepanda.dev/
[QRSocket]: https://remotehack.space/QR-TX/
[hacked]: https://remotehack.space/
[sensor]: https://github.com/benfoxall/sensor
[sensor_values]: https://benjaminbenben.com/sensor/?d=905,904,902,902,900,900,899,899,898,898,897,897,897,896,896,896,896,896,894,894&c=35
[qdraw]: https://github.com/benfoxall/qdraw
[barcode]: https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API
[media]: https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
[qrs]: https://github.com/qifi-dev/qrs
[txr]: https://github.com/divan/txqr
[fountain]: https://divan.dev/posts/fountaincodes/
[structured append]: https://ozeki.hu/p_3465-qr-code-encoding.html#:~:text=0011-,Structured%20append
[foc slides]: https://benjaminbenben.com/assets/slides/qrtx.pdf
[mkgn video]: https://www.youtube.com/watch?v=mJnzN8pd8Gc
[mkgn50]: https://mkgeeknight.co.uk/events/mkgn-50#Ben
[CRDT]: https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
[foclondon]: https://lu.ma/foclondon
[gopro]: https://gopro.github.io/labs/control/custom/
[veritasium]: https://www.youtube.com/watch?v=w5ebcowAJD8
[snake-bin]: https://www.youtube.com/watch?v=ExwqNreocpg
