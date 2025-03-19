const convertTicketsToLinks = require('./linear');

const parseScreenshotsSection = (sectionText) => {
    const matches = [];

    // Regex for Markdown image (supports multi-line alt text)
    const markdownRegex = /!\[([\s\S]*?)]\((https?:\/\/[^\s)]+)\)/g;
    let regexMatch;

    while ((regexMatch = markdownRegex.exec(sectionText)) !== null) {
        matches.push({
            index: regexMatch.index,
            url: regexMatch[2],
            alt: regexMatch[1],
            type: 'markdown',
            fullMatch: regexMatch[0],
        });
    }

    // GitHub attachment image URLs
    const rawRegex = /^(https?:\/\/github\.com\/user-attachments\/assets\/[^\s]+)$/gm;

    while ((regexMatch = rawRegex.exec(sectionText)) !== null) {
        matches.push({
            index: regexMatch.index,
            url: regexMatch[1],
            alt: '',
            type: 'raw',
            fullMatch: regexMatch[0],
        });
    }

    // Sort matches by their position in the text.
    matches.sort((a, b) => a.index - b.index);

    const screenshots = [];
    let lastIndex = 0;

    for (const match of matches) {
        // Text between images is the description
        let description = sectionText.substring(lastIndex, match.index).trim();
        description = description
            .replace(/\n+/g, ' ')
            .replace(/^#{1,6}\s*/, '') // Remove leading Markdown headers
            .trim();

        // use alt text as fallback
        if (!description && match.alt) {
            description = match.alt.trim();
        }

        description = convertTicketsToLinks(description);
        screenshots.push({ description, url: match.url });

        // Use the full match length so extra characters aren't included.
        // to prevent "123a)" from being included in the  description.
        lastIndex = match.index + match.fullMatch.length;
    }

    // Capture any trailing text after the last image.
    const rest = sectionText.substring(lastIndex).trim();

    return { screenshots, rest };
};

module.exports = parseScreenshotsSection;
