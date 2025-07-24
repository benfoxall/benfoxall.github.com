---
layout: post.njk
title: Offline things
description: Have you tried using a QR Code for that?
permalink: 2025/07/23/offline-things/
image: /img/social/video-space.jpg
draft: true
---

How do we get data from something that isn't connected to the internet?
{:.lead}

…there's loads of ways, but I'm interested in **✨QR Codes✨**.

## ✨ From ~~Io~~T sensors

If you have a display attached to your sensor then you can encode it's data in a url so that it can be viewed by any device that scans it.

[I used a Pi Pico's temprature sensor][sensor] connected to an e-ink display.  There's an accompanying collector page which can decode that data and plot a graph.

![offline collector](/img/offline-collector.png){:.no-border}

Some neat stuff about this:

- **Everything works offline**.
  - The Pico has no network code
  - The collector page works offline using a service worker
- **Power efficient**. E-ink displays don't require continous power so controller could go into deep sleep between readings.
- **Robustness**. There’s no networking code or reliance on infrastructure to offload data.

### Bonus: forwarding to a server

If we did want to store these readings centrally, you can do that too.

1. Sign the data on the device
2. In the collector page, forward the message to a server (use [background sync] to support offline)
3. Confirm the signature and store on your server

## ✨ From a web page

You don't need a microcontroller to collect data.

[draw something here, qr code appears here]

Source: [benfoxall/qdraw][qdraw].

Here, any lines you draw are encoded into the QR Code.  A cool feature is that you can add more lines on the collector page and then reshare your appended content.

Implementing this boils down to saving any state you can in the url to make it sharable (even without using a QR Code).

There's a really nice fit with offline support.

If you've an offline map, you can encode the You Are Here points quite well.

## Between offline devices

Our phones/laptops/tablets have screens too. Which means we can use them to share and collect data simultaneously.

I [hacked] around this with [Panda] and built [QRSocket]

[qr socket video]

This protocol is a bit more involved:

- the collector url acts like a bootstrap, when a device sees it, it then switches into a data mode. This is pretty handy for the initial setup
- messages are chunked and then displayed with a transmit & receive token, so each device can

At the end of this, you’ve got something that feels like a WebSocket but

Some interesting applications:

- chat
- signalling
- crdts

1. A micro controller displaying data
2. Signing data for remote storage
3. Sending data between offline devices

[background sync]: https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API
[Panda]: https://www.ticklethepanda.dev/
[QRSocket]: https://remotehack.space/QR-TX/
[hacked]: https://remotehack.space/
[sensor]: https://github.com/benfoxall/sensor
[qdraw]: https://github.com/benfoxall/qdraw
