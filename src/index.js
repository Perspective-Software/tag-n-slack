const core = require('@actions/core');
const informSlack = require('./helper/slack');
const releaseUtils = require('./helper/release');
const packageUtils = require('./helper/package');

const run = async () => {
    let releases = [];
    let release = {};

    try {
        // Get version from package.json
        const version = packageUtils.getPackageVersion(core.getInput('package-json-path'));

        // fetch existing releases
        releases = await releaseUtils.fetchGithubReleases();

        // Don't create release if it already exists
        if (releases.indexOf(`v${version}`) > -1) {
            throw 'Skipping: Release already exists';
        }

        release = await releaseUtils.createGithubRelease();

        // Notify Slack about the release
        await informSlack(release);

        return release;
    } catch (err) {
        console.warn(err);
    }
};

run().then((release) => core.setOutput('release', release));
