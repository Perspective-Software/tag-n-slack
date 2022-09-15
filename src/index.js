const core = require('@actions/core');
const informSlack = require('./helper/slack');
const releaseUtils = require('./helper/release');
const packageUtils = require('./helper/package');

const run = async () => {
  let releases = [];
  let release = {};

  const version = packageUtils.getPackageVersion(core.getInput('package-json-path'));

  try {
    releases = await releaseUtils.fetchGithubReleases();
  } catch ( err ) {
    console.log( err );
  }

  if ( releases.indexOf( `v${version}` ) > -1 ) {
    console.log( 'Skipping: Release already exists' );

    return Promise.resolve();
  }

  try {
    release = await releaseUtils.createGithubRelease();
  } catch ( err ) {
    console.log( err );
  }

  return informSlack( release );
}

run();
