# DisBot
node.js library for Discord chat bots

# installing
currently DisBot is not a node module, so you instead put the disbot file in your project directory
so instead of:
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
