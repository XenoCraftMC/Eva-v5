 const {Command} = require('discord.js-commando')
 
module.exports = class categoryCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'createcategory',
      memberName: 'createcategory',
      aliases: ['cc'],
      group: 'moderation',
      description: 'Creates a new channel category on your Discord server.',
      format: '<Category Name>',
      examples: ['createCategory News Feed'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'name',
          prompt: 'What should be the name of the category?',
          type: 'string'
        }
      ],
      clientPermissions: ['MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS']
    });
  }  
  
async run(message, {name}) {
let minLength = 2, maxLength = 100;
    if (name.length < minLength || name.length > maxLength) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return message.channel.send('error' + ' ' + this.client.i18n.error(message.guild.language, 'channelNameLength', minLength, maxLength));
    }

    let category = await message.guild.channels.create(name, {
      type: 'category'
    });

    await message.channel.send({
      embed: {
        color: this.client.colors.GREEN,
        description: this.client.i18n.info(message.guild.language, 'createChannel', message.author.tag, 'category', category.name),
        footer: {
          text: `ID: ${category.id}`
        }
      }
    });
  }
  catch (e) {
    console.error(e);
  }
};
