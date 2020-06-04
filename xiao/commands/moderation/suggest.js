const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags');

module.exports = class SuggestCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'suggest',
			aliases: [],
			group: 'moderation',
			memberName: 'suggest',
			description: 'Suggest your suggestions to the server.',
      args: [
          {
          key: 'suggestionK',
          prompt: 'What is the suggestion?',
          type: 'string'
        }
          ]
		});
	}
  
  async run(msg, {suggestionK}) {
    try {
      let suggestionState = msg.guild.settings.get('suggestions')
      let suggestionChannel = msg.guild.settings.get('suggestionChannel')
      
      const offEmbed = new MessageEmbed()
      const right = this.client.emojis.get("513607953962500097");
      const wrong = this.client.emojis.get("513607891609976832");

        
    offEmbed
      .setColor('#FF1900')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(`${wrong} The suggestions feature is disabled on this server.`)
      .setTimestamp();
      
      console.log(suggestionState, suggestionChannel)
      if (suggestionState == undefined) { 
              return msg.say(offEmbed)
      }

      if (suggestionState == false) {
              return msg.say(offEmbed)
      }

      
    if (!suggestionChannel) {
        return msg.say(offEmbed)
      }
      if ((suggestionState == true) && suggestionChannel) {
      const suggestionsChannel = msg.guild.channels.cache.filter(channel => channel.type === 'text').get(suggestionChannel);
      }
    
       let suggestion = await this.client.channels.cache.get(suggestionChannel).send({embed:{
        title: 'Suggestion',
        description: `${suggestionK}`,
        image: {
          url: (msg.attachments.size && msg.attachments.first().height && msg.attachments.first().url) || null
        },
        footer: {
          text: `Suggested by ${msg.author.tag}`,
          icon_url: msg.author.displayAvatarURL() 
        },
         "thumbnail": {
      "url": "https://media.istockphoto.com/illustrations/grunge-red-suggestion-with-star-icon-round-rubber-seal-stamp-illustration-id870167248"
    }
      }
     }).then(msg => {
        msg.react(right)
            .then(r => msg.react(wrong))
     });
      
      await msg.channel.send({
        embed: {
        title: 'Success',
        description: `${right} Your suggestion has been sent succesfully to <#${suggestionChannel}>.`,
        image: {
          url: (msg.attachments.size && msg.attachments.first().height && msg.attachments.first().url) || null
        }
      }     
    }
)

    // Delete user's message
    if (msg.deletable) {
      msg.delete().catch(() => {});
    }

    // Add reactions for voting
    // await suggestion.react('513607891609976832');
    // await suggestion.react('513607953962500097');
    } catch (e) { console.log(e) }
  }
  }
  
