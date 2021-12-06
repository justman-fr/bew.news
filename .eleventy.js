const {DateTime} = require("luxon");
const fs = require("fs");
const UglifyJS = require("uglify-es");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const path = require('path');
const pluginToc = require("eleventy-plugin-toc");

const Image = require("@11ty/eleventy-img");

async function imageHtmlcode(src, alt, sizes) {
    let metadata = await Image(src, {
        widths: [300, 600],
        outputDir: "./_site/img/",
        formats: ["avif", "jpeg"]
    });

    let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
    };

    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
}

function generateImages(src, widths){

    let options = {
        widths: widths,
        formats: ['jpeg'],
        outputDir: "./_site/img",
        urlPath: "/img/",
        useCache: true,
        sharpJpegOptions: {
            quality: 80,
            progressive: true
        }
    };
    // genrate images, ! dont wait
    Image(src, options);
    // get metadata even the image are not fully generated
    return Image.statsSync(src, options);
}

async function imageCssBackground (src, selector, widths){
    const metadata = generateImages(src, widths);
    let markup = [`${selector} { background-image: url(${metadata.jpeg[0].url});} `];
    // i use always jpeg for backgrounds
    metadata.jpeg.slice(1).forEach((image, idx) => {
        markup.push(`@media (min-width: ${metadata.jpeg[idx].width}px) { ${selector} {background-image: url(${image.url});}}`);
    });
    return markup.join("");
}

module.exports = function (eleventyConfig) {
    // Add plugins
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginToc);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    eleventyConfig.addPlugin(pluginNavigation);

    // https://www.11ty.dev/docs/data-deep-merge/
    eleventyConfig.setDataDeepMerge(true);


    eleventyConfig.addNunjucksAsyncShortcode("image", imageHtmlcode);
    eleventyConfig.addNunjucksAsyncShortcode("cssBackground", imageCssBackground);

    // Alias `layout: post` to `layout: layouts/post.njk`
    eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

    eleventyConfig.addFilter("readableDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat(
            "dd LLL yyyy"
        );
    });

    const searchFilter = require("./src/filters/searchFilter");
    eleventyConfig.addFilter("search", searchFilter);
    eleventyConfig.addCollection("results", (collection) => {
        return [...collection.getFilteredByGlob("**/*.md")];
    });

    // Extract reading time
    eleventyConfig.addNunjucksFilter("readingTime", (wordcount) => {
        let readingTime = Math.ceil(wordcount / 220);
        if (readingTime === 1) {
            return readingTime + " minute";
        }
        return readingTime + " minutes";
    });

    // Extract word count
    eleventyConfig.addNunjucksFilter("formatWords", (wordcount) => {
        return wordcount.toLocaleString("en");
    });

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter("htmlDateString", (dateObj) => {
        return DateTime.fromJSDate(dateObj, {zone: "utc"}).toFormat("yyyy-LL-dd");
    });

    // Get the first `n` elements of a collection.
    eleventyConfig.addFilter("head", (array, n) => {
        if (!Array.isArray(array) || array.length === 0) {
            return [];
        }
        if (n < 0) {
            return array.slice(n);
        }

        return array.slice(0, n);
    });

    // Return the smallest number argument
    eleventyConfig.addFilter("min", (...numbers) => {
        return Math.min.apply(null, numbers);
    });

    function filterTagList(tags) {
        return (tags || []).filter(
            (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
        );
    }

    eleventyConfig.addFilter("filterTagList", filterTagList);

    // Create an array of all tags
    eleventyConfig.addCollection("tagList", function (collection) {
        let tagSet = new Set();
        collection.getAll().forEach((item) => {
            (item.data.tags || []).forEach((tag) => tagSet.add(tag));
        });

        return filterTagList([...tagSet]);
    });

    // Copy the `img` and `css` folders to the output
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("static/img");
    eleventyConfig.addPassthroughCopy("admin");

    eleventyConfig.addWatchTarget("styles/tailwind.config.js");
    eleventyConfig.addWatchTarget("styles/tailwind.css");

    eleventyConfig.addFilter("jsmin", function (code) {
        let minified = UglifyJS.minify(code);
        if (minified.error) {
            console.log("UglifyJS error: ", minified.error);
            return code;
        }
        return minified.code;
    });

    // Customize Markdown library and settings:
    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
    }).use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.ariaHidden({
            placement: "after",
            class: "direct-link",
            symbol: "",
            level: [1, 2, 3, 4],
        }),
        slugify: eleventyConfig.getFilter("slug"),
    });
    eleventyConfig.setLibrary("md", markdownLibrary);

    // Override Browsersync defaults (used only with --serve)
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, browserSync) {
                const content_404 = fs.readFileSync("_site/404.html");

                browserSync.addMiddleware("*", (req, res) => {
                    // Provides the 404 content without redirect.
                    res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
                    res.write(content_404);
                    res.end();
                });
            },
        },
        ui: false,
        ghostMode: false,
    });

    return {
        // Control which files Eleventy will process
        // e.g.: *.md, *.njk, *.html, *.liquid
        templateFormats: ["md", "njk", "html", "liquid"],

        // -----------------------------------------------------------------
        // If your site deploys to a subdirectory, change `pathPrefix`.
        // Don’t worry about leading and trailing slashes, we normalize these.

        // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
        // This is only used for link URLs (it does not affect your file structure)
        // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

        // You can also pass this in on the command line using `--pathprefix`

        // Optional (default is shown)
        pathPrefix: "/",
        // -----------------------------------------------------------------

        // Pre-process *.md files with: (default: `liquid`)
        markdownTemplateEngine: "njk",

        // Pre-process *.html files with: (default: `liquid`)
        htmlTemplateEngine: "njk",

        // Opt-out of pre-processing global data JSON files: (default: `liquid`)
        dataTemplateEngine: false,

        // These are all optional (defaults are shown):
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site",
        },
    };
};
