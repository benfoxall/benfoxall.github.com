import mdAttrs from 'markdown-it-attrs'
import yaml from "js-yaml";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { pathToFileURL } from "node:url";
import { evaluate } from "@mdx-js/mdx";
import { renderToStaticMarkup } from "react-dom/server";
import * as runtime from "react/jsx-runtime";

export default function (eleventyConfig) {


  // :robot: I can't be bothered fixing this properly at the moment
  // Add date filter for events that handles UK date format (DD/MM/YYYY)
  eleventyConfig.addFilter("date", function (date, format) {
    if (!date) return '';
    // Handle UK date format (DD/MM/YYYY)
    let d;
    if (typeof date === 'string' && date.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const [day, month, year] = date.split('/').map(n => parseInt(n, 10));
      d = new Date(year, month - 1, day); // month is 0-based in Date constructor
    } else {
      d = new Date(date);
    }
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  // Add RSS plugin

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom", // or "rss", "json"
    outputPath: "/atom.xml",
    collection: {
      name: "posts", // iterate over `collections.posts`
      limit: 0,     // 0 means no limit
    },
    metadata: {
      language: "en",
      title: "BenjaminBenBen",
      subtitle: "Some stuff by Ben Foxall",
      base: "https://benjaminbenben.com/",
      author: {
        name: "Ben Foxall",
        email: "", // Optional
      }
    }
  });

  // Copy static files directly to output
  eleventyConfig.addPassthroughCopy("style");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("archive");  // Copy archive directory as-is
  eleventyConfig.addPassthroughCopy("*.{ico,jpg,png,gif}");
  eleventyConfig.addPassthroughCopy("*.{css,js}");
  eleventyConfig.addPassthroughCopy("full.html");  // Copy the full.html file as-is
  eleventyConfig.addPassthroughCopy("atom.xsl");
  eleventyConfig.addPassthroughCopy("cam.html");
  eleventyConfig.addPassthroughCopy("details.html");
  eleventyConfig.addPassthroughCopy("foc.html");
  eleventyConfig.addPassthroughCopy("d3-wall-force.html");
  eleventyConfig.addPassthroughCopy("world");
  eleventyConfig.addPassthroughCopy("qr");
  eleventyConfig.addPassthroughCopy("scan*");
  eleventyConfig.addPassthroughCopy("max.html");
  eleventyConfig.addPassthroughCopy("fidelity");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("card");
  eleventyConfig.addPassthroughCopy("show+ask.html");

  // Ignore directories and files for template processing
  eleventyConfig.ignores.add("archive/**/*");
  eleventyConfig.ignores.add("migrate/**/*");
  eleventyConfig.ignores.add("full.html");  // Ignore full.html for processing
  eleventyConfig.ignores.add("atom.xsl");
  eleventyConfig.ignores.add("cam.html");
  eleventyConfig.ignores.add("details.html");
  eleventyConfig.ignores.add("foc.html");
  eleventyConfig.ignores.add("d3-wall-force.html");


  // Configure markdown with syntax highlighting and Kramdown-like attributes
  eleventyConfig.amendLibrary("md", mdLib => {
    mdLib.use(mdAttrs, {
      leftDelimiter: '{:',
      rightDelimiter: '}',
      allowedAttributes: ['id', 'class', 'rel']
    });

    mdLib.set({
      html: true,
      breaks: false,
      linkify: true
    });
  });

  eleventyConfig.addPlugin(syntaxHighlight);


  // Add shortcode for post URLs (replacing Jekyll's post_url tag)
  eleventyConfig.addShortcode("postUrl", function (postName) {
    // Remove the date prefix if it exists
    const slug = postName.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    // Find the post in the collection
    const post = this.ctx.collections.posts.find(p => {
      const postSlug = p.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
      return postSlug === slug;
    });
    if (!post) {
      console.warn(`Warning: Could not find post "${postName}"`);
      return `/${postName}/`;
    }
    return post.url;
  });

  // Handle posts collection with proper sorting and draft filtering
  eleventyConfig.addCollection("posts", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob(["_posts/*.md", "_posts/*.mdx"]).filter(post => !post.data.draft).sort((a, b) => {
      return a.date - b.date;
    });
    return posts;
  });

  // Add events collection
  eleventyConfig.addCollection("events", function (collectionApi) {
    const events = collectionApi.getAll()[0].data.events || [];
    return events.sort((a, b) => {
      return new Date(b.date) - new Date(a.date); // Sort in reverse chronological order
    });
  });


  eleventyConfig.addDataExtension("yml", (contents) => {
    return yaml.load(contents)
  });

  eleventyConfig.addFilter("date_to_xmlschema", function (date) {
    return new Date(date).toISOString();
  });

  eleventyConfig.addExtension("mdx", {
    compile: async (str, inputPath) => {
      const { default: mdxContent } = await evaluate(str, {
        ...runtime,
        baseUrl: pathToFileURL(inputPath)
      });

      return async function (data) {
        let res = await mdxContent(data);
        return renderToStaticMarkup(res); // todo, handle interactive components
      }
    }
  });


  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html", "mdx"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
