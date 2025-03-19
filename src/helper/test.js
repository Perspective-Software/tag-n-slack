const convertMarkdownToSlack = require('./markdown');

const payload = `_Updated Tag n' Slack_

## Description

### Changed

- Updated Tag n Slack for formatting

## Screenshots

### Before

Some image:

![CleanShot 2025-03-19 at 14 46 27@2x](https://github.com/user-attachments/assets/82f2bb99-a295-4a34-a51a-6739c1e16929)

A video:

https://github.com/user-attachments/assets/8a014eae-988a-4dfb-bb64-39336128080d
`;

console.log(convertMarkdownToSlack(payload));
