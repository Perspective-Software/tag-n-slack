const informSlack = require('./helper/slack');
const releaseUtils = require('./helper/release');

const run = async () => {
  let releases = [];
  let release = {};

  try {
    releases = await releaseUtils.fetchGithubReleases();
  } catch ( err ) {
    console.log( err );
  }

  if ( releases.indexOf( `v${pkg.version}` ) > -1 ) {
    console.log( 'Skipping: Release already exists' );

    return Promise.resolve();
  }

  try {
    release = await releaseUtils.createGithubRelease();
  } catch ( err ) {
    console.log( err );
  }

  // return Promise.resolve();
  return informSlack( release );
}

run();
