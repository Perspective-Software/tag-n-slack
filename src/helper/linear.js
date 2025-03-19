const getConfig = require('./config');
const _ = require('lodash');

const config = getConfig();

const convertTicketsToLinks = (text) => {
    if (!config.ticketPrefixes || !config.ticketUrlTemplate) {
        return text;
    }
    const sanitizedPrefixes = config.ticketPrefixes.map(prefix => _.escapeRegExp(prefix));
    const prefixesPattern = sanitizedPrefixes.join('|'); // e.g. "CON|FUN|GRO"
    const regex = new RegExp(`\\b(${prefixesPattern})-(\\d+)\\b`, 'g');
    return text.replace(regex, (match) => {
        const url = config.ticketUrlTemplate.replace('{ticket}', match);
        return `<${url}|${match}>`;
    });
};

module.exports = convertTicketsToLinks;
