const Command = require('../../structures/Command');

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fakeban',
			aliases: ['fban'],
			group: 'other',
			memberName: 'fakeban',
			description: 'Ban an user.',
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to ban?',
					type: 'member'
				}
			]
		});
	}

run (message, {user}) {
message.channel.send({
      embed: {
        color: 0xE74C3C,
        description: `**${message.author.tag}** has banned **${user.displayName}** from this server.*`,
        footer: {
          text: '* Oh, just kidding! XD'
        }
      }
    }).catch(e => { console.error(e) })
}
}