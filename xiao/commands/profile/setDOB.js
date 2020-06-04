const { Command } = require('discord.js-commando');

const UserProfile = require('../../models/UserProfile');

module.exports = class PersonalMessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'setdateofbirth',
			aliases: ['set-birthdate', 'set-birthdayy', 'dob', 'set-dob'],
			group: 'profile',
			memberName: 'set-dob',
			description: 'Set your birth date for your profile.',
			details: 'Set your birth date for your profile.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			},

			args: [
				{
					key: 'dob',
					prompt: 'what would you like to set as your birthdate?\n',
					type: 'string',
					validate: value => {
						if (value.length > 130) {
							return `
								your message was ${value.length} characters long.
								Please limit your personal message to 130 characters.
							`;
						}
						return true;
					}
				}
			]
		});
	}

  
	async run(msg, { dob }) {
    
    const profile = await UserProfile.findOne({ where: { userID: msg.author.id } });
		if (!profile) {
			await UserProfile.create({
				userID: msg.author.id,
				dob
			});

			return msg.reply('your dob has been updated!');
		}

		profile.dob = dob;
		await profile.save();

		return msg.reply('your dob has been updated!');
	}
};
