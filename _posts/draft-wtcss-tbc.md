---
layout: post
---

* mapping css to html
* visualising css * html
* seeing css
* seeing how css interacts with a webpage
* application of css
* wtcss
* css and html
* visualising css
* css
* linking css to pages

# tl;dr

You can see how css rules impact a page by visiting [this site][wtcss].  I'm hoping that it helps me find how I can write more semantic / modular / wonderful css.

* Why I built this

CSS 

* What I hoped to see

* some examples & discussion:
	- google.com
		- A lot of the styled elements are offpage, guessing that this means that they can be brought onto the page more efficiently
		- Can be a bit of a bad example because it's so heavily optimised
		- Classnames are going to be generated/minified/optimised
	- bootstrap
		- ? the markup has separation of concerns
		- ? slightly wasted 'boilerplate' - a ramification (and bonus?) of css frameworks
	- mozilla
		- ? <3 the web?
		- bespoke
	- random example that starts clean then goes messyz

 - got more examples?  let me know!

* Implementation
	- phantomjs
	- injected script
		- having to re-insert cross domain stylesheets
	- ui
	- using phantomjs server

* Deployment
	- when I wrote this, didn't get off my local machine.
	- came to it a few months later when I saw heroku buildpacks
	- what is a buildpack
	- what I changed
		- store nothing architecture
		- used the embedded mongoose webserver



[wtcss]: http://wtcss.herokuapp.com
[phantomjs]: about:blank
