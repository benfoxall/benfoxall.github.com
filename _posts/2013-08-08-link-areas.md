---
layout: post
title: Plotting links
---

<p class="lead">This shows how you can pull in data from PhantomJS into another page and display it there.</p>

I used this example when I talked about "serving websites to websites with PhantomJS" at this months Oxford Geek Nights

## Link Areas

With phantomjs you are able to access more than just the HTML/DOM of a page - how the page is eventually rendered in a browser.  In this example - we can pull out all the links of a page and find out what area (in pixels) they consume.

![link areas on oxford geek nights](/img/link-areas.png)

Using this script we can get a map of the links to the element areas, which looks something like this:

{% highlight javascript %}
{
  "http://benjaminbenben.com/":6534,
  "http://bit.ly/Pesy75":10640,
  "http://lanyrd.com/cqfdw":18012,
  "http://mynameismartin.com/":8646,
  "http://oxford.geeknights.net/":84000,
  "http://oxford.geeknights.net/ogn29":52052,
  "http://oxford.geeknights.net/ogn30":52052,
  "http://oxford.geeknights.net/ogn31":52052,
  "http://oxford.geeknights.net/volunteer.html":29520,
  "http://torchbox.com/":4760,
  "http://twitter.com/oxfordgeeks":20112,
  "http://www.marianamota.com/":33128,
  "http://www.torchbox.com/":3360,
  "https://github.com/LuRsT":8580
}
{% endhighlight %}

## Graphing the data

We can now pull in this data with AJAX and render it on the page using d3 (the force directed graph layout)


<div class="cr" data-cr="link-areas">
	<form class="form-inline" action="http://ogn32-link-areas.herokuapp.com">
		<input type="url" name="url" class="visurl form-control" placeholder="Enter a URL" required="required"/>
		<input type="submit" class="btn btn-primary" value="add" />
		<button class="btn btn-default">clear</button>
	</form>
	<div class="vis"><!----></div>
	<p class="tip"></p>

	<h4>examples</h4>
	<ul class="examples unstyled">
		<li>
			<a class="btn btn-default btn-mini" href="http://oxford.geeknights.net/">OGN#32</a> 
			<a class="btn btn-default" href="http://benjaminbenben.com/2013/07/28/phantomjs-webserver/">blog post (about ogn32 &amp; PhantomJS)</a> 
			<a class="btn btn-default" href="http://phantomjs.org/">PhantomJS site</a>
		</li>
		<li>
			<a class="btn btn-default" href="http://getbootstrap.com/">bootstrap 3 docs</a> 
			<a class="btn btn-default" href="http://getbootstrap.com/2.3.2/">bootstrap 2.3.2 docs</a>
		</li>
	</ul>
</div>
