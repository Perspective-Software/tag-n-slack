const applyMarkdownFormatting = (text) => {
    const lines = text.split('\n');
    const formattedLines = lines.map(line => {
        return line
            .replace(/^#### (.*$)/g, '⇒ _*$1*_')
            .replace(/^### (.*$)/g, '→ *$1*')
            .replace(/^## (.*$)/g, '*$1*')
            .replace(/^# (.*$)/g, '*$1*')
            .replace(/^- (.*$)/g, '• $1')
            .replace(/\[(.*?)]\((.*?)\)/g, '<$2|$1>')
            .trim();
    });
    return formattedLines.join('  \n').trim();
};

module.exports = applyMarkdownFormatting;
