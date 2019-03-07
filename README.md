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

- data: <`object`>: the config data

returns `undefined`

## `disbot.extras()`

`no arguments`

returns <`object`>: the extras object of your config

## `disbot.loggedIn()`

`no arguments`

returns <`bool`>: true if logged in, false otherwise

## `disbot.client`

<`Discord.Client`>: the client created by DisBot

## `disbot.Discord`

<`Discord`>: the discord.js instance

## `disbot.generic.help()`

- color: <`number`>: the color of the embed

returns <`Function`> the message handler

## `disbot.generic.social()`

- color: <`number`>: the color of the embed

returns <`Function`> the message handler

## `disbot.generic.embed()`

- color: <`number`>: the color of the embed

- title: <`string`>: the title of the embed

- description: <`string`>: the content of the embed

returns <`Function`> the message handler

## `disbot.generic.text()`

- title: <`text`>: the text to send

returns `nothing`

## `disbot.manual.send()`

- message: <`Discord.Message`>: the message to send

- channelCode: <`string`>: the channel code to send to

returns `nothing`
