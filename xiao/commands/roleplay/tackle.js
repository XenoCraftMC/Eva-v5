const Command = require('../../structures/Command');
const { randomFromImgurAlbum } = require('../../util/Util');

module.exports = class TackleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tackle',
			aliases: ['glomp', 'tackle-hug'],
			group: 'roleplay',
			memberName: 'tackle',
			description: 'Tackles a user.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { user }) {
		try {
      const myarray = ['NnEiDRs', '1qRpoQl', 'FDon1RA', '6V9cOcI', 'i5Paqtr']
      const album = myarray[Math.floor(Math.random() * myarray.length)]
			const gif = await randomFromImgurAlbum(album);
			return msg.say(`_**${msg.author.username}** tackles **${user.username}**._`, { files: [gif] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
