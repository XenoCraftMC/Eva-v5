const Command = require('../../structures/Command');

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fidgetspinner',
			aliases: ['fspinner', 'fspin', 'fs'],
			group: 'other',
			memberName: 'fidgetspinner',
			description: 'Use a fidget spinner.'
		});
	}

async run (message) {

try {
    let spinning = await message.channel.send({
      embed: {
        color: 0x3498DB,
        description: `${message.author.tag} is spinning a fidget spinner...`,
        image: {
          url: 'https://i.imgur.com/KJJxVi4.gif'
        }
      }
    });

    let timeout = (Math.random() * (60 - 5 + 1)) + 5;
    setTimeout(() => {
      spinning.edit({
        embed: {
          color: 0x3498DB,
          description: `${message.author.tag}, you spinned the fidget spinner for ${timeout.toFixed(2)} seconds.`
        }
      }).catch(e => {
        console.error(e);
      });
    }, timeout * 1000);
  }
  catch (e) {
    console.error(e);
  }
}
}