const core = require('@actions/core');
const github = require('@actions/github');
const ghRelease = require( 'gh-release' );
const axios = require( 'axios' );

const internals = {};

const token = core.getInput('github-access-token');

internals.fetchGithubReleases = () => {
  const request = {
    method  : 'GET',
    url     : `https://api.github.com/repos/perspective-software/perspective-app-next/releases`,
    headers : { 'Authorization' : `token ${token}` },
    json    : true,
  };

  console.log(github.context);

  return axios( request )
    .then( ( response ) => {
      return response.data.map( ( release ) => release.name );
    } )
    .catch( ( err ) => {
      throw err;
    } );
};

internals.createGithubRelease = () => {
  return new Promise( ( resolve, reject ) => {
    const options = {};

    options.auth = { token };
    ghRelease( options, ( err, result ) => {
      if ( err ) {
        console.log( err );
        reject( err );
      }
      // create release response: https://developer.github.com/v3/repos/releases/#response-4
      console.log( 'Created new Release on Github:', result.url );
      resolve( result );
    } );
  } );
};

module.exports = internals;
