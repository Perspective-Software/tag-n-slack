const Slack = require('slack-node');
const core = require('@actions/core');

const informSlack = (release) => {
    console.log('Informing Slack...');
    const slack = new Slack();
    slack.setWebhook(core.getInput('slack-webhook-url'));

    slack.webhook(
        {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `Frontend version ${release.name} was released.\n\n${release.body}`,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: release.body,
                    },
                },
            ],
            icon_url: core.getInput('slack-icon'),
            color: core.getInput('slack-color'),
            username: core.getInput('slack-username'),
        },
        (err, response) => {
            if (err) {
                console.warn(err);
            } else {
                console.log('Slack repsonse:', response.status);
            }
        },
    );
};

module.exports = informSlack;
