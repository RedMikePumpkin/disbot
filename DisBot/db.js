var Discord = require("discord.js"),
    client = new Discord.Client();

var cfgData = {};
var loggedIn = false;

//var CustomError=(name="CustomError",message="")=>{Error.call(message);this.name=name;this.message=message;};CustomError.prototype=Error.prototype;

module.exports.init = (config) => {
    cfgData = config;
    client.login(config.token);
};

module.exports.extras = () => {return cfgData.extras};
module.exports.loggedin = () => {return loggedIn};
module.exports.client = () => {return client};
module.exports.Discord = Discord;

/*module.exports.generic = {
    help: (msg) => {
        var o = "The commands supported by " + cfgData.botName + ":";
        Object.keys(cfgData.commands).forEach((i)=>{
            o += "\n" + cfgData.commands[i].desc;
        });
        return new Discord.RichEmbed().setTitle('Help').setColor(0xFF00BF).setDescription(o);
    },
    social: (msg) => {
        var o = cfgData.extras.social[0];
        for (var i = 1; i < cfgData.extras.social.length; i++) o += "\n" + cfgData.extras.social[i];
        return new Discord.RichEmbed().setTitle('Social Media').setColor(0xFFBF00).setDescription(o);
    }
};*/
module.exports.generic = {
    _tfn: {
        help: (msg, argv, color) => {
            if (argv["_argvError"] !== undefined) return "ERROR: " + argv["_argvError"];
            if (argv["-cmd"] === "") {
                var o = "The commands supported by " + cfgData.botName + ":";
                Object.keys(cfgData.commands).forEach((i)=>{
                    o += "\n" + cfgData.commands[i].desc;
                });
                return new Discord.RichEmbed().setTitle('Help').setColor(color).setDescription(o);
            } else {
                if (cfgData.commands[argv["-cmd"]] !== undefined) {
                    return new Discord.RichEmbed().setTitle('Help: ' + argv["-cmd"]).setColor(color).setDescription(cfgData.commands[argv["-cmd"]].ddsc);
                }
                return new Discord.RichEmbed().setTitle('Help: ERROR').setColor(color).setDescription("\"" + argv["-cmd"] + "\" does not exist!");
            }
        },
        social: (msg, color) => {
            var o = cfgData.extras.social[0];
            for (var i = 1; i < cfgData.extras.social.length; i++) o += "\n" + cfgData.extras.social[i];
            return new Discord.RichEmbed().setTitle('Social Media').setColor(color).setDescription(o);
        }
    },
    help: (color) => {
        return (msg, argv) => {return module.exports.generic._tfn.help(msg, argv, color)};
    },
    social: (color) => {
        return (msg) => {return module.exports.generic._tfn.social(msg, color)};
    },
    embed: (color, title, desc) => {
        return (msg) => {return new Discord.RichEmbed().setTitle(title).setColor(color).setDescription(desc)};
    },
    text: (text) => {
        return (msg) => {return text.toString()};
    }
};
module.exports.manual = {
    send: (msg, channelIncId) => {
        if (channelIncId[0] === "A") {
            client.channels.get(cfgData.channels[parseInt(channelIncId.substring(1, channelIncId.length))]).send(msg);
        }
        if (channelIncId[0] === "B") {
            client.channels.get(cfgData.otherChannels[parseInt(channelIncId.substring(1, channelIncId.length))]).send(msg);
        }
    },
    sendtts: (msg, channelIncId) => {
        if (channelIncId[0] === "A") {
            client.channels.get(cfgData.channels[parseInt(channelIncId.substring(1, channelIncId.length))]).send(msg, {tts: true});
        }
        if (channelIncId[0] === "B") {
            client.channels.get(cfgData.otherChannels[parseInt(channelIncId.substring(1, channelIncId.length))]).send(msg, {tts: true});
        }
    }
};

