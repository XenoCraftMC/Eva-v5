const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class KillmeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'killme',
			group: 'roleplay',
			memberName: 'killme',
			description: 'Kill yourself with this command. Now comes with free revival!',
		});
  }
    run (msg) {
      msg.say(`${msg.author.username} has died.`).then(Message => {
        setTimeout(() => { Message.edit("Respawning..."); }, 1000);
        setTimeout(() => { Message.edit(`Revival complete. Welcome back, ${msg.author.username}`); }, 3000);
    });
    }
}
