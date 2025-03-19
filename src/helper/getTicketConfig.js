const core = require('@actions/core');

/**
 *
 * @returns {{ticketPrefixes: string[], ticketUrlTemplate}}
 */
const getTicketConfig = () => {
    const configInput = core.getInput('ticket-config') || '{}';
    let config = {};

    try {
        config = JSON.parse(configInput);
    } catch (err) {
        console.error("Error parsing config:", err);
    }

    return config;
}

module.exports = getTicketConfig;
