const {
  checkReminders,
  countdownMessages,
  fetchEshop,
  forceStopTyping,
  guildAdd,
  guildLeave,
  joinMessage,
  leaveMessage,
  lotto,
  timerMessages
} = require("/app/xiao/components/events.js");
const {
  badwords,
  duptext,
  caps,
  emojis,
  mentions,
  links,
  invites,
  slowmode
} = require("/app/xiao/components/automod.js");
const { oneLine, stripIndents } = require("common-tags");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const Database = require("better-sqlite3");
const path = require("path");
const ms = require("ms");
const moment = require("moment");
const Jimp = require("jimp");
const querystring = require("querystring");

const handleReady = (client, /*dbots,*/ msg) => {
  console.log(
    `[READY] [${moment().format("HH:mm:ss")}] Logged in as ${
      client.user.tag
    }! (${client.user.id})`
  );

  const activities = require("/app/xiao/assets/json/activity");

  client.setInterval(() => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(activity.text, { type: activity.type });
  }, 60000);

  /*
 async function postDiscordStats() {
 //https://discordbotlist.com
  const discordbotlist = require('axios')({
    method: 'post',
    url: `https://discordbotlist.com/api/bots/${client.user.id}/stats`,
    headers: {
      Authorization: `Bot ${process.env.DBLkey}`
    },
    data: {
      guilds: client.guilds.size,
      user: client.users.size,
      voice_Connection: client.voice.connections.size,
    }
  })
  .then(function (response) {
    console.log(`[DiscordBotList] STATUS: ${response.status}`)
    console.log(`[DiscordBotList] DATA SENT: ${response.config.data}`)
  })
  .catch(function(e) {
    console.log('[DiscordBotList] Failed POST')
    console.error(e)
  })
  
  
  // https://divinediscordbots.com
  const { DDBL } = require("ddblapi.js");
  const ddbl = new DDBL(process.env.DDBkey); //Replace xxx to your ddbl's token
    
  ddbl.postStats("478504038732791838", client.guilds.size); 
   
   
  }
 */

  /*  var snekfetch = require("snekfetch");

    const divineDiscordBots = snekfetch.post(`https://divinediscordbots.com/bots/${client.user.id}/stats`, {
    headers: { Authorization: process.env.DDBkey }
    })
    .send({ server_count: client.guilds.size })
    .then(function(res) { console.log(`[divinediscordbots.com] STATUS: ${res.statusCode} ${res.statusText}`) } )
    .catch(function(e) {  
          console.log('[divinediscordbots.com] Failed POST')
          console.log(e)})*/

  /*async function postDiscordStats () {
  const botlistSpace = require('axios')({
    method: 'post',
    url: `https://botlist.space/api/bots/${client.user.id}`,
    headers: {
      Authorization: process.env.BLSkey
    },
    data: {
      server_count: client.guilds.size
    }
  })
  const [bspaceres] = await Promise.all([botlistSpace]) // eslint-disable-line no-unused-vars
  console.log(bspaceres.res)
  }
    
  postDiscordStats()

  dbots.postStats(client.guilds.size)
      setInterval(() => {
        console.log('DiscordBots guild count updated.');
        postDiscordStats()
        }, 1800000);

     postDiscordStats()
  
    setInterval(() => {
    postDiscordStats()
     }, 1800000)
  */
  const bot = client;

  setInterval(() => {
    forceStopTyping(bot);
    timerMessages(bot);
    countdownMessages(bot);
  }, ms("3m"));

  setInterval(() => {
    checkReminders(bot, msg);
  }, ms("5m"));

  setInterval(() => {
    lotto(bot);
    fetchEshop(bot);
  }, ms("24h"));
  //${moment().format('HH:mm:ss')}] Logged in as ${client.user.tag}! (${client.user.id})
  try {
    client.webhook.send("evaLog", {
      title: "I'm Ready to Roll!  🚀",
      description: `${client.user.tag} (${client.user.id}) is ready with ${client.guilds.cache.size} servers.`,
      footer: {
        icon_url:
          "https://resources.bastionbot.org/logos/Bastion_Logomark_C.png",
        text: `Eva v${client.package.version}`
      },
      timestamp: new Date()
    });
  } catch (e) {
    console.log(e);
  }
  console.log("Awaiting actions.");
};

