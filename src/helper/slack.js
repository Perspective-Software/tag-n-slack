const Slack = require('slack-node');
const core = require('@actions/core');

const informSlack = (release) => {
    console.log('Informing Slack...');
    const slack = new Slack();

    slack.setWebhook(core.getInput('slack-webhook-url'));

    slack.webhook(
        {
            fallback: `Version ${release.name} was released :rocket:`,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `Version ${release.name} was released :rocket:`,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: '*Changelog* :notebook_with_decorative_cover:',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: release.body,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'Check it out!',
                    },
                    accessory: {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Visit',
                            emoji: true,
                        },
                        value: 'visit',
                        url: 'https://next.perspective.com',
                        action_id: 'button-action',
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
