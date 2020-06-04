const Command = require('../../structures/Command');

module.exports = class RollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roll',
			aliases: ['diceroll'],
			group: 'random',
			memberName: 'roll',
			description: 'Rolls a dice with a maximum value of your choice.',
			args: [
				{
					key: 'value',
					label: 'maximum number',
					prompt: 'What is the maximum number you wish to appear?',
					type: 'integer',
					default: 6
				}
			]
		});
	}

	run(msg, { value }) {
		return msg.say(`🎲 You rolled a ${Math.floor(Math.random() * value) + 1}. 🎲`);
	}
};
