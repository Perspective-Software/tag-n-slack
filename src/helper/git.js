const { execSync } = require('child_process');

const internals = {};

/**
 * Retrieves the current Git commit hash.
 *
 * @returns {string} The first 7 characters of the current Git commit hash.
 */
internals.getCurrentGitCommitHash = () => {
    return execSync('git rev-parse HEAD', { cwd: process.cwd() }).toString().trim().substring(0, 7);
};

/**
 * Retrieves the current Git commit message.
 *
 * @returns {string} The message of the latest git commit.
 */
internals.getCurrentGitCommitMessage = () => {
    return execSync('git log -1 --pretty=%B', { cwd: process.cwd() }).toString().trim();
};

module.exports = internals;
