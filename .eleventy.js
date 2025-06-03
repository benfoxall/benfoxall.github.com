export default function (eleventyConfig) {
  // Copy static files directly to output
  eleventyConfig.addPassthroughCopy("style");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("archive");  // Copy archive directory as-is
  eleventyConfig.addPassthroughCopy("*.{ico,jpg,png,gif}");
  eleventyConfig.addPassthroughCopy("*.{css,js}");

  // Ignore directories for template processing
  eleventyConfig.ignores.add("archive/**/*");
  eleventyConfig.ignores.add("test/**/*");

  // Handle drafts
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("_posts/*.md");
  });

  eleventyConfig.addCollection("drafts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("_drafts/*.md");
  });

  // Add date filters
  eleventyConfig.addFilter("date", function (date, format) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-GB', options);
  });

  // Keep the same URL structure as Jekyll
  eleventyConfig.addFilter("postUrl", (post) => {
    const year = post.date.getFullYear();
    const month = String(post.date.getMonth() + 1).padStart(2, "0");
    const day = String(post.date.getDate()).padStart(2, "0");
    const slug = post.fileSlug;
    return `/${year}/${month}/${day}/${slug}/`;
  });

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
