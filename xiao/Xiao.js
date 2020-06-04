/* global require */
/* global console */
/* global __dirname */
/* global process */
/* global setInterval */
/* global setTimeout */

//How to use emojis:
//<:wrong:513607891609976832>
//<:right:513607953962500097>
// do \emoji (\:wrong:) to get emoji ID
// <:name:id>
  
// Bot Invite: https://discordapp.com/oauth2/authorize?client_id=478504038732791838&scope=bot&permissions=2146958847
require('dotenv').config({path: '../.env'})

const Database = require('better-sqlite3'),
		moment = require('moment'),
    querystring = require('querystring'),
		path = require('path'),
		sqlite = require('sqlite'),
    sql = require('sqlite'),
		activities = require('./assets/json/activity'),
		decache = require('decache'),
		fs = require('fs'),
		ms = require('ms')//,
    //DiscordRSS = require('discord.rss')


const { CommandoClient,  SQLiteProvider  } = require('discord.js-commando'),
      {  MessageEmbed , MessageAttachment } = require('discord.js'),
      {  oneLine, stripIndents } = require('common-tags'),
      {  badwords, duptext, caps, emojis, mentions, links, invites, slowmode } = require(path.join(__dirname, 'components/automod.js')),
	    {  checkReminders, countdownMessages, fetchEshop, forceStopTyping, guildAdd, guildLeave, joinMessage, leaveMessage,lotto, timerMessages, voteRewards } = require(path.join(__dirname, 'components/events.js'));

const { handleReady, handleDebug, handleErr, handleWarn, handleUnknownCmd, handleCmdErr, handleCmdRun, handleGuildCreate, handleGuildLeave, handleMemberAdd, handleMemberLeave, handleMsg, handleReactionAdd, handleReactionRemove, handlePresenceUpdate, handleRatelimit} = require('./components/clientevents')
//const express = require('express');
//const http = require('http');
require('/app/xiao/prototypes/String.prototype');
require('/app/xiao/prototypes/Number.prototype');
const cooldownUsers = [];
const waitingUsers = [];
const afkUsers = require('./bin/afk.json');

const PonyCommandoClient = require('./lib/PonyCommandoClient');
const PonyUtils = require('./lib/PonyUtils');
/*var server = require('http').createServer();

console.log('Requires and vars initialized.');

server.listen(3000, () => {
    console.log('Server Initialized!');
});*/
/*

const express = require('express');
var morgan = require('morgan')
// creates a new express app
const app = express();
const server = require('http').createServer(app)
// does the dirty work for us and parses the request body
const bodyParser = require("body-parser");

// the super secret authorization token so nobody can cheat the system
const token = process.env.authToken;

// just sets the bodyParser stuff, nothing to worry about
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function xinspect(o,i){
      if(typeof i=='undefined')i='';
      if(i.length>50)return '[MAX ITERATIONS]';
      var r=[];
      for(var p in o){
          var t=typeof o[p];
          r.push(i+'"'+p+'" ('+t+') => '+(t=='object' ? 'object:'+xinspect(o[p],i+'  ') : o[p]+''));
      }
    return r.join(i+'\n');
    }

// these are just examples of the content you may receive!
const EXAMPLE_MESSAGE = {
    bot: '00021412412414',
    user: '00021412412414',
    type: 'test',
    query: '?test=data&notRandomNumber=8',
    isWeekend: false
};
const EXAMPLE_HEADER = {
    'user-agent': 'DBL',
    authorization: 'some lit auth token here',
    host: 'this.should.be.your.IP:andPORT',
    accept: 'application/json',
    'content-type': 'application/json',
    'content-length': '???',
    connection: 'close'
};

app.get('/',function(req,response){
 // response.sendFile(__dirname + '/views/maze.html')
  /*console.log("[SERVER] " + "[BASE '/']" + "received from "+req.get("X-Forwarded-For")+" : "+req.method + " "+req.originalUrl+" (Authorization: "+req.get("Authorization")+")");
  console.log(req.get("X-Forwarded-For"))
  console.log(req.method)
  console.log(req.originalUrl)*//*
});

app.get('/webhook/url',function(req,response){
  console.log("[SERVER] " +"[WEBHOOKurl]" + "received from "+req.get("X-Forwarded-For")+" : "+req.method+" "+req.originalUrl+" (Authorization: "+req.get("Authorization")+")");
});

app.post('/webhook/botspace', async (req, res) => {
  const message = req.body;
  const headers = req.headers;
  
  res.status(200).send(); 
  console.log("[SERVER] [200] " +"[WEBHOOKbotspace] " + "received from "+req.get("X-Forwarded-For")+" : "+req.method+" "+req.originalUrl+" (Authorization: "+req.get("Authorization")+")");
})

// catches a post request with the specified URL
app.post('/webhook/url', async (req, res) => {
    // put the request body in a variable for use after we respond
    const message = req.body;
    const headers = req.headers;

    // check if the headers exist (good practice) and check if the authorization in the headers match the token we have saved as "token"
    if (headers && headers.authorization === token) {
      if (message.type == "test") {
        console.log("Test successful!")
      }
      
      if (message.type == "upvote") {
        console.log(`[WEBHOOK] User with ID ${message.user} just voted!`);  
        await voteRewards(message, client)
      }
        // tells the sender that the webhook sent successfully
        res.status(200).send(); 
        console.log("[SERVER] [200] " +"[WEBHOOKurl] " + "received from "+req.get("X-Forwarded-For")+" : "+req.method+" "+req.originalUrl+" (Authorization: "+req.get("Authorization")+")");

        // do whatever you want with "message" here

    } else {
        // tells the sender they are forbidden because their authorization token is incorrect!
        res.status(403).send();
            console.log('403')

        // do nothing
    }
});

// this starts the express app and begins listening to the port we asked it to
app.listen(8080, () => {
    console.log("[SERVER] Webhook server is listening on port: " + 8080);
});
*/

