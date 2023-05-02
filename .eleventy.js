const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rssPlugin = require('@11ty/eleventy-plugin-rss');

const tagCollection = (collection) => {
    const tagsSet = new Set();
    collection.getAll().forEach(item => {
        if (!item.data.tags) return;
        item.data.tags
            .filter(tag => !['post', 'all'].includes(tag))
            .forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
}

module.exports = config => {
    config.addCollection('blog', collection => {
        return [...collection.getFilteredByGlob('./src/blog/*.md')].reverse();
    });

    config.addCollection('tagList', tagCollection);

    config.addPassthroughCopy('./src/image/');

    // Filters
    const postcssFilter = require('./src/filters/postcssFilter.js');
    const w3DateFilter = require('./src/filters/w3-date-filter.js');

    config.addNunjucksAsyncFilter('postcss', postcssFilter);
    config.addFilter('w3DateFilter', w3DateFilter);

    config.addWatchTarget('styles/**/*.css');

    // Plugins
    config.addPlugin(syntaxHighlight);
    config.addPlugin(rssPlugin);

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