const handleErr = (client, err) => {
  console.error("[ERROR]", err);
  client.webhook.send("evaLog", {
    title: `Caught **WebSocket Error**!`,
    footer: {
      icon_url:
        "https://cdn0.iconfinder.com/data/icons/flat-security-icons/512/close-blue.png",
      text: `${moment().format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z")}`
    },
    description: `**Error Message:** ${err}`
  });
};

const handleWarn = (client, warn) => {
  console.log("[WARN]", warn);
  client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
      Caught **General Warning**!
      **Time:** ${moment().format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z")}
      **Warning Message:** ${warn}
      `);
};

const handleDebug = info => {
  if (info == ` Provided token: ${process.env.TOKEN}`) {
    console.log("TOKEN censored.");
  } else {
    console.log(`[DEBUG] ${info}`);
  }
};

const handleUnknownCmd = (client, msg) => {
  const { guild } = msg;

  if (guild && guild.settings.get("unknownmessages", true)) {
    msg.reply(stripIndents`${oneLine`That is not a registered command.
				Use \`${guild ? guild.commandPrefix : client.commandPrefix}help\`
				or @Eva help to view the list of all commands.`}
				${oneLine`Server staff (those who can manage other's messages\) can disable these replies by using
				\`${
          guild ? guild.commandPrefix : client.commandPrefix
        }unknownmessages disable\``}`);
  }
};

const handleCmdErr = (client, cmd, err, msg) => {
  var callback = function(stackframes) {
    var stringifiedStack = stackframes
      .map(function(sf) {
        return sf.toString();
      })
      .join("\n");
    console.log(stringifiedStack);
  };

  var errback = function(err) {
    console.log(err.message);
  };

  require("stacktrace-js")
    .fromError(err)
    .then(callback)
    .catch(errback);

  console.log(`
      Caught general error!
      Command: ${cmd.groupID}:${cmd.memberName}
      Server: ${msg.guild.name} (${msg.guild.id})
      Author: ${msg.author.tag} (${msg.author.id})
      Time: ${moment(msg.createdTimestamp).format(
        "MMMM Do YYYY [at] HH:mm:ss [UTC]Z"
      )}
      Error Message: ${err}
	    Stack Trace: 
	  `);

  client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
  Caught **Command Error**!
  **Command:** ${cmd.name}
  **Server:** ${msg.guild.name} (${msg.guild.id})
  **Author:** ${msg.author.tag} (${msg.author.id})
  **Time:** ${moment(msg.createdTimestamp).format(
    "MMMM Do YYYY [at] HH:mm:ss [UTC]Z"
  )}
  **Error Message:** ${err}
  `);
};

const handleCmdRun = (command, promise, msg) => {
  if (msg.guild) {
    console.log(`[COMMAND] Ran
        Guild: ${msg.guild.name} (${msg.guild.id})
        Channel: ${msg.channel.name} (${msg.channel.id})
        User: ${msg.author.tag} (${msg.author.id})
        Command: ${command.groupID}:${command.memberName}
        Message: "${msg.content}"`);
  } else {
    console.log(`[COMMAND] Ran
        Guild: DM
        Channel: N/A
        User: ${msg.author.tag} (${msg.author.id})
        Command: ${command.groupID}:${command.memberName}
        Message: "${msg.content}"`);
  }
};

