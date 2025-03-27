const { IncomingWebhook } = require('@slack/webhook');
const core = require('@actions/core');
const releaseUtils = require('./release');
const mack = require('@tryfabric/mack');
const convertTicketsToLinks = require('./convertTicketsToLinks');

const informSlack = async (release) => {
    const title = releaseUtils.isReleaseStrategyChangelogFile()
        ? `${core.getInput('project-name')} ${release.name} was released :rocket:`
        : `A new version of ${core.getInput('project-name')} was released :rocket:`;

    const webhook = new IncomingWebhook(core.getInput('slack-webhook-url'), {
        icon_emoji: core.getInput('slack-icon-emoji'),
    });

    let bodyContent = release.body;
    const hasRemoveImage = core.getInput('remove-images');

    bodyContent = convertTicketsToLinks(bodyContent);

    if(hasRemoveImage) {
        console.log('Removing images from release body...');
        bodyContent = release.body
            // Remove inline Markdown images
            .replace(/!\[([\s\S]*?)]\((https?:\/\/[^\s)]+)\)/g, '_-private image-_')
            // Remove raw GitHub attachment image URLs
            .replace(/(https?:\/\/github\.com\/user-attachments\/assets\/[^\s]+)/g, '_-private attachment-_');
    }

    const slackBlocks = await mack.markdownToBlocks(bodyContent);

    const blocks = [
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
        ...slackBlocks,
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
    ];

    try {
        console.log('Posting to Slack...');

        await webhook.send({
            text: title,
            blocks,
        });

        console.log('Done!');
    } catch (err) {
        throw err;
    }
};

module.exports = informSlack;