client.on('ready', () => {
    console.log('logged in as ' + client.user.tag + '!');
    loggedIn = true;
    if (cfgData.extras.liveevents !== undefined) {
        for (var i = 0; i < cfgData.extras.liveevents.length; i++) {
            var ii = i;
            client.channels.get(cfgData.otherChannels[parseInt(cfgData.extras.liveevents[ii].channel.substring(1, cfgData.extras.liveevents[ii].channel.length))]).fetchMessages().then((msgs) => {
                msgs = msgs.array();
                for (var j = 0; j < msgs.length; j++) {
                    msgs[j].delete();
                }
            });
            cfgData.extras.liveevents[ii]._events = [];
            if (cfgData.extras.liveevents[ii]._refmsg) {
                cfgData.extras.liveevents[ii]._refmsg.delete();
            }
            var lastsent = cfgData.extras.liveevents[ii].start();
            client.channels.get(cfgData.otherChannels[parseInt(cfgData.extras.liveevents[ii].channel.substring(1, cfgData.extras.liveevents[ii].channel.length))]).send(lastsent).then((msg) => {
                msg.edit(msg.content);
                var cfilter = (r, u) => {
                    return true;
                };
                var collector = msg.createReactionCollector(cfilter, {maxEmojis: cfgData.extras.liveevents[ii].reactions.length + 1});
                var reacted = false;
                var react = async () => {
                    for (var j = 0; j < cfgData.extras.liveevents[ii].reactions.length; j++) {
                        var emoji = cfgData.extras.liveevents[ii].reactions[j];
                        await msg.react(emoji);
                    }
                    setTimeout(() => {reacted = true}, 100);
                };
                react();
                
                collector.on('collect', r => {
                    if (reacted) cfgData.extras.liveevents[ii]._events.push(["react", r.emoji.name]);
                });
                var lastenum = 0;
                var weirdjs;   
                /*weirdjs = () => {
                    if (cfgData.extras.liveevents[ii]._events.length > 0) {
                        var ret = 1;
                        var event = cfgData.extras.liveevents[ii]._events.shift();
                        if (event.content === cfgData.extras.liveevents[ii].reloadcmd) {
                            ret = 2;
                            msg.delete();
                            if (cfgData.extras.liveevents[ii].reload() !== undefined)
                                client.channels.get(cfgData.otherChannels[parseInt(cfgData.extras.liveevents[ii].channel.substring(1, cfgData.extras.liveevents[ii].channel.length))]).send(cfgData.extras.liveevents[ii].reload()).then((nmsg) => {
                                    cfgData.extras.liveevents[ii]._refmsg = nmsg;
                                }).catch((err) => {
                                    throw err
                                });
                            setTimeout(weirderjs, cfgData.extras.liveevents[ii].linterval());
                        }
                        event.delete();
                        if (ret === 2) return;
                        if (ret === 1) {
                            setTimeout(weirdjs, cfgData.extras.liveevents[ii].sinterval());
                            return;
                        }
                    } else {
                        var newmsg = cfgData.extras.liveevents[ii].run(lastenum);
                        var nenum = cfgData.extras.liveevents[ii].enum(newmsg.description);
                        var oenum = cfgData.extras.liveevents[ii].enum(msg.embeds[0].description);
                        lastenum = nenum - oenum;
                        console.log(lastenum);
                        if (nenum - oenum >= cfgData.extras.liveevents[ii].autorefresh()) {
                            msg.delete();
                            if (cfgData.extras.liveevents[ii].reload() !== undefined)
                                client.channels.get(cfgData.otherChannels[parseInt(cfgData.extras.liveevents[ii].channel.substring(1, cfgData.extras.liveevents[ii].channel.length))]).send(cfgData.extras.liveevents[ii].reload()).then((nmsg) => {
                                    cfgData.extras.liveevents[ii]._refmsg = nmsg;
                                }).catch((err) => {
                                    throw err;
                                });
                            setTimeout(weirderjs, cfgData.extras.liveevents[ii].linterval());
                            return;
                        }
                        msg.edit(newmsg);
                    }
                    setTimeout(weirdjs, cfgData.extras.liveevents[ii].interval());
                };*/
                var count = 0;
                weirdjs = () => {
                    count++;
                    var event = ["none", null];
                    if (cfgData.extras.liveevents[ii]._events.length > 0) {
                        event = cfgData.extras.liveevents[ii]._events.shift();
                    }
                    var newmsgd = cfgData.extras.liveevents[ii].run(lastenum, event, cfgData.extras.liveevents[ii].data);
                    cfgData.extras.liveevents[ii].data = newmsgd[1];
                    var newmsg = newmsgd[0];
                    if (newmsg.description === lastsent.description) return;
                    var nenum = cfgData.extras.liveevents[ii].enum(lastsent.description);
                    var oenum = cfgData.extras.liveevents[ii].enum(msg.embeds[0].description);
                    lastenum = nenum - oenum;
                    //console.log(lastenum);
                    if (lastenum === 0 || count > cfgData.extras.liveevents[ii].timeout / cfgData.extras.liveevents[ii].cdelay || newmsgd[2]) {
                        count = 0;
                        setTimeout(() => {msg.edit(newmsg)}, cfgData.extras.liveevents[ii].pdelay);
                        lastsent = newmsg;
                    }
                };
                setInterval(weirdjs, cfgData.extras.liveevents[ii].cdelay);
            }).catch((err) => {
                throw err;
            });
        }
    }
});

