const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class crashCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'crash',
      group: 'owner',
      memberName: 'crash',
      description: '👀 Do it. I dare you to.',
    });
  }
  run (message) {
    message.channel.send(`Wow. That's awful of you, ${message.author.username}. I'm just here trying to be helpful and make friends but you want to shut me down. Quite rude!`);
  }
}