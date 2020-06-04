const Command = require('../../structures/Command');
const request = require('request-promise-native');

module.exports = class AlphabetReverseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'robotify',
			aliases: ['botify'],
			group: 'text-edit',
			memberName: 'robotify',
			description: 'Generates a random robot image from the given string or your Discord tag if no string is specified.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to reverse the alphabet of?',
					type: 'string',
          default: (msg) => msg.author.tag
				}
			]
		});
	}

async run(message, {text}){
try {

    let options = {
      url: `https://robohash.org/${encodeURIComponent(text)}?set=set0`,
      encoding: null
    };
    let response = await request(options);

    message.channel.send({
      files: [ { attachment: response } ]
    }).catch(e => {
      console.error(e);
    });
  } catch (e) {
    if (e.response) {
       message.channel.send(`[ERROR] ${e.response.statusCode} ${e.response.statusMessage}`);
    }
    console.error(e);
  }
}
}