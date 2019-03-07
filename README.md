# DisBot
Node.js library for Discord command bots

# installing
Currently DisBot is not a node module, so you instead put the disbot file in your project directory. 
So instead of:
```
|-: project
| |-: node_modules
| | |-: DisBot
| | ' '-- (files)
| |-- main.js
' '-- package.json
```
do:
```
|-: project
| |-: DisBot
| | '-- (files)
| |-- node_modules
| |-- main.js
' '-- package.json
```

you will also need discord.js, you can install it using `npm install discord.js`

then use `var disbot = require("../DisBot");` to add DisBot to your code

# docs

## `disbot.init()`
starts disbot

- data: <`object`>: the config data

returns `undefined`

## `disbot.extras()`
gets extras object

`no arguments`

returns <`object`>: the extras object of your config

## `disbot.loggedIn()`
gets logged in status

`no arguments`

returns <`bool`>: true if logged in, false otherwise

## `disbot.client`
client used by DisBot

<`Discord.Client`>: the client created by DisBot

## `disbot.Discord`
discord.js library

<`Discord`>: the discord.js instance

## `disbot.generic.help()`
basic help message dialog

- color: <`number`>: the color of the embed

returns <`Function`> the message handler

## `disbot.generic.social()`
basic social link list

- color: <`number`>: the color of the embed

returns <`Function`> the message handler

## `disbot.generic.embed()`
embed template

- color: <`number`>: the color of the embed

- title: <`string`>: the title of the embed

- description: <`string`>: the content of the embed

returns <`Function`> the message handler

## `disbot.generic.text()`
creates a message handler for a string

- title: <`text`>: the text to send

returns <`Function`> the message handler

## `disbot.manual.send()`
send a message

- message: <`Discord.Message`>: the message to send

- channelCode: <`string`>: the channel code to send to

returns `nothing`

## `disbot.manual.sendtts()`
send a text-to-speech message

- message: <`Discord.Message`>: the message to send

- channelCode: <`string`>: the channel code to send to

returns `nothing`

## config object
The config object passed into `disbot.init` contains all of the information needed to run the bot.

An example config object is:
```js
{
    botName: "Bot",
    token: "<BOT TOKEN>",
    channels: [
        "<bot-spam channel>"
    ],
    otherChannels: [
        "<rules channel>",
        "<general channel>"
    ],
    commands: {
        "!help": {
            desc: "!help <-cmd: str>: displays this. If -cmd is set, displays more command info",
            ddsc: "!help <-cmd: str>: displays this. If -cmd is set, displays more command info",
            func: disbot.generic.help(0xFF7F00),
            args: [
                [],
                [
                    ["str", "-cmd", "", true]
                ]
            ]
        },
        "!links": {
            desc: "!links: gives links to stuff",
            ddsc: "!links: displays social URLs",
            func: disbot.generic.social(0xFFFF00),
            args: null
        },
    },
    mentionCommands: {
        "Bot": disbot.generic.text("Beep Boop!")
    },
    extras: {
        helpmsg: "github",
        social: [
            "Discord: discord channel",
            "Twitter: twitter",
            "Youtube: youtube"
        ]
    }
}
```
