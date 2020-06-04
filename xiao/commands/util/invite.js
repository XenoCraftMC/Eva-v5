/**
 * @file Info InviteCommand - Gets the invite link for the bot  
 * **Aliases**: `inv`, `links`, `shill`
 * @module
 * @category info
 * @name invite
 * @returns {MessageEmbed} Invite link along with other links
 */

const {MessageEmbed} = require('discord.js'), 
  {Command} = require('discord.js-commando'), 
  {stripIndents} = require('common-tags'), 
  {deleteCommandMessages, stopTyping, startTyping} = require('../../components/util.js');

module.exports = class InviteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      memberName: 'invite',
      group: 'util',
      aliases: ['inv', 'links', 'shill'],
      description: 'Gives you invitation links',
      examples: ['invite'],
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run (msg) {
    startTyping(msg);
    const inviteEmbed = new MessageEmbed();

    inviteEmbed
      .setTitle('Eva by Kace')
      .setThumbnail('http://i68.tinypic.com/qycvwx.jpg')
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setDescription(stripIndents`Enrich your Discord server with a fully modular Discord bot with many many commands\n
        [Add me to your server](https://discordapp.com/oauth2/authorize?client_id=478504038732791838&scope=bot&permissions=2146958847)
        [Join the Support Server](https://discord.gg/uYdTq9p)
        `);
// [GitHub](https://github.com/Favna/Ribbon)
// [Wiki](https://github.com/Favna/Ribbon/wiki)
// [Website](https://favna.xyz/ribbon)

    
    deleteCommandMessages(msg, this.client);
    stopTyping(msg);

    return msg.embed(inviteEmbed, 'Find information on Eva here: https://github.com/XenoCraftMC/Eva/wiki',);
  }
};