client.on('message', msg => {
    console.log(msg.content);
    if (msg.author.id === client.user.id) return; // no more https://cdn.discordapp.com/attachments/553124536480956426/553124855348854785/Screenshot_5.png
    if (cfgData.channels.indexOf(msg.channel.id) === -1) {
        Object.keys(cfgData.mentionCommands).forEach((i)=>{
            if (msg.content.indexOf(i) !== -1) {
                msg.channel.send(cfgData.mentionCommands[i](msg));
                process.stdout.write('\u0007');
            }
        });
        if (cfgData.extras.liveevents !== undefined) {
            for (var i = 0; i < cfgData.extras.liveevents.length; i++) {
                if (cfgData.otherChannels[parseInt(cfgData.extras.liveevents[i].channel.substring(1, cfgData.extras.liveevents[i].channel.length))] === msg.channel.id) {
                    cfgData.extras.liveevents[i]._events.push(["msg", msg]);
                }
            }
        }
    } else {
        Object.keys(cfgData.commands).forEach((i)=>{
            if (cfgData.commands[i].args !== null) {
                if (cfgData.commands[i].args[0].length === 0) {
                    if (msg.content.startsWith(i)) {
                        var argv = msg.content.substring(i.length + 1, msg.content.length).split(" ");
                        msg.channel.send(cfgData.commands[i].func(msg, parseArgvs(argv, cfgData.commands[i].args)));
                        process.stdout.write('\u0007');
                    }
                } else {
                    if (msg.content.startsWith(i + " ")) {
                        var argv = msg.content.substring(i.length + 1, msg.content.length).split(" ");
                        msg.channel.send(cfgData.commands[i].func(msg, parseArgvs(argv, cfgData.commands[i].args)));
                        process.stdout.write('\u0007');
                    }
                }
            } else {
                if (msg.content === i) {
                    msg.channel.send(cfgData.commands[i].func(msg));
                    process.stdout.write('\u0007');
                }
            }
        });
    }
});



