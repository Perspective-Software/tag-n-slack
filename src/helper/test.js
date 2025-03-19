const mack = require('@tryfabric/mack');

mack.markdownToBlocks(`# hello world!

- this is
- a list
- hopefully

## Sub headline

text **with** _some_ formatting and a [link](https://perspective.co)

## Screenshots

### Before

yep.

![CleanShot 2025-03-19 at 15 24 05@2x](https://github.com/user-attachments/assets/4da8f210-aefb-41cf-b9cf-51f2704245ea)

### After

A video:

https://github.com/user-attachments/assets/9c0bdb70-c0b8-4f04-9ca1-7f98874e6b45


`).then((result) => console.log(result));


