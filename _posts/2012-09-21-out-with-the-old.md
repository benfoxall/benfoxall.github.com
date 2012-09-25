---
layout: post
---

<p class="lead">After more than a year of no posts - I've left my old blog behind.</p>

I've built this new one is built using [Jekyll][jkl] and put it online with [GitHub Pages][gh-pages].  The source is [public on github][blog-src].

It seems that a lot of Jekyll sites start with a post about the interesting way that they have been deployed.  So, for the record, I decided to go against the [auto-generate][gh-pages-jkl] style to keep my options open.

Instead, I set up master as an orphan branch, and have a "[deploy script][deploy]" that generates the site, moves over to master and updates the files.  I got this idea from [octopress][octopress],  I'm not totally sure if it's the best way to do this - but I guess I'll soon see.

[old blog][bfoxall]
![Bfoxall.com](/img/bfoxall.png)


[bfoxall]: http://bfoxall.com
[jkl]: http://jekyllrb.com
[gh-pages]: http://pages.github.com
[gh-pages-jkl]: https://help.github.com/articles/using-jekyll-with-pages "Using Jekyll with Pages"
[blog-src]: https://github.com/benfoxall/benfoxall.github.com "this blog source code"
[deploy]: https://github.com/benfoxall/benfoxall.github.com/blob/master/deploy.sh "deploy bash script"
[octopress]: http://octopress.org