function parseArgvs(argv, properties = []) {
    var pr = properties;
    var outVals = {};
    argv = fixArgvs(argv);
    for (var i = 0; i < pr[1].length; i++) {
        outVals[pr[1][i][1]] = pr[1][i][2];
    }
    for (var i = 0; i < pr[0].length; i++) {
        var t = rollbackType(argv[i], pr[0][i][2] ? pr[0][i][0] : "none");
        if (t[0] === pr[0][i][0]) {
            outVals[pr[0][i][1]] = t[1];
        } else {
            //throw new CustomError("ArgvError", "type mismatch");
            return {"_argvError": "static ArgvTypeMismatch at " + i.toString() + " (" + JSON.stringify(argv[i]) + "). For help, contact <@!368452225988558859> because he is responsible for it."};
        }
    }
    for (var i = 0; i < pr[1].length; i++) {
        var t = argv.indexOf(pr[1][i][1]);
        var debugT = t;
        if (t !== -1) {
            if (pr[1][i][0] === "bool") {
                outVals[pr[1][i][1]] = true;
            } else {
                t = rollbackType(argv[t + 1], pr[1][i][3] ? pr[1][i][0] : "none");
                if (t[0] === pr[1][i][0]) {
                    outVals[pr[1][i][1]] = t[1];
                } else {
                    //throw new CustomError("ArgvError", "type mismatch");
                    return {"_argvError": "dynamic ArgvTypeMismatch at " + i.toString() + "/" + (i+1).toString() + " (" + argv[debugT] + " " + argv[debugT + 1] + "). " + cfgData.extras.helpmsg};
                }
            }
        }
    }
    return outVals;
}
function getType(value) {
    var t;
    t = parseFloat(value);
    if (value === "NaN" || !Number.isNaN(t)) {
        return ["num", t];
    }
    t = "JSON parse failed!";
    try {
        t = JSON.parse(value);
    } catch (err) {
        t = "JSON parse failed!";
    }
    if (t !== "JSON parse failed!") {
        if (t && typeof t === 'object' && t.constructor === Array) return ["arr", t];
        if (t && typeof t === 'object' && t.constructor === Object) return ["obj", t];
    }
    if (value === "true" || value === "false") {
        return ["bool", value === "true" ? true : false];
    }
    if (value === "undefined" || value === "null") return ["null", null];
    return ["str", value];
}
function rollbackType(value, rollback = "none") {
    if (value === undefined || value === null) return ["null", null];
    if (rollback === "none") {
        return getType(value);
    }
    var type = getType(value);
    if (type[1] === null || type[1] === undefined) {
        return ["null", null];
    }
    if (rollback === "str") {
        if (type[0] === "obj" || type[0] === "arr") {
            return ["str", JSON.stringify(type[1])];
        }
        return ["str", type[1].toString()];
    } else if (rollback === "null") {
        return ["null", null];
    } else if (rollback === "bool") {
        return ["bool", type[1] ? true : false];
    } else if (rollback === "obj") {
        if (type[0] === "obj") {
            return type;
        }
        if (type[0] === "arr") {
            var outobj = {};
            for (var i = 0; i < type[1].length; i++) {
                outobj[i.toString()] = type[1][i];
            }
            return ["obj", outobj];
        }
        return ["obj", {}];
    } else if (rollback === "arr") {
        if (type[0] === "arr") {
            return type;
        }
        if (type[0] === "obj") {
            var outarr = [];
            for (var i of type[1]) {
                outarr.push(i);
                outarr.push(type[1][i]);
            }
            return ["arr", outarr];
        }
        return ["arr", []];
    } else if (rollback === "num") {
        return ["num", NaN];
    }
}
function fixArgvs(argv) {
    for (var i = 0; i < argv.length; i++) {
        if (argv[i][argv[i].length - 1] === "\\") {
            argv[i] = argv[i].slice(0, -1) + " " + argv[i+1];
            argv.splice(i + 1, 1);
            i--;
        }
    }
    return argv;
}

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    if (module.exports.loggedin()) {
        var cmd = d.toString().trim();
        var fnc = cmd.substring(0, 2);
        var msg = cmd.substring(2, cmd.length);
        if (fnc === "M ") {
            var msgch = "";
            var i = 0;
            while (msg[i] !== " ") {
                msgch += msg[i];
                i++;
            }
            msg = msg.substring(msgch.length + 1, msg.length);
            module.exports.manual.send(msg, msgch);
        }
        if (fnc === "T ") {
            var msgch = "";
            var i = 0;
            while (msg[i] !== " ") {
                msgch += msg[i];
                i++;
            }
            msg = msg.substring(msgch.length + 1, msg.length);
            module.exports.manual.sendtts(msg, msgchmin);
        }
        if (cmd === "Alert") {
            process.stdout.write('\u0007');
        }
    }
});
