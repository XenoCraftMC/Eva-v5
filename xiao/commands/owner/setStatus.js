const Command = require('../../structures/Command');

module.exports = class DaysUntilCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setstatus',
			group: 'owner',
			memberName: 'setstatus',
			description: 'Sets the status of the bot.',
			args: [
				{
					key: 'status',
					prompt: 'What status do you want? (online/idle/dnd/invisible)',
					type: 'string'
				}
			],
			ownerOnly: true
		});
	}
async run (message, {status}) {
try {
    if (status && /^(?:online|idle|dnd|invisible)$/i.test(status)) {
      await this.client.user.setStatus(status);

      message.channel.send({
        embed: {
          color: 0x2ECC71,
          description: `${this.client.user.username}'s status is now set to **${status}**`
        }
      }).catch(e => {
        console.error(e);
      });
    }
    else {
      await this.client.user.setStatus('online');

      message.channel.send({
        embed: {
          color: 0x2ECC71,
          description: `${this.client.user.username}'s status is now set to the default status **${this.client.user.presence.status}**`
        }
	  })
	}
} catch (err) { console.log(err) }
}
}