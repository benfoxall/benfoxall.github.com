---
layout: post
title: PhantomJS WebServer
---

<p class="lead">The <a href="http://phantomjs.org/">PhantomJS</a> WebServer module lets you create self contained web applications that are easy to deploy to heroku using the PhantomJS build pack.</p>

**I'll be talking about this at [Oxford geek nights](http://oxford.geeknights.net) on the [7th of August](http://lanyrd.com/2013/ogn32/) - come along if you're in the area.**

(tl;dr - deployed example [here](http://quiet-lowlands-5118.herokuapp.com/) &amp; more involved app [here](http://phantomjs-webserver-example.herokuapp.com/))

Let's start with a base PhantomJS script - this loads the Oxfordshire [lanyrd page](http://lanyrd.com/places/oxfordshire/) and outputs the names of any upcoming events:

{% highlight javascript %}
var page = new WebPage();

page.open("http://lanyrd.com/places/oxfordshire/", function(){
  var events = page.evaluate(function(){
    return $('.vevent .summary').map(function(e){
      return '* ' + this.innerText
    }).toArray().join('\n');
  });

  console.log('Upcoming Events in Oxfordshire:');
  console.log(events);

  phantom.exit();
});
{% endhighlight %}

This script can be run with `phantomjs example.js` and it will print the names of all upcoming events in the terminal - something like this:

<pre>Upcoming Events in Oxfordshire:
* Oxford Geek Night 32
* WitneyMeets
* XML Summer School 2013
* Sterling Geo Intergraph ERDAS UK UGM
* All Your Base Conference 2013
* jQuery UK 2014
* World Humanist Congress 2014</pre>

…super cool.  Have a look at the [quick start guide](https://github.com/ariya/phantomjs/wiki/Quick-Start) on the [PhantomJS wiki](https://github.com/ariya/phantomjs/wiki) to find out how this works and what other things are possible.

### Using the webserver module

To expose this script with the [webserver module](https://github.com/ariya/phantomjs/wiki/API-Reference-WebServer), you have to add a few things:

{% highlight javascript %}
// import the webserver module, and create a server
var server = require('webserver').create();

// start a server on port 8080 and register a request listener
server.listen(8080, function(request, response) {

  var page = new WebPage();

  page.open("http://lanyrd.com/places/oxfordshire/", function(){
    var events = page.evaluate(function(){
      return $('.vevent .summary').map(function(e){
        return '* ' + this.innerText
      }).toArray().join('\n');
    });

    // Rather than console logging, write the data back as a
    // response to the user
    //
    // console.log('Upcoming Events in Oxfordshire:');
    // console.log(events);

    response.statusCode = 200;
    response.write('Upcoming Events in Oxfordshire:\n');
    response.write(events);
    response.close();

    // We want to keep phantom open for more requests, so we
    // don't exit the process. Instead we close the page to
    // free the associated memory heap
    //
    // phantom.exit();

    page.close();

  });
});
{% endhighlight %}

This can be run in the same way as the previous script - `phantomjs example.js` - then when you visit [localhost:8080](http://localhost:8080), you should see the list of events in your browser.

<p><img class="img-responsive" src="/img/phantomjs-lanyrd.png" alt="localhost:8080 - list of events from lanyrd"></p>

With phantomjs, you're not limited to sending plain text back to the client - you can [render images](https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#wiki-webpage-render) of the webpage and send that back (either by reading the file back with the [File System Module](https://github.com/ariya/phantomjs/wiki/API-Reference-FileSystem), or using [base 64](https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#renderbase64format) to send back an embeddable data-uri).

### Deploying

There is a [PhantomJS Buildpack](https://github.com/stomita/heroku-buildpack-phantomjs) for heroku which makes deploying lovely.

To get your app ready for deployment you have to do a few things:

#### Set the port based on environment variable `PORT`

{% highlight javascript %}
var port = require('system').env.PORT || 8080; // default back to 8080
server.listen(port, function(request, response) {
{% endhighlight %}

#### Add a file named `Procfile` containing the command to spin it up:

<pre>web: phantomjs example.js</pre>

#### Commit your files to git then create a heroku app with the build pack

<pre><strong>heroku create --stack cedar --buildpack http://github.com/stomita/heroku-buildpack-phantomjs.git</strong>
<div class="bumf">Creating quiet-lowlands-5118... done, stack is cedar
BUILDPACK_URL=http://github.com/stomita/heroku-buildpack-phantomjs.git
http://quiet-lowlands-5118.herokuapp.com/ | git@heroku.com:quiet-lowlands-5118.git
Git remote heroku added</div></pre>

#### Push your code up to heroku

<pre><strong>git push heroku master</strong>
<div class="bumf">Counting objects: 10, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (7/7), done.
Writing objects: 100% (10/10), 1.34 KiB, done.
Total 10 (delta 2), reused 0 (delta 0)

-----> Fetching custom git buildpack... done
-----> PhantomJS app detected
-----> Fetching PhantomJS 1.9.0 binaries at http://stomita-buildpack-phantomjs.s3.amazonaws.com/buildpack-phantomjs-1.9.0.tar.gz
-----> Extracting PhantomJS 1.9.0 binaries to /tmp/build_2idj4c8tadrpx/vendor/phantomjs
-----> Discovering process types
       Procfile declares types     -> web
       Default types for PhantomJS -> console

-----> Compiled slug size: 15.5MB
-----> Launching... done, v5
       http://quiet-lowlands-5118.herokuapp.com deployed to Heroku

To git@heroku.com:quiet-lowlands-5118.git
 * [new branch]      master -> master</div>
</pre>

The example app should now be available on the reported url (in this case: [http://quiet-lowlands-5118.herokuapp.com](http://quiet-lowlands-5118.herokuapp.com)).

<p><a class="btn btn-primary btn" href="http://quiet-lowlands-5118.herokuapp.com">View Deployed Example Site</a> <a class="btn btn-default" href="https://github.com/benfoxall/phantomjs-oxfordshire-events">GitHub Source</a></p>

----

## A more involved example

I've put together a [more complex](https://github.com/benfoxall/phantomjs-webserver-example) version of this style of app - it allows you to specify any webpage, renders a screenshot and returns some information about the page (a list of links).

It also serves a static page with a form to submit the requests to the app.  It's deployed to [phantomjs-webserver-example.herokuapp.com](http://phantomjs-webserver-example.herokuapp.com/) and the source code is [on github](https://github.com/benfoxall/phantomjs-webserver-example).

I've tried to make it an easy project to modify for your own use - so fork away and have a hack!

<p><a href="http://phantomjs-webserver-example.herokuapp.com/"><img class="img-responsive" src="/img/phantomjs-more.png" alt="screenshot of example code" /></a></p>

<p><a class="btn btn-primary btn" href="http://phantomjs-webserver-example.herokuapp.com">View Demo</a> <a class="btn btn-default" href="https://github.com/benfoxall/phantomjs-webserver-example">GitHub Source</a></p>


### A few issues / gotchas

* Mongoose (the embedded server) doesn't parse the POST parameters with the default jQuery `contentType` header 'application/x-www-form-urlencoded; charset=UTF-8';  I had to [drop the charset](https://github.com/benfoxall/phantomjs-webserver-example/blob/master/index.html#L52) and it seemed to work okay.
* Firefox has trouble parsing large data-uri strings in json objects, so I've split the image and json on separate lines and decode them when the request comes back (unfortunately Firefox fails to add the xhr header that fixes the mongoose error)
* GET parameters aren't parsed.  I'd much sooner use a GET request for this app, as there's not any state change and it would allow the responses to be cached.  In [wtcss](http://css.benjaminbenben.com) I [fudged](https://github.com/benfoxall/wtcss/blob/master/app.js#L59-L61) this parsing.
* Sometimes the page render returns a blank image, especially when on heroku and under stress. This is a [known issue](https://groups.google.com/forum/#!searchin/phantomjs/blank/phantomjs/7XIaNEELuuo/b2jH1B_DJP0J) - a work around is to [wrap the .render in a setTimeout](https://github.com/benfoxall/phantomjs-webserver-example/blob/master/server.js#L61-L67).
