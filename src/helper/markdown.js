const parseScreenshotsSection = require('./screenshots');
const convertTicketsToLinks = require('./linear');
const applyMarkdownFormatting = require('./formatting');

const convertMarkdownToSlack = (markdown) => {
    // Supports "_Screenshots_" or "## Screenshots"
    const splitRegex = /^(?:_?Screenshots_?|## Screenshots)/im;
    const parts = markdown.split(splitRegex);
    const mainText = parts[0] || '';
    const screenshotsSection = parts[1] || '';

    let formattedMainText = applyMarkdownFormatting(mainText)
        // Remove inline Markdown images
        .replace(/!\[([\s\S]*?)]\((https?:\/\/[^\s)]+)\)/g, '')
        // Remove raw GitHub attachment image URLs
        .replace(/(https?:\/\/github\.com\/user-attachments\/assets\/[^\s]+)/g, '')

    formattedMainText = convertTicketsToLinks(formattedMainText);

    const { screenshots, rest } = screenshotsSection ? parseScreenshotsSection(screenshotsSection) : [];

    return { text: formattedMainText, screenshots, rest };
};

module.exports = convertMarkdownToSlack;