const handleGuildCreate = async (client, guild) => {
  /* client.channels.resolve('496567589284085761').send(`New guild added:
      Guild: ${guild.id}
      Name: ${guild.name}
      Owner: ${guild.owner.user.tag} (${guild.owner.id})
      Created At: ${guild.createdAt}
      Members: ${guild.members.size}
      Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
      Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
      Now on: ${client.guilds.size} servers`); */

  try {
    client.webhook.send("evaLog", {
      title: "New guild added!  🚀",
      fields: [
        {
          name: "Guild: ",
          value: `${guild.id}`
        },
        {
          name: "Name: ",
          value: `${guild.name}`
        },
        {
          name: "Owner: ",
          value: `${guild.owner.user.tag} (${guild.owner.id})`
        },
        {
          name: "Created At: ",
          value: `${guild.createdAt}`
        },
        {
          name: "Members: ",
          value: `${guild.members.size}`
        },
        {
          name: "Bots: ",
          value: `${guild.members.filter(u => u.user.bot).size} (${Math.floor(
            (guild.members.filter(u => u.user.bot).size / guild.members.size) *
              100
          )}%)`
        },
        {
          name: "Humans: ",
          value: `${guild.members.filter(u => !u.user.bot).size} (${Math.floor(
            (guild.members.filter(u => !u.user.bot).size / guild.members.size) *
              100
          )}%)`
        }
      ],
      footer: {
        icon_url:
          "https://cdn4.iconfinder.com/data/icons/material-design-content-icons/512/add-circle-512.png",
        text: `Now on: ${client.guilds.size} servers`
      },
      timestamp: new Date()
    });
  } catch (e) {
    console.log(e);
  }

  console.log(`New guild added:
      Guild: ${guild.id}
      Name: ${guild.name}
      Owner: ${guild.owner.user.tag} (${guild.owner.id})
      Created At: ${guild.createdAt}
      Members: ${guild.members.size}
      Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(
    (guild.members.filter(u => u.user.bot).size / guild.members.size) * 100
  )}%)
      Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(
    (guild.members.filter(u => !u.user.bot).size / guild.members.size) * 100
  )}%)
      Now on: ${client.guilds.size} servers`);

  /*const botPercentage = Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100);
    if (botPercentage >= 80) {
      let found = 0;
      guild.channels.map(c => {
        if (found === 0) {
          if (c.type === 'text') {
            if (c.permissionsFor(client.user).has('VIEW_CHANNEL') === true) {
              if (c.permissionsFor(client.user).has('SEND_MESSAGES') === true) {
                c.send('**ALERT:** Your guild has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave this server.');
                c.send('If you wish to speak to my developers, you may find them here.');
                found = 1;
              }
            }
          }
        }
      });
      
      guild.owner.send(`**ALERT:** Your guild, "${guild.name}", has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave the server. \nIf you wish to speak to my developer, you may join here. `);
      guild.leave();
      return;
    }*/

  guild.settings.set("announcements", "on");
  const avatar = await Jimp.read(
    client.user.displayAvatarURL({ format: "png" })
  );

  const border = await Jimp.read(
      "https://cdn.glitch.com/2d046ec2-1e35-495d-991b-9cdf3415e38f%2Fborder.png?v=1560184031050"
    ),
    canvas = await Jimp.read(500, 150),
    mask = await Jimp.read(
      "https://cdn.glitch.com/2d046ec2-1e35-495d-991b-9cdf3415e38f%2Fmask.png?v=1560184129294"
    ),
    fontMedium = await Jimp.loadFont("/app/xiao/data/fonts/roboto-medium.fnt"),
    newGuildEmbed = new MessageEmbed(),
    channel = guild.systemChannel ? guild.systemChannel : null;

  avatar.resize(136, Jimp.AUTO);
  mask.resize(136, Jimp.AUTO);
  border.resize(136, Jimp.AUTO);
  avatar.mask(mask, 0, 0);
  avatar.composite(border, 0, 0);
  canvas.blit(avatar, 5, 5);
  canvas.print(
    fontMedium,
    155,
    55,
    `Currently powering up ${client.guilds.size} servers`.toUpperCase()
  );
  canvas.print(
    fontMedium,
    155,
    75,
    `serving ${client.users.size} Discord users`.toUpperCase()
  );

  const buffer = await canvas.getBufferAsync(Jimp.MIME_PNG),
    embedAttachment = new MessageAttachment(buffer, "added.png");

  newGuildEmbed
    .attachFiles([embedAttachment])
    .setColor("#80F31F")
    .setAuthor(client.user.username, client.user.avatarURL())

    .setTitle("Eva is here!")
    .setDescription(
      stripIndents`
      I'm an all-purpose bot and I hope I can make your server better!
      I've got many commands, you can see them all by using \`${client.commandPrefix}help\`
      Don't like the prefix? The admins can change my prefix by using \`${client.commandPrefix}prefix [new prefix]\`
      
      **All these commands can also be called by mentioning me instead of using a prefix, for example \`@${client.user.tag} help\`**
      `
    )
    .setImage("attachment://added.png");

  let found = 0;
  guild.channels.map(c => {
    if (found === 0) {
      if (c.type === "text") {
        if (c.permissionsFor(client.user).has("VIEW_CHANNEL") === true) {
          if (c.permissionsFor(client.user).has("SEND_MESSAGES") === true) {
            c.send({ embed: newGuildEmbed });
            found = 1;
          }
        }
      }
    }
  });

  const embed = new MessageEmbed()
    .setAuthor(client.user.username, client.user.avatarURL())
    .setTitle(`Hello, I'm ${client.user.username}!`)
    .setColor(0x00ff00).setDescription(stripIndents`
      I'm an all-purpose bot and I hope I can make your server better!
      I've got many commands, you can see them all by using \`${client.commandPrefix}help\`
      Don't like the prefix? The admins can change my prefix by using \`${client.commandPrefix}prefix [new prefix]\`
      
      **All these commands can also be called by mentioning me instead of using a prefix, for example \`@${client.user.tag} help\`**
      `);

  guild.channels.map(c => {
    if (found === 0) {
      if (c.type === "text") {
        if (c.permissionsFor(client.user).has("VIEW_CHANNEL") === true) {
          if (c.permissionsFor(client.user).has("SEND_MESSAGES") === true) {
            c.send({ embed });
            found = 1;
          }
        }
      }
    }
  });
};

