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

# using
