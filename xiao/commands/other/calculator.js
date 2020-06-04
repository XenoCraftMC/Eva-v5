const Command = require('../../structures/Command');

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'calculate',
			aliases: ['calc'],
			group: 'other',
			memberName: 'calculate',
			description: 'Evaluates any mathematical expression.',
      args: [
				{
					key: 'expression',
					prompt: 'What do you want to evaluate?',
					type: 'string'
				}
			]
		});
	}

run (message, {expression}){
message.channel.send({
      embed: {
        color: 0x3498DB,
        title: 'Result:',
        description: require('mathjs').eval(expression).toFixed(2)
      }
    });
 }
}