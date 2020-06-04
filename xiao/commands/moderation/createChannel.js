const {Command} = require('discord.js-commando')
 
module.exports = class channelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'createchannel',
      memberName: 'createchannel',
      aliases: ['catchannel'],
      group: 'moderation',
      description: 'Creates a new text or voice channel on your Discord server.',
      format: '[text | voice] <Channel Name>',
      examples: ['createchannel text Info', 'createchannel Voice Moosik'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'type',
          prompt: 'What should be the type of the channel?',
          type: 'string'
        },
        {
          key: 'name',
          prompt: 'What should be the name of the channel?',
          type: 'string'
        }
      ],
      clientPermissions: ['MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS']
    });
  }  
  
async run(message, {name, type}) {
let minLength = 2, maxLength = 100;
    if (name.length < minLength || name.length > maxLength) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return message.channel.send('Error' + ' ' + this.client.i18n.error(message.guild.language, 'channelNameLength', minLength, maxLength));
    }
       let channelType;
  
    if ((type == 'voice') && (type != 'text')) {
      channelType = 'voice';
    }
    else {
      channelType = 'text';
      name = name.replace(' ', '-');
    }

    let channel = await message.guild.channels.create(name, {
      type: channelType
    });


    await message.channel.send({
      embed: {
        color: this.client.colors.GREEN,
        description: this.client.i18n.info(message.guild.language, 'createChannel', message.author.tag, channelType, channel.name),
        footer: {
          text: `ID: ${channel.id}`
        }
      }
    });
  }
  catch (e) {
    console.error(e);
  }
};
