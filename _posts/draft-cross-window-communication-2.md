---
layout: post
title: "Cross window communication <small>part&nbsp;1</small>"
cr: xwindow1
---

<p class="lead">This is my first of two posts covering the my talk at jQuery UK (turns out I covered quite a bit!)</p>

<!-- _note, these demos weren't built to work on every browser. I built them for Chrome Desktop and Chrome Beta on Android._ -->

### Websockets

Moving on to non-local windows - because of the request/repsonse nature of http, it is harder to make the content in remote browsers stay in sync (if something new comes in after the response has been sent back, how do we send this to the other page?).

Websockets allow 