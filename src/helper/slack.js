const { IncomingWebhook } = require('@slack/webhook');
const core = require('@actions/core');
const releaseUtils = require('./release');
const convertMarkdownToSlack = require('./markdown');

const informSlack = async (release) => {
    console.log('Informing Slack...');

    const title = releaseUtils.isReleaseStrategyChangelogFile()
        ? `${core.getInput('project-name')} ${release.name} was released :rocket:`
        : `A new version of ${core.getInput('project-name')} was released :rocket:`;

    const webhook = new IncomingWebhook(core.getInput('slack-webhook-url'), {
        icon_emoji: core.getInput('slack-icon-emoji'),
    });

    const { text: formattedChangelog, screenshots, rest } = convertMarkdownToSlack(release.body);

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
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: formattedChangelog,
            },
        },
    ];

    if (screenshots.length > 0) {
        blocks.push({ type: 'divider' });
        blocks.push({
            type: 'section',
            text: { type: 'mrkdwn', text: '*Screenshots* :camera:' },
        });
        screenshots.forEach((shot) => {
            if (shot.description) {
                blocks.push({
                    type: 'section',
                    text: { type: 'mrkdwn', text: `_${shot.description}_` },
                });
            }
            blocks.push({
                type: 'image',
                image_url: shot.url,
                alt_text: shot.description || 'Screenshot',
            });
        });
    }
    if (rest) {
        blocks.push({ type: 'divider' });
        blocks.push({
            type: 'section',
            text: { type: 'mrkdwn', text: rest },
        });
    }

    blocks.push(
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
    );

    try {
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
