const getTicketConfig = require('./getTicketConfig');
const escapeRegExp = require('lodash/escapeRegExp');

const ticketConfig = getTicketConfig();

const convertTicketsToLinks = (text) => {
    if (!ticketConfig.ticketPrefixes || !ticketConfig.ticketUrlTemplate) {
        return text;
    }

    console.log('Rewriting ticket strings to links...')

    const sanitizedPrefixes = ticketConfig.ticketPrefixes.map(prefix => escapeRegExp(prefix));
    const prefixesPattern = sanitizedPrefixes.join('|'); // e.g. "CON|FUN|GRO"
    const regex = new RegExp(`\\b(${prefixesPattern})-(\\d+)\\b`, 'g');

    return text.replace(regex, (match) => {
        const url = ticketConfig.ticketUrlTemplate.replace('{ticket}', match);

        return `[${match}](${url})`;
    });
};

module.exports = convertTicketsToLinks;
