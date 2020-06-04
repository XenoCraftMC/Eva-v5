const {Command} = require('discord.js-commando')
const discord = require('discord.js')
 
module.exports = class mentionroleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'mentionrole',
      memberName: 'mentionrole',
      group: 'moderation',
      description: 'Mentions any unmentionable role.',
      format: '[Role Name] [hex-color-code]',
      examples: ['createrole oof #dc143'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'role',
          prompt: 'What is the name of the role?',
          type: 'string'
        }
      ],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_GUILD']
    });
  }  
  
  async run (message, {role}) {
    try {
    let xrole;
    
    if (message.mentions.roles.size) {
      xrole = message.mentions.roles.first();
    }
    else if (message.guild.roles.has(role)) {
      xrole = message.guild.roles.cache.get(role);
    }
    else {
      xrole = message.guild.roles.cache.find(role => role.name === role);
    }
    
     if (role.editable) {
      await role.setMentionable(true, 'Role needs to be mentioned.');
      await message.channel.send(`<@&${role.id}>`);
      await role.setMentionable(false, 'Role doesn\'t needs to be mentioned anymore.');
    }
  } catch (e) {
    console.error(e);
  }
    
  }
}