/*const http = require('http');
const keepAlive = express();

keepAlive.listen(8080, () => {
    console.log("[PINGSERVER] PING server is listening on port: " + 8080);
});

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`, function() {
  console.log('Pinged') 
  })
}, 280000);
*/

// Client Defination
const client = new PonyCommandoClient({
	commandPrefix: "x",
	owner: "374934156620201988",
	invite: "https://discord.gg/uYdTq9p",
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: [ 'TYPING_START' ],
  partials: ['MESSAGE', 'REACTION', 'CHANNEL']
});

console.log('[XIAO] CommandoClient Defined!');

// https://discordbots.org/
const DBL = require('dblapi.js')
//const dbots = new DBL(process.env.DBL, {webhookServer: server }, client);

// Command Registery
client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		[ 'analyze', 'Analyzers' ],
		[ 'automod', 'Auto-Moderation' ],
		[ 'avatar-edit', 'Avatar Manipulation' ],
		[ 'casino', 'Gain and gamble points' ],
		[ 'custom', 'Server specific commands' ],
		[ 'commands', 'Default Commands Group' ],
    [ 'levels', 'Leveling'],
		[ 'events', 'Events' ],
		[ 'extra', 'Extras!' ],
		[ 'games', 'Games' ],
		[ 'image-edit', 'Image Manipulation' ],
		[ 'info', 'Discord Information' ],
    [ 'item', 'Item'],
		[ 'leaderboards', 'Leaderboards' ],
		[ 'moderation', 'Moderation' ],
		[ 'nsfw', 'NSFW' ],
		[ 'number-edit', 'Number Manipulation' ],
		[ 'other', 'Other' ],
		[ 'owner', 'Owner Only' ],
		[ 'pokemon', 'Pokemon!' ],
    [ 'profile', 'profiles'],
		[ 'random', 'Random Response' ],
		[ 'roleplay', 'Roleplay' ],
		[ 'search', 'Search' ],
		[ 'single', 'Single Response' ],
		[ 'streamwatch', 'Spy on members and get notified when they go live'],
		[ 'text-edit', 'Text Manipulation' ],
		[ 'util', 'Utility' ],
		[ 'voice', 'Voice Channel' ]
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: true,
		commandState: true
	})
	.registerCommandsIn(path.join(__dirname, 'commands'))


client.config = {}
client.config.dashboard = 
  { enabled: 'true', // This setting controls whether the dashboard is enabled or not.
		secure: 'true', // HTTPS: 'true' for true, 'false' for false
		sessionSecret: process.env.SESSIONSECRET, // Go crazy on the keyboard here, this is used as a session secret
		domain: 'pyrite-knotty-minibus.glitch.me/', // Domain name (with port if not running behind proxy running on port 80). Example: 'domain': 'dashboard.bot-website.com' OR 'domain': 'localhost:33445'
		port: '8080', // The port that it should run on
		invitePerm: '2146958847',
		protectStats: 'false',
		borderedStats: 'false', // Controls whether stats in the dashboard should have a border or not
		legalTemplates: {
			contactEmail: 'admin@ndt3.ml', // This email will be used in the legal page of the dashboard if someone needs to contact you for any reason regarding this page
			lastEdited: '18 November 2017' // Change this if you update the `TERMS.md` or `PRIVACY.md` files in `dashboard/public/`
		}}

