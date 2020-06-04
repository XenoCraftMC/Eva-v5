/*const Command = require('../../structures/Command');
const sides = ['heads', 'tails'];

module.exports = class CoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coin',
			aliases: ['cf'],
			group: 'random',
			memberName: 'coin',
			description: 'Flips a coin.'
		});
	}

	run(msg) {
		return msg.say(`It landed on ${sides[Math.floor(Math.random() * sides.length)]}!`);
	}
};
*/