const core = require('@actions/core');
const informSlack = require('./helper/slack');
const releaseUtils = require('./helper/release');
const packageUtils = require('./helper/package');

const run = async () => {
    let releases = [];
    let release = {};

    // fetch existing releases
    try {
        // Get version from package.json
        const version = packageUtils.getPackageVersion(core.getInput('package-json-path'));

        releases = await releaseUtils.fetchGithubReleases();

        // Don't create release if it already exists
        if (releases.indexOf(`v${version}`) > -1) {
            console.log('Skipping: Release already exists');

            return Promise.reject('Release already exists');
        }

        release = await releaseUtils.createGithubRelease();

        // Notify Slack about the release
        informSlack(release);

        return release;
    } catch (err) {
        throw err;
    }
};

run();