require('/app/xiao/components/dashbord.js')(client);

//Hourly Restart
setTimeout(function(){
  try {
  client.webhook.send('evaLog', {
        title: 'I\'m Restarting!  🚀',
        description: `${client.user.tag} (${client.user.id}) is restarting with ${client.guilds.size} servers.`,
         footer: {
          icon_url: 'https://resources.bastionbot.org/logos/Bastion_Logomark_C.png',
          text: `Eva v${client.package.version}`
        },
        timestamp: new Date()
      });
  } catch (e) { console.log(e) }

console.log("Restarting...")
process.exit(0);
}, 10800000);

//Health Check
setTimeout(function(){
try {
 client.webhook.send('evaLog', {
        title: 'Health Check',
        description: `${client.user.tag} (${client.user.id}) is healthy with ${client.guilds.size} servers.`,
         footer: {
          icon_url: 'https://resources.bastionbot.org/logos/Bastion_Logomark_C.png',
          text: `Eva v${client.package.version}`
        },
        timestamp: new Date()
      });
     } catch (err) { handleErr(client, err) }
}, 5400000 ); 

// Database
sqlite.open(path.join(__dirname, "settings.sqlite")).then((db) => {
    client.setProvider(new SQLiteProvider(db));
});
// Inhibitors
client.dispatcher.addInhibitor(msg => {
  if (msg.guild === null) return;
  const blacklist = require('./bin/blacklist.json');
  if (blacklist.guilds.includes(msg.guild.id)) return [ `Guild ${msg.guild.id} is blacklisted`, msg.channel.send('This guild has been blacklisted. Appeal here: https://discord.gg/6P6MNAU') ];
});
client.dispatcher.addInhibitor(msg => {
  const blacklist = require('./bin/blacklist.json');
  if (blacklist.users.includes(msg.author.id)) return [ `User ${msg.author.id} is blacklisted`, msg.reply('You have been blacklisted. Appeal here: https://discord.gg/6P6MNAU') ];
});

setInterval(() => {
function log() {
    console.log('Wrote afk users to file.');
  const a = 10
  }
  fs.writeFile('./bin/afk.json', JSON.stringify(afkUsers, null, 2), { encoding: 'utf8' }, log);
}, ms('30s'));
console.log('[XIAO] Commando set up.');
console.log('[XIAO] Awaiting log in.');

client.on('ready', (msg) => { handleReady(client, /*dbots,*/ msg) })
client.on('error', err => handleErr(client, err)); // Error Event
client.on('warn', err => handleWarn(client, err)); // Warn Event
client.on('debug', info => handleDebug(info)); // Debug Event
client.on('shardDisconnect', (event, shardID) => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code} on ${shardID}.`);
	process.exit(0);
});

client.on('shardReconnecting', id => console.warn(`Reconnecting on Shard ID ${id}`));  // Reconnect Event
client.on('onUnknownCommand', msg => { handleUnknownCmd(client, msg) });
client.on('commandError', (command, err, message) => { handleCmdErr(client, command, err, message) });
client.on('commandBlocked', (msg, reason) => {
    console.log(oneLine `
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
  })
client.on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine `
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
client.on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine `
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
client.on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine `
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
client.on('commandRun', (command, promise, msg) => { handleCmdRun(command, promise, msg) });
client.on('guildCreate', async guild => { handleGuildCreate(client, guild) })
client.on('guildDelete', guild => { handleGuildLeave(client, guild) });
client.on('guildMemberAdd', (member) => { handleMemberAdd(client, member) });
client.on('guildMemberRemove',  (member) => {handleMemberLeave(client, member) });            
client.on('message', async (msg) => {
  handleMsg(client, msg , afkUsers) 
});
client.on('messageReactionAdd', async (reaction, user) => { handleReactionAdd(client, reaction, user) });
client.on('messageReactionRemove', async (reaction, user) => { handleReactionRemove(client, reaction, user) });
client.on('rateLimit', info => handleRatelimit(client, info))
client.on('PresenceUpdate', async (client, oldMember, newMember) => { handlePresenceUpdate(oldMember, newMember) });

client.login(process.env.TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});