module.exports = config => {
    config.addCollection('blog', collection => {
        return [...collection.getFilteredByGlob('./src/blog/*.md')].reverse();
    });

    const postcssFilter = require('./src/filters/postcssFilter.js');

    config.addNunjucksAsyncFilter('postcss', postcssFilter);
    config.addWatchTarget('styles/**/*.css');

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
