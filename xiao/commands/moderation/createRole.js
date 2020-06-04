const {Command} = require('discord.js-commando')
const discord = require('discord.js')
 
module.exports = class channelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'createrole',
      memberName: 'createrole',
      aliases: ['catrole'],
      group: 'moderation',
      description: 'Creates a new role on your Discord server.',
      format: '[Role Name] [hex-color-code]',
      examples: ['createrole oof #dc143'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'name',
          prompt: 'What should be the name of the role?',
          type: 'string'
        },
        {
          key: 'color',
          prompt: 'What should be the color of the role?',
          type: 'string'
        }
      ],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES']
    });
  }  
  
async run(message, {color, name}) {
  try {
    if (!discord.Util.resolveColor(color)) {
      color = 0;
    }
    
let maxLength = 100;
    if (name && name.concat(' ').length > maxLength) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return message.channel('Error' + ' ' + this.client.i18n.error(message.guild.language, 'roleNameLength', maxLength));
    }


 // let data = roleData(name.concat(' '), color);
    let role = await message.guild.roles.create({
      data: {
        name: name.concat(' '),
        color: color
      }
    });

    await message.channel.send({
      embed: {
        color: this.client.colors.GREEN,
        description: this.client.i18n.info(message.guild.language, 'createRole', message.author.tag, role.name),
        footer: {
          text: `ID: ${role.id}`
        }
      }
    });
  }
  catch (e) {
    console.error(e);
  }
}
}

function roleData(name = 'new role', color = '#000000') {
  let data = {
    name: name,
    color: color
  };
  return data;
}