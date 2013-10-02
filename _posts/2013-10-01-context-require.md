---
layout: post
---
<p class="lead">This is how I organise JavaScript assets on this site.</p>

<p><a class="btn btn-default" href="https://github.com/benfoxall/context-require">view code on github</a></p>

### Motivation

When I started this blog, I knew that I wanted to include specific and varied scripts on each post.

I didn't want to serve all my js files together in one blob with each page load:

* The built js file would get bigger with each post I add
* I wanted the flexibility to use any new library that I came across (didn't want to think "I've already used X, so I'll just use that")

### Approach

I use [require.js](http://requirejs.org/) to modularise my code.  If I want to make part of the document *fancy* - then I define it in a file called `fancy.js` like this:

{% highlight javascript %}
define(['jquery'], function($){
  return function(element){
    $(element).doFancyStuff()
  } 
})
{% endhighlight %}

&hellip; the module defines a function that can be applied with a particular dom node.

Then, in the markup - I specify which module I want to apply to a particular piece of markup:

{% highlight html %}
<div class="cr" data-cr="fancy">
	<h1>RAINBOWS</h1>
	<p>UNICORNS</p>
</div>
{% endhighlight %}

I then stitch this together with another require.js module which looks through the page, loads any modules and applies them appropriately.  It looks something like this (I've used jQuery here for succinctness):

{% highlight javascript %}
$('.cr').each(function(){
  var self = this, requirement = $(self).data('cr');

  require(requirement, function(module){
    module(self);
  })
})
{% endhighlight %}

### Profit

Now I can load only the necessary scripts to display a page; which vary across pages on my blog:

* [lllocal]({% post_url 2013-04-05-lllocal %}) - only loads jQuery and a plugin to thumb between images
* [tweet-globe]({% post_url 2013-04-07-tweet-globe %}) - will load in a datafile and a vector manipulation library
* [wtcss]({% post_url 2013-05-09-wtcss %}) - won't load any extra libraries

### Dogfooding

I've enjoyed using this approach - it's made it really easy to add new posts. I've felt like I've been writing code rather than tweaking and maintaining it.

It also feels like a good distinction of concerns - by starting with the html/dom I've focussed on what I'm trying to enhance with javascript.

### Only loading scripts for on-screen elements

This approach kind of sucked for my homepage though - I've got all my posts in full, so every single script would be loaded.

So I rewrote my script to defer the loading of a module until the related element is on-screen.  It looks something like this (again, jQuery here for brevity):

{% highlight javascript %}
// using jquery.inview
$('.cr-defer').one('inview', function(){
  var self = this, requirement = $(self).data('cr');

  require(requirement, function(module){
    module(self);
  })
})
{% endhighlight %}

I've written a way to display the modules as they are loaded, which you can turn on with the button below (if the module loaded okay!)

<p class="cr-defer" data-cr="cr-debug-toggle"><!----></p>

This should reload the page with a panel to the left which will display:

* cr - the script with loads in the modules for the page
* cr-debug - the module that displays the panel on the left
* ko - knockout, which is used to update the panel

as you scroll down the page, you should see more modules loading in as you go past the posts.

### Limitations / solutions

I can use this approach because I've got independent bits of content.  Creating larger scale interconnected sites requires a lot more thought and planning. [Addy Osami](https://twitter.com/intent/user?screen_name=addyosmani) did a [great talk](http://vimeo.com/40866386) on building large scale JS applications at last years jQueryUK. He also has an online book - [Learning JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/) which is worth a read.

The other limitation of this approach is performance.  Require.js has a great build tool which lets you compile your components into a single file - though this would defeat the purpose of what I was trying to do in the first place.

The issue isn't with the size of download, but the waterfall effect that happens when each dependency is loaded (as a module must be loaded before the dependencies can be found).  This (and a solution to this) is described brilliantly in a presentation at last years JSConfEU - [A novel, efficient approach to JavaScript loading](http://www.youtube.com/watch?v=mGENRKrdoGY)

Also, if you're interested in this kind of stuff - have a read of [Alex Sexton](https://twitter.com/intent/user?screen_name=SlexAxton)'s blog post about [deploying javascript applications](http://alexsexton.com/blog/2013/03/deploying-javascript-applications/).

I have a feeling that this is the kind of problem that people have dealt with or have ideas about before.  I'd really love to hear from you if you have.
