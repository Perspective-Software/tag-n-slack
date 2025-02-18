const { IncomingWebhook } = require('@slack/webhook');
const core = require('@actions/core');
const releaseUtils = require('./release');

const informSlack = async (release) => {
    console.log('Informing Slack...');

    const title = releaseUtils.isReleaseStrategyChangelogFile()
        ? `${core.getInput('project-name')} ${release.name} was released :rocket:`
        : `A new version of ${core.getInput('project-name')} was released :rocket:`;

    const webhook = new IncomingWebhook(core.getInput('slack-webhook-url'), {
        icon_emoji: core.getInput('slack-icon-emoji'),
    });

    try {
        await webhook.send({
            text: title,
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: title,
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
                        text: '*Check it out!*',
                    },
                    accessory: {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Visit',
                            emoji: true,
                        },
                        value: 'visit',
                        url: core.getInput('slack-release-link'),
                        action_id: 'button-action',
                    },
                },
            ],
        });

        console.log('Done!');
    } catch (err) {
        throw err;
    }
};

module.exports = informSlack;
