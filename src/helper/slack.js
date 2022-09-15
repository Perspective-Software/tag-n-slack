const Slack = require('slack-node');
const core = require('@actions/core');

const informSlack = ( release ) => {
  console.log( '-> Informing Slack' );
  const slack = new Slack();
  slack.setWebhook( core.getInput('slack-webhook-url') );

  slack.webhook( {
    text : `Frontend version ${release.name} was released.\n\n${release.body}`
  }, ( err, response ) => {
    console.log( 'slack =>', err, response.status );
  } );
};

module.exports = informSlack;