const handleGuildLeave = (client, guild) => {
  /*  client.channels.resolve(process.env.ribbonlogchannel).send(`
Existing Guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Created At: ${guild.createdAt}
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
`);*/
  try {
    client.webhook.send("evaLog", {
      title: "Existing Guild left!  🚀",
      fields: [
        {
          name: "Guild: ",
          value: `${guild.id}`
        },
        {
          name: "Name: ",
          value: `${guild.name}`
        },
        {
          name: "Owner: ",
          value: `${guild.owner.user.tag} (${guild.owner.id})`
        },
        {
          name: "Created At: ",
          value: `${guild.createdAt}`
        },
        {
          name: "Members: ",
          value: `${guild.members.size}`
        },
        {
          name: "Bots: ",
          value: `${guild.members.filter(u => u.user.bot).size} (${Math.floor(
            (guild.members.filter(u => u.user.bot).size / guild.members.size) *
              100
          )}%)`
        },
        {
          name: "Humans: ",
          value: `${guild.members.filter(u => !u.user.bot).size} (${Math.floor(
            (guild.members.filter(u => !u.user.bot).size / guild.members.size) *
              100
          )}%)`
        }
      ],
      footer: {
        icon_url:
          "https://cdn0.iconfinder.com/data/icons/flat-security-icons/512/minus-blue.png",
        text: `Now on: ${client.guilds.size} servers`
      },
      timestamp: new Date()
    });
  } catch (e) {
    console.log(e);
  }
  console.log(`Existing guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Created At: ${guild.createdAt}
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(
    (guild.members.filter(u => u.user.bot).size / guild.members.size) * 100
  )}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(
    (guild.members.filter(u => !u.user.bot).size / guild.members.size) * 100
  )}%)
`);
  guildLeave(client, guild);
};

