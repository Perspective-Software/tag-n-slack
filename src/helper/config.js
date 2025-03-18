const core = require('@actions/core');

/**
 *
 * @returns {{ticketPrefixes: string[], ticketUrlTemplate}}
 */
const getConfig = () => {
    const configInput = core.getInput('config') || '{}';
    let config = {};
    try {
        config = JSON.parse(configInput);
    } catch (err) {
        console.error("Error parsing config:", err);
    }
    return config;
}

module.exports = getConfig;
