

const 
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {stripIndents} = require('common-tags');


module.exports = class ShowdownCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'serverping',
      memberName: 'serverping',
      group: 'other',
      description: 'Gives statistics of a MineCraft server.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'ip',
          prompt: 'What is the IP of the server? (in quotes ```"123.123.123"```)',
          type: 'string'
        },
         {
          key: 'port',
          prompt: 'What is the port of the server?',
          type: 'integer'
        }
      ]
    });
  }
  
  async run (msg, {ip, port}) {
    var ms = require('/app/xiao/components/minestats.js');
ms.init(ip, port, function(result, err)
{
  const message = `Minecraft server status of ${ms.address} on port ${ms.port} :`
  msg.say("`" + message + "`")
  if(ms.online)
  {
    const stats = `Server is online running version ${ms.version} with ${ms.current_players} out of ${ms.max_players} players.`;
    const motd = `Message of the day: ${ms.motd}`;
    msg.say("```" + "\n" + stats + "\n" + motd + "```")
    
  }
  else
  {
    const offline = "Server is offline!";
    msg.say("```" + "\n" + offline + "```")
  }
  if (err) {
    if(err.code == "ENOTFOUND")
      {
        msg.say(`Unable to resolve address + ${ip}.`)
      }
      if(err.code == "ECONNREFUSED")
      {
        msg.say(`Unable to connect to port ${port}.`)
      }
  }
});
}
}
