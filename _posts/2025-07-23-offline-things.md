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

…there's loads of ways, but the one I'm interested in is **✨QR Codes✨**.

I’ve got a microcontroller, every few minutes it checks the temperature and encodes recent values in a QR Code, which takes you to a collector page, which can then show the data captured.

![offline collector](/img/offline-collector.png){:.no-border}

Some neat stuff about this:

- Both devices can be offline
  - Zero network dependency for the microcontroller
  - The collector page is offline
- power efficient - using a persistent display, the controller can go into deep sleep and only wake to capture data and update the display.
- robust & stateless. There’s no networking, bridges or connections to handle. You could even take a picture of the QR code to scan later, or share the link to another device to see the same data.
- potential for browser storage to merge many readings.

You don’t have to share the raw data either, qDraw simplifies paths and shares them

## Relaying data to a server

Sharing data like this is ephemeral, as soon as you close the page it’s gone. If we want to store this somewhere can implement this by adding a signature to the payload:

collector?data={data}&sig={hash(data + secret)}

If the signature matches on the server expectation, then we insert the data into our database. This can be done before the page is displayed to the user.

It’s possible to do this while maintaining offline capabilities by using [background sync] to defer the posting until we’ve network.

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
