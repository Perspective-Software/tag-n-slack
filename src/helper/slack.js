const Slack = require('slack-node');
const core = require('@actions/core');

const informSlack = (release) => {
    console.log('Informing Slack...');
    const slack = new Slack();

    slack.setWebhook(core.getInput('slack-webhook-url'));

    console.log('release', release);

    slack.webhook(
        {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `Version ${release.name} was released.`,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: '*Changelog*',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: release.body,
                    },
                },
            ],
        },
        (err, response) => {
            if (err) {
                console.warn(err);
            } else {
                console.log('Slack response:', response);
            }
        },
    );
};

module.exports = informSlack;
