import mdAttrs from 'markdown-it-attrs'
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  // Copy static files directly to output
  eleventyConfig.addPassthroughCopy("style");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("archive");  // Copy archive directory as-is
  eleventyConfig.addPassthroughCopy("*.{ico,jpg,png,gif}");
  eleventyConfig.addPassthroughCopy("*.{css,js}");
  eleventyConfig.addPassthroughCopy("full.html");  // Copy the full.html file as-is
  eleventyConfig.addPassthroughCopy("atom.xml");
  eleventyConfig.addPassthroughCopy("atom.xsl");
  eleventyConfig.addPassthroughCopy("speaking.html");
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
  eleventyConfig.ignores.add("atom.xml");
  eleventyConfig.ignores.add("atom.xsl");
  eleventyConfig.ignores.add("speaking.html");
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

  // Handle posts collection with proper sorting
  eleventyConfig.addCollection("posts", function (collectionApi) {
    const posts = collectionApi.getFilteredByGlob("_posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });

    return posts
  });

  // Add date filters for different formats
  eleventyConfig.addFilter("date", function (date, format) {
    const d = new Date(date);
    if (format === 'YYYY-MM-DD') {
      return d.toISOString().split('T')[0];
    }
    if (format === 'DD MMMM YYYY') {
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }
    // Default format
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  });

  eleventyConfig.addFilter("date_to_xmlschema", function (date) {
    return new Date(date).toISOString();
  });

  // // Keep the same URL structure as Jekyll
  // eleventyConfig.addFilter("postUrl", (post) => {
  //   const year = post.date.getFullYear();
  //   const month = String(post.date.getMonth() + 1).padStart(2, "0");
  //   const day = String(post.date.getDate()).padStart(2, "0");
  //   const slug = post.fileSlug;
  //   return `/${year}/${month}/${day}/${slug}/`;
  // });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_includes",
      data: "_data",
      output: "_site"
    },
    // Use Nunjucks as the template engine
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