const handleMemberAdd = (client, joinMember) => {
  const joinmember = joinMember;

  try {
    if (joinmember.guild.settings.get("memberlogs", true)) {
      const memberJoinLogEmbed = new MessageEmbed(),
        memberLogs = joinmember.guild.settings.get(
          "memberlogchannel",
          joinmember.guild.channels.cache.find(c => c.name === "member-logs")
            ? joinmember.guild.channels.cache.find(
                c => c.name === "member-logs"
              ).id
            : null
        );

      /*const greetMessages = require('/app/xiao/assets/json/greetingMessages.json');
          let greetMessage = greetMessages.getRandom();
          
          greetMessage = JSON.stringify(greetMessage);
          greetMessage = greetMessage.replace(/\$user/ig, `<@${joinmember.id}>`);
          greetMessage = greetMessage.replace(/\$server/ig, joinmember.guild.name);
          greetMessage = greetMessage.replace(/\$username/ig, joinmember.displayName);
*/

      memberJoinLogEmbed
        .setAuthor(
          `${joinmember.user.tag} (${joinmember.id})`,
          joinmember.user.displayAvatarURL({ format: "png" })
        )
        .setFooter("User joined")
        .setTimestamp()
        .setColor("#80F31F");

      if (
        joinmember.guild.settings.get("defaultRole") &&
        joinmember.guild.roles.cache.get(
          joinmember.guild.settings.get("defaultRole")
        )
      ) {
        joinmember.roles.add(joinmember.guild.settings.get("defaultRole"));
        memberJoinLogEmbed.setDescription(
          `Automatically assigned the role ${
            joinmember.guild.roles.cache.get(
              joinmember.guild.settings.get("defaultRole")
            ).name
          } to this member`
        );
      }

      if (
        memberLogs &&
        joinmember.guild.channels.cache.get(memberLogs) &&
        joinmember.guild.channels.cache
          .get(memberLogs)
          .permissionsFor(client.user)
          .has("SEND_MESSAGES")
      ) {
        joinmember.guild.channels.cache
          .get(memberLogs)
          .send("", { embed: memberJoinLogEmbed });
      }
    }
  } catch (err) {
    console.log(err);
    client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
        <@${
          client.owners[0].id
        }> An error sending the member join memberlog message!
        **Server:** ${joinmember.guild.name} (${joinmember.guild.id})
        **Time:** ${moment().format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z")}
        **Error Message:** ${err}
        `);
  }

  try {
    if (
      joinmember.guild.settings.get("joinmsgs", false) &&
      joinmember.guild.settings.get("joinmsgchannel", null)
    ) {
      joinMessage(joinmember);
    }
  } catch (err) {
    client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
        <@${
          client.owners[0].id
        }> An error occurred sending the member join image!
        **Server:** ${joinmember.guild.name} (${joinmember.guild.id})
        **Time:** ${moment().format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z")}
        **Error Message:** ${err}
        `);
  }
};

const handleMemberLeave = (client, leaveMember) => {
  const leavemember = leaveMember;

  try {
    if (leavemember.guild.settings.get("memberlogs", true)) {
      const memberLeaveLogEmbed = new MessageEmbed(),
        memberLogs = leavemember.guild.settings.get(
          "memberlogchannel",
          leavemember.guild.channels.cache.find(c => c.name === "member-logs")
            ? leavemember.guild.channels.cache.find(
                c => c.name === "member-logs"
              ).id
            : null
        );

      memberLeaveLogEmbed
        .setAuthor(
          `${leavemember.user.tag} (${leavemember.id})`,
          leavemember.user.displayAvatarURL({ format: "png" })
        )
        .setFooter("User left")
        .setTimestamp()
        .setColor("#F4BF42");

      if (
        memberLogs &&
        leavemember.guild.channels.cache.get(memberLogs) &&
        leavemember.guild.channels.cache
          .get(memberLogs)
          .permissionsFor(client.user)
          .has("SEND_MESSAGES")
      ) {
        leavemember.guild.channels.cache
          .get(memberLogs)
          .send("", { embed: memberLeaveLogEmbed });
      }
    }
  } catch (err) {
    console.log(err);
    client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
        <@${
          client.owners[0].id
        }> An error occurred sending the member left memberlog message!
        **Server:** ${leavemember.guild.name} (${leavemember.guild.id})
        **Time:** ${moment().format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z")}
        **Error Message:** ${err}
        `);
  }

  try {
    const conn = new Database(
        path.join(__dirname, "data/databases/casino.sqlite3")
      ),
      query = conn
        .prepare(`SELECT * FROM "${leavemember.guild.id}" WHERE userID = ?`)
        .get(leavemember.id);

    if (query) {
      conn
        .prepare(`DELETE FROM "${leavemember.guild.id}" WHERE userID = ?`)
        .run(leavemember.id);
    }
  } catch (err) {
    null;
  }

  try {
    if (
      leavemember.guild.settings.get("leavemsgs", false) &&
      leavemember.guild.settings.get("leavemsgchannel", null)
    ) {
      leaveMessage(leavemember);
    }
  } catch (err) {
    client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
        <@${
          client.owners[0].id
        }> An error occurred sending the member leave image!
        **Server:** ${leavemember.guild.name} (${leavemember.guild.id})
        **Time:** ${moment().format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z")}
        **Error Message:** ${err}
        `);
  }
};

