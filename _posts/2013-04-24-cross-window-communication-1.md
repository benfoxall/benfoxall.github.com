---
layout: post
title: "Cross window communication"
cr: xwindow1
---

<p class="lead">I was part of the "Rising Stars" track at the jQuery UK conference this year where I talked about sending messages between browser windows.  This post covers the first half of my talk - sending events between local windows.</p>

<!-- _note, I've not taken much care to make these cross-browser._ -->

My slides are now [online](/winwin), though they are more prompts for me to talk, rather than being full of information.  The demos wouldn't really work with it being publicly accessible, so I'm going to cover each of the techniques I mentioned on this blog.

The websockets/binaryJS/webRTC things are on the way - just working on getting the server side part hosted nicely.

### postMessage

When you have a window that you can reference from with js - either by getting an iframe from the DOM, or as returned by window.open() - you can use postMessage to communicate with that window (crucially, even if that window has a different origin).

```js
// Send messages from parent window
var win = window.open('http://benjaminbenben.com/pink.html','','width=200');
document.onselectionchange = function(e){
	win.postMessage(document.getSelection().toString(), '*' );
}

// (on the target window) listen for messages
window.addEventListener('message', function(e){
	echo.textContent = e.data;
});

```

#### [&gt;demo](#demo1) <small>opens a window and sends it the text selection from this page</small>

For more information about postMessage - check out the [entry on MDN](https://developer.mozilla.org/en-US/docs/DOM/window.postMessage) and on [John Resigs blog post](http://ejohn.org/blog/postmessage-api-changes/) about it.

<hr />

### Storage Events

When you aren't able to access a window directly,  but it shares the same origin - you can use storage events to synchronise data between windows.

A storage event is fired when another window changes the localStorage for that page.  By listening to these events - you can keep objects in sync across windows.

```js
// listen for changes from other windows
window.addEventListener("storage", function(e){
	if(e.key == 'example') $('#el').css(JSON.parse(e.newValue));
}, false);

// update a local element and notify other windows of the change
$('#el').css({color:"red"});
localStorage.setItem('example','{color:"red"}');
```

A nice side effect of this is that you have the state of an element persisted in localStorage, so you could render that on page load.  See [this gist](https://gist.github.com/benfoxall/5477514) for a general way of doing this.

This approach can become particularly interesting when the data being synced is displayed in different ways in different windows - in my talk I showed how the reveal.js slide deck could be viewed in both overview and normal views at the same time (see [this gist](https://gist.github.com/benfoxall/5477620) to see how that can be implemented).

#### demo <small>move your mouse over the area below, any other windows open on this page will update</small>

<div id="demo2"><!----></div>
