/**
 * @file Owner CheckGuildsCommand - Lists all guilds Ribbon is in  
 * @module
 * @category owner
 * @name checkguilds 
 * @returns {Message} Amount and list of guilds in code blocks
 */

const {Command} = require('discord.js-commando'),
  {stripIndents} = require('common-tags');

module.exports = class CheckGuildsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'checkguilds',
      memberName: 'checkguilds',
      group: 'owner',
      description: 'Check the current guild count and their names',
      guildOnly: false,
      ownerOnly: true
    });
  }

  run (message) {
    message.say(stripIndents`\`\`\`The current guild count: ${this.client.guilds.cache.size}
     Guild list:
        ${this.client.guilds.cache.map(m => m.name).join('\n')}\`\`\``, {split: true});
    
  
      const guildName = this.client.guilds.cache.map(m => m.name)
      this.client.guilds.cache.map(guild => message.channel.send(stripIndents`\`\`\`
      Guild: ${guild.id}
      Guild Name: ${guild.name}
      Owner: ${guild.owner.user.tag} (${guild.owner.id})
      Members: ${guild.members.cache.size}
      Humans: ${guild.members.cache.filter(u => !u.user.bot).size} (${Math.floor(guild.members.cache.filter(u => !u.user.bot).size / guild.members.cache.size * 100)}%)
      Bots: ${guild.members.cache.filter(u => u.user.bot).size} (${Math.floor(guild.members.cache.filter(u => u.user.bot).size / guild.members.cache.size * 100)}%)
\`\`\``))
    }}