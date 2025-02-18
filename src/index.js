const core = require('@actions/core');
const informSlack = require('./helper/slack');
const releaseUtils = require('./helper/release');
const packageUtils = require('./helper/package');
const gitUtils = require('./helper/git');

const run = async () => {
    console.log(`Starting release process using ${releaseUtils.getReleaseStrategy()} strategy...`);

    let releases = [];
    let release = {};

    try {
        const version = releaseUtils.isReleaseStrategyChangelogFile()
            ? packageUtils.getPackageVersion(core.getInput('package-json-path'))
            : gitUtils.getCurrentGitCommitHash();
        const message = releaseUtils.isReleaseStrategyGithubReleases()
            ? gitUtils.getCurrentGitCommitMessage()
            : undefined;

        // fetch existing releases
        releases = await releaseUtils.fetchGithubReleases();

        console.log(`Checking whether version ${version} was already released...`);

        // Don't create release if it already exists
        if (releases.indexOf(`v${version}`) > -1) {
            throw 'Skipping: Release already exists';
        }

        console.log(`Creating Github release for ${version}...`);
        release = await releaseUtils.createGithubRelease({ version, message });

        console.log(`Informing new release for ${version} in Slack...`);
        await informSlack(release);

        return release;
    } catch (err) {
        console.warn(err);
    }
};

run().then((release) => core.setOutput('release', release));
