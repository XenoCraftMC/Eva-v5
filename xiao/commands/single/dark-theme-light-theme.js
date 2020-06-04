const Command = require('../../structures/Command');

module.exports = class DarkThemeLightThemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dark-theme-light-theme',
			aliases: ['light-theme-dark-theme', 'dark-theme', 'light-theme'],
			group: 'single',
			memberName: 'dark-theme-light-theme',
			description: 'Determines whether you use dark or light theme.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: ['https://media.discordapp.net/attachments/469178760348827659/534273864113586176/default.png?width=360&height=225'] });
	}
};
