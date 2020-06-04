const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = class SpoopyLinkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spoopy-link',
			group: 'analyze',
			memberName: 'spoopy-link',
			description: 'Determines if a link is spoopy or not.',
			args: [
				{
					key: 'site',
					prompt: 'What site do you think is spoopy?',
					type: 'string',
					parse: site => encodeURIComponent(site)
				}
			]
		});
	}

	async run(msg, { site }) {
		try {
			const { body } = await request.get(`https://spoopy.link/api/${site}`);
			return msg.say(stripIndents`
				${body.safe ? 'Safe!' : 'Not safe...'}
				${body.chain.map(url => `<${url.url}> ${url.safe ? '✅' : `❌ (${url.reasons.join(', ')})`}`).join('\n')}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
