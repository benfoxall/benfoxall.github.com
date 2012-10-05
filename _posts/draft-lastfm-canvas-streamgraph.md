---
layout: post
---

<p class="lead">I built a last.fm listening histories streamgraph that renders in the browser using the canvas api</p>

<img src="/img/lgraph.png" width="1284" height="856">

* About lee byrons listening histories

* The hosted one is good, though I thought it would be cool to have something that would load in instantly

* Things that are interesing with the implementation
	- deferreds to make the api easier to use
	- hacked in a name->colour hashing
	- experimented with 'one big canvas' & svg

* Limitations of the approach
	- had to randomly assign colours 
