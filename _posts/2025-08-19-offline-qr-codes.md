---
layout: post.njk
title: Offline QR Codes
description: Have you tried using a QR Code for that?
permalink: 2025/08/19/offline-qr-codes/
---

Using QR Codes to send data from offline devices
{:.lead}

## 👉 From a sensor

If a sensor has a display, it can show a qr code with the data encoded in a url. An example is [this temperature sensor][sensor] sharing recent values in a [collector page][sensor_values].

![A Pi Pico + e-ink display linking to a web page that shows a graph of values](/img/offline-collector.png){:.no-border}

🛜 **Everything works offline**. The microcontroller has no network code and the collector page can work offline.

🔋 **Power efficient**. E-ink displays don't require continous power so controller could go into deep sleep between updates.

🔨 **Robust**. You could take a polaroid photo of the sensor and mail it to your friend for them to scan it if you want!

💾 **Collection**. Storing historical data is possible by forwarding to server when the collector device is [back online][background sync].

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

You might notice as you draw more lines the QR code becomes more dense. I implemented some rudementary path simplification, but there's limits to the amount of content you can share this way.

The key requirement is that target page state should be derived from the url, and once you've got that you can save and share content in any number of ways, not just a qr code.

---

## 👉 Between web pages

Browser can also **scan** QR Codes. This allows us to create a bidirectional socket between two offline devices using their front-facing cameras.

![QR Socket Demo](/img/qr-socket.svg){:.no-border}

I [built this][QRSocket] as a joke, but as I ironed out issues it started feeling pretty good.

A client bootstraps the connection by displaying the url of the current page. When a matching url is detected, they go into "data mode", encoding a string of **`[RX, TX, …Data]`**.

- `RX` - last message id seen by the device
- `TX` - message id being transmitted
- `Data` - payload

Messages are chunked to a fairly arbitrary string length. This could definitely be improved to target the capacity of a particular code size. An interesting extension could be switching between different resolutions to pick the highest capacity for a camera+screen combination.

_Side note: QR Codes support [structured append] for spreading messages over multiple codes. Pretty cool, but I didn't use it._

The coding interface feels a bit like a WebSocket:

```js
const qs = new QRSocket();

qs.on("message", (message) => console.log(message));
qs.send("Hello World!");
```

Something that feels awkward is having to close the page to stop the camera. Having some UI for pausing the socket might make this feel less intrusive.

🕹️ There's some demos online at [remotehack.space/QR-TX][QRSocket] and [source on github][source].

- [Send](https://remotehack.space/QR-TX/?demo=send) - Basic example that sends text of different lengths.
- [Chat](https://remotehack.space/QR-TX/?demo=chat) - Send multiple messages between devices. [Panda] and I built this at [remote hack], it was a lot of fun and slightly mind-bending when we were lining up our phones remotely over a discord room.
- [Signalling](https://remotehack.space/QR-TX/?demo=signal) - Negotiates a peer-to-peer webrtc video connection between devices. This could also be a DataChannel to upgrade the connection between two clients.

I showed a demo at [Future of Coding][foclondon] [[slides][foc slides]] last year. And a longer talk about QR Codes and other stuff at [MKGN][mkgn50] [[video][mkgn video]].

---

## More things

That I've built:

- [QR Code Scanner](https://benjaminbenben.com/qr/) - I couldn't find one that did what I want; when a qr code is detected visit that link (including if that url is `'javascript:alert("hello")'` 😬).
- [QR Undistort](https://benjaminbenben.com/flatten/live.html) - This looks for a QR Code from a camera feed and transforms the video element so that it's central. [Like this](/img/qr-undistort.jpg)!
- [QR Text](https://benjaminbenben.com/qtext/) - An text-based version of [qdraw].

That I like:

- ["I built a QR code with my bare hands to see how it works"][veritasium] - great video exploring how qr codes work. This made reed solomon encoding finally click for me.
- [Snake in a QR Code][snake-bin] - there's something I love about "chmod +x" on something you captured from your webcam.
- [qrs] & [txr] - cool approach for one-way streaming using [fountain] codes.
- [meshtastic] - not QR codes, but it's cool use of WebBluetooth to communicate with devices on a different network.

[background sync]: https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API
[Panda]: https://www.ticklethepanda.dev/
[QRSocket]: https://remotehack.space/QR-TX/
[source]: https://github.com/remotehack/QR-TX
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
[remote hack]: https://remotehack.space
[meshtastic]: https://meshtastic.org/
