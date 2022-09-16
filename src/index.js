const core = require('@actions/core');
const informSlack = require('./helper/slack');
const releaseUtils = require('./helper/release');
const packageUtils = require('./helper/package');

const run = async () => {
  let releases = [];
  let release = {};

  // Get version from package.json
  const version = packageUtils.getPackageVersion(core.getInput('package-json-path'));

  // fetch existing releases
  try {
    releases = await releaseUtils.fetchGithubReleases();
  } catch ( err ) {
    throw err;
  }

  // Don't create release if it already exists
  if ( releases.indexOf( `v${version}` ) > -1 ) {
    console.log( 'Skipping: Release already exists' );

    throw 'Release already exists';
  }

  // Create a release
  try {
    release = await releaseUtils.createGithubRelease();
  } catch ( err ) {
    throw err;
  }

  // Notify Slack about the release
  informSlack( release );

  return release;
}

run();