const handleMsg = async (client, msg, afkUsers) => {
  /*  const starboard = client.channels.cache.get(msg.guild.settings.get('starboard'));
  const embed = new MessageEmbed()
        .setColor(15844367)
        .setDescription(msg.cleanContent)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
        .setTimestamp(new Date())
        .setFooter(`⭐ 1 | ${msg.id}`)
      await starboard.send({ embed }).catch(e => console.log(e))*/
  if (msg.content.includes(process.env.TOKEN)) {
    if (msg.deletable) {
      msg.delete().catch(e => {
        console.error(e);
      });
    }

    let app = await msg.client.fetchApplication();
    let owner = await client.users.get(app.owner.id);

    owner
      .send({
        embed: {
          color: 0xe74c3c,
          title: "ATTENTION!",
          description:
            "My token has been been exposed! Please regenerate it **ASAP** to prevent my malicious use by others.",
          fields: [
            {
              name: "Responsible user",
              value: `${msg.author.tag} - ${msg.author.id}`
            }
          ]
        }
      })
      .catch(e => {
        console.error(e);
      });
    return true;
  }

  if (msg.author.bot) return;
  if (
    msg.guild &&
    msg.deletable &&
    msg.guild.settings.get("automod", false).enabled
  ) {
    if (
      msg.member.roles.some(ro =>
        msg.guild.settings.get("automod", []).filterroles.includes(ro.id)
      )
    ) {
    }
    if (msg.guild.settings.get("caps", false).enabled) {
      const opts = msg.guild.settings.get("caps");

      if (caps(msg, opts.threshold, opts.minlength, client)) msg.delete();
    }
    if (msg.guild.settings.get("duptext", false).enabled) {
      const opts = msg.guild.settings.get("duptext");

      if (duptext(msg, opts.within, opts.equals, opts.distance, client))
        msg.delete();
    }
    if (msg.guild.settings.get("emojis", false).enabled) {
      const opts = msg.guild.settings.get("emojis");

      if (emojis(msg, opts.threshold, opts.minlength, client)) msg.delete();
    }
    if (
      msg.guild.settings.get("badwords", false).enabled &&
      badwords(msg, msg.guild.settings.get("badwords").words, client)
    )
      msg.delete();
    if (msg.guild.settings.get("invites", false) && invites(msg, client))
      msg.delete();
    if (msg.guild.settings.get("links", false) && links(msg, client))
      msg.delete();
    if (
      msg.guild.settings.get("mentions", false).enabled &&
      mentions(msg, msg.guild.settings.get("mentions").threshold, client)
    )
      msg.delete();
    if (
      msg.guild.settings.get("slowmode", false).enabled &&
      slowmode(msg, msg.guild.settings.get("slowmode").within, client)
    )
      msg.delete();
  }

  try {
    // console.log(msg.guild.settings.get('leveling'))
    if (
      msg.guild.settings.get("leveling") &&
      msg.guild.settings.get("leveling") == "on"
    ) {
      try {
        await client.levels.giveGuildUserExp(msg.author, msg);
        //console.log('done')
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }

  if (afkUsers[msg.author.id]) {
    if (afkUsers[msg.author.id].afk === true) {
      msg.reply("Welcome back! I have removed your AFK status.");
      afkUsers[msg.author.id].afk = false;
    }
  }

  if (msg.mentions) {
    msg.mentions.users.map(user => {
      if (afkUsers[user.id]) {
        if (afkUsers[user.id].afk === true) {
          msg.reply(
            `${user.username} is AFK: ${JSON.stringify(
              afkUsers[user.id].status.msg
            )}`
          );
        }
      }
    });
  }
};

const handleReactionAdd = async (client, reaction, user) => {
  try {
    this.extension = function extension(reaction, attachment) {
      const imageLink = attachment.split(".");
      const typeOfImage = imageLink[imageLink.length - 1];
      const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
      if (!image) return "";
      return attachment;
    };

    let fullMessage;

    if (reaction.message.partial) {
      try {
        await reaction.message.fetch().then(fullMessage_recieved => {
          fullMessage =  fullMessage_recieved.message;
        });
      } catch (err) {
        console.log(err)
      }
    }

    fullMessage = reaction.message;

    if (fullMessage.guild.settings.get("starboardtoggle") === "on") {
      if (reaction.emoji.name !== "⭐") return;
      const starboard = client.channels.cache.get(
        fullMessage.guild.settings.get("starboard")
      );

      if (!starboard)
        return fullMessage.channel.send(
          `It appears that you do not have a \`starboard\` channel.`
        );
      if (user.id === fullMessage.author.id) return fullMessage.channel.send(`${fullMessage.author}, You can't star your own messages!`);
      if (fullMessage.author.bot)
        return fullMessage.channel.send(
          `${user}, you cannot star bot messages.`
        );

      const fetch = await starboard.messages
        .fetch({ limit: 10 })
        .catch(e => console.log(e));
      const stars = fetch.find(
        m =>
          m.embeds[0].footer.text.startsWith("⭐") &&
          m.embeds[0].footer.text.endsWith(fullMessage.id)
      );

      if (stars) {
        const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(
          stars.embeds[0].footer.text
        );
        const foundStar = stars.embeds[0];
        const image =
          fullMessage.attachments.size > 0
            ? await this.extension(
                reaction,
                fullMessage.attachments.array()[0].url
              )
            : "";
        const embed = new MessageEmbed();
        if (parseInt(star[1]) >= 5 && parseInt(star[1]) < 10) {
          embed.setFooter(`🌟 ${parseInt(star[1]) + 1} | ${fullMessage.id}`);
        } else if (parseInt(star[1]) >= 10 && parseInt(star[1]) < 20) {
          embed.setFooter(`💫 ${parseInt(star[1]) + 1} | ${fullMessage.id}`);
        } else if (parseInt(star[1]) >= 20) {
          embed.setFooter(`✨ ${parseInt(star[1]) + 1} | ${fullMessage.id}`);
        } else {
          embed
            .setColor(foundStar.color)
            .setDescription(foundStar.description)
            .setAuthor(
              fullMessage.author.tag,
              fullMessage.author.displayAvatarURL
            )
            .setTimestamp()
            .setFooter(`⭐ ${parseInt(star[1]) + 1} | ${fullMessage.id}`)
            .setImage(image);
        }
        const starfullMessage = await starboard.messages.fetch(stars.id);
        await starfullMessage.edit({ embed });
      }

      if (!stars) {
        const image =
          fullMessage.attachments.size > 0
            ? await this.extension(
                reaction,
                fullMessage.attachments.array()[0].url
              )
            : "";
        if (image === "" && fullMessage.cleanContent.length < 1)
          return fullMessage.channel.send(
            `${user}, you cannot star an empty message.`
          );
        const embed = new MessageEmbed()
          .setColor(15844367)
          .setDescription(fullMessage.cleanContent)
          .setAuthor(
            fullMessage.author.tag,
            fullMessage.author.displayAvatarURL
          )
          .setTimestamp(new Date())
          .setFooter(`⭐ 1 | ${fullMessage.id}`)
          .setImage(image);
        await starboard.send({ embed }).catch(e => console.log(e));
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const handleReactionRemove = async (client, reaction, user) => {
    this.extension = function extension(reaction, attachment) {
      const imageLink = attachment.split('.');
      const typeOfImage = imageLink[imageLink.length - 1];
      const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
      if (!image) return '';
      return attachment;
    };

    let fullMessage;

    if (reaction.partial) {
        reaction.fetch()
          .then(fullMessage_recieved => {
              fullMessage = fullMessage_recieved
          })
    }

    fullMessage = reaction.message;
  
    if (fullMessage.author.id === user.id) return fullMessage.channel.send(`${fullMessage.author}, You can't star your own message!`);
    if (reaction.emoji.name !== '⭐') return;
    const { starboardChannel } = client.channels.cache.get(fullMessage.guild.settings.get('starboard'));
    if (!starboardChannel) return fullMessage.channel.send(`It appears that you do not have a \`${starboardChannel}\` channel.`);
    const fetchedfullMessages = await starboardChannel.fullMessages.fetch({ limit: 10 });
    const stars = fetchedfullMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(reaction.fullMessage.id));
    if (stars) {
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      const foundStar = stars.embeds[0];
      const image = fullMessage.attachments.size > 0 ? await this.extension(reaction, fullMessage.attachments.array()[0].url) : '';
      const embed = new MessageEmbed()
        .setColor(foundStar.color)
        .setDescription(foundStar.description)
        .setAuthor(fullMessage.author.tag, fullMessage.author.displayAvatarURL)
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1]) - 1} | ${fullMessage.id}`)
        .setImage(image);
      const starMsg = await starboardChannel.fullMessages.fetch(stars.id);
      await starMsg.edit({ embed });
      if (parseInt(star[1]) - 1 == 0) return starMsg.delete(1000);
    }
  }

const handlePresenceUpdate = async (client, oldPresence, newPresence) => {
    if (newPresence.guild.settings.get('twitchnotifiers', false)) {
      if (newPresence.guild.settings.get('twitchmonitors', []).includes(newPresence.member.id)) {
        const curDisplayName = newPresence.member.displayName,
          curGuild = newPresence.guild,
          curUser = newPresence.member;
        let newActivity = newPresence.member.presence.activity,
          oldActivity = oldPresence.member.presence.activity;
  
        try {
          if (!oldActivity) {
            oldActivity = { url: 'placeholder' };
          }
          if (!newActivity) {
            newActivity = { url: 'placeholder' };
          }
          if (!(/(twitch)/i).test(oldActivity.url) && (/(twitch)/i).test(newActivity.url)) {
            const userFetch = await fetch(`https://api.twitch.tv/helix/users?${querystring.stringify({ login: newActivity.url.split('/')[3] })}`, { headers: { 'Client-ID': process.env.twitchclientid } }),
              userData = await userFetch.json(),
              streamFetch = await fetch(`https://api.twitch.tv/helix/streams?${querystring.stringify({ channel: userData.data[0].id })}`, { headers: { 'Client-ID': process.env.twitchclientid } }),
              streamData = await streamFetch.json(),
              twitchChannel = curGuild.settings.get('twitchchannel', null),
              twitchEmbed = new MessageEmbed();
  
            twitchEmbed
              .setThumbnail(curUser.displayAvatarURL())
              .setURL(newActivity.url)
              .setColor('#6441A4')
              .setTitle(`${curDisplayName} just went live!`)
              .setDescription(stripIndents`streaming \`${newActivity.details}\`!\n\n**Title:**\n${newActivity.name}`);
  
            if (userFetch.ok && userData.data.length > 0 && userData.data[0]) {
              twitchEmbed
                .setThumbnail(userData.data[0].profile_image_url)
                .setTitle(`${userData.data[0].display_name} just went live!`)
                .setDescription(stripIndents`${userData.data[0].display_name} just started ${twitchEmbed.description}`)
                .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${userData.data[0].login}-1920x1080.jpg`);
            }
  
            if (streamFetch.ok && streamData.data.length > 0 && streamData.data[0]) {
              const streamTime = moment(streamData.data[0].started_at).isValid() ? moment(streamData.data[0].started_at)._d : null;
  
              twitchEmbed.setFooter('Stream started');
              streamTime ? twitchEmbed.setTimestamp(streamTime) : null;
            }
            if (twitchChannel) {
              curGuild.channels.cache.get(twitchChannel).send('', { embed: twitchEmbed });
            }
          }
        } catch (err) {
          client.channels.resolve('496567589284085761').send(stripIndents`
                <@${client.owners[0].id}> Error occurred in sending a twitch live notifier!
                **Server:** ${curGuild.name} (${curGuild.id})
                **Member:** ${curUser.tag} (${curUser.id})
                **Time:** ${moment().format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
                **Old Activity:** ${oldActivity.url}
                **New Activity:** ${newActivity.url}
                **Error Message:** ${err}
                `);
        }
      }
    }
  }

const handleRatelimit = (client, info) => {
  console.log(stripIndents`
      Ran into a **rate limit**!
      **Time:** ${moment().format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z")}
      **Timeout**: ${info.timeout}
      **Limit**: ${info.limit}
      **HTTP Method**: ${info.method}
      **Path**: ${info.path}
      **Route**: ${info.route}
      `);

  client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
      Ran into a **rate limit**!
      **Time:** ${moment().format("MMMM Do YYYY [at] HH:mm:ss [UTC]Z")}
      **Timeout**: ${info.timeout}
      **Limit**: ${info.limit}
      **HTTP Method**: ${info.method}
      **Path**: ${info.path}
      **Route**: ${info.route}
      `);
};
module.exports = {
  handleReady,
  handleErr,
  handleWarn,
  handleDebug,
  handleUnknownCmd,
  handleCmdErr,
  handleCmdRun,
  handleGuildCreate,
  handleGuildLeave,
  handleMemberAdd,
  handleMemberLeave,
  handleMsg,
  handleReactionAdd,
  handleReactionRemove,
  handlePresenceUpdate,
  handleRatelimit
};
