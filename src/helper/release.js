const core = require('@actions/core');
const github = require('@actions/github');
const ghRelease = require('gh-release');
const axios = require('axios');

const STRATEGY_INPUT_NAME = 'version-increment-strategy';

/**
 * This strategy retrieves the version from package.json and the release message from CHANGELOG.md.
 */
const CHANGELOG_FILE_STRATEGY = 'changelog-file';

/**
 * This strategy retrieves the version and message from the merge commit.
 * The version is the 7-digit hash, and the message is the commit message.
 *
 * It is recommended to use this strategy with "Squash and Merge",
 * where the PR title and description become the commit message.
 */
const GITHUB_RELEASES_STRATEGY = 'github-releases';

const internals = {};

const token = core.getInput('github-access-token');

internals.getReleaseStrategy = () => {
    const strategy = core.getInput(STRATEGY_INPUT_NAME) || CHANGELOG_FILE_STRATEGY;

    if (![CHANGELOG_FILE_STRATEGY, GITHUB_RELEASE_STRATEGY].includes(strategy)) {
        throw `${STRATEGY_INPUT_NAME} must be one of: ${CHANGELOG_FILE_STRATEGY}, ${GITHUB_RELEASE_STRATEGY}. Received: ${strategy}`;
    }

    return strategy;
};

internals.isReleaseStrategyChangelogFile = () => {
    return getReleaseStrategy() === CHANGELOG_FILE_STRATEGY;
};

internals.isReleaseStrategyGithubReleases = () => {
    return getReleaseStrategy() === GITHUB_RELEASES_STRATEGY;
};

internals.fetchGithubReleases = () => {
    const request = {
        method: 'GET',
        url: `https://api.github.com/repos/${github.context.payload.repository.full_name}/releases`,
        headers: { Authorization: `token ${token}` },
        json: true,
    };

    return axios(request)
        .then((response) => {
            return response.data.map((release) => release.name);
        })
        .catch((err) => {
            throw err;
        });
};

internals.createGithubRelease = (strategy, { version, message }) => {
    return new Promise((resolve, reject) => {
        const options =
            strategy === GITHUB_RELEASES_STRATEGY
                ? {
                      tag_name: version,
                      target_commitish: core.getInput('target-commitish') || 'main',
                      name: version,
                      body: message,
                      draft: false,
                      prerelease: false,
                      owner: github.context.payload.repository_owner,
                      repo: github.context.payload.repository.name,
                      cli: true,
                  }
                : {};

        options.auth = { token };
        ghRelease(options, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            // create release response: https://developer.github.com/v3/repos/releases/#response-4
            console.log('Created new Release on Github:', result.url);
            resolve(result);
        });
    });
};

module.exports = internals;
