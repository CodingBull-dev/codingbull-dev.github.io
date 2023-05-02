const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = config => {
    config.addCollection('blog', collection => {
        return [...collection.getFilteredByGlob('./src/blog/*.md')].reverse();
    });

    config.addPassthroughCopy('./src/image/');

    const postcssFilter = require('./src/filters/postcssFilter.js');

    config.addNunjucksAsyncFilter('postcss', postcssFilter);
    config.addWatchTarget('styles/**/*.css');

    config.addPlugin(syntaxHighlight);

    return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',

        dir: {
            input: 'src',
            output: 'dist'
        }
    };
}
