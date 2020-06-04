const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { version } = require('../../../package');
const { duration } = require('../../util/Util');
const moment = require('moment'),
  process = require('process'),
  speedTest = require('speedtest-net'),
  {oneLine} = require('common-tags'),
  {deleteCommandMessages, roundNumber, stopTyping, startTyping} = require('../../components/util.js');

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['information', 'stats'],
			group: 'util',
			memberName: 'info',
			description: 'Responds with detailed bot information.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}
	
	fetchPlatform (plat) {
    switch (plat) {
    case 'win32':
      return 'Windows';
    case 'darwin':
      return 'MacOS';
    default:
      return 'Linux';
    }};

	async run (msg) {
    const speed = speedTest({
        maxTime: 5000,
        serverId: 3242
      })
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©2018-2019 KaceEnigma#2657 ')
			.addField('❯ Servers', this.client.guilds.cache.size, true)
			.addField('❯ Channels', this.client.channels.cache.size, true)
			.addField('❯ Users', this.client.users.cache.size, true)
			.addField('❯ Shards', this.client.options.shardCount, true)
			.addField('❯ Commands', this.client.registry.commands.size, true)
			.addField('❯ Home Server', this.client.options.invite ? `[Here](${this.client.options.invite})` : 'None', true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', duration(this.client.uptime), true)
			.addField('Platform', this.fetchPlatform(process.platform.toLowerCase()), true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Node Version', process.version, true)
			.addField('❯ Library',
				'[discord.js](https://discord.js.org)[-commando](https://github.com/discordjs/Commando)', true)
			.addField('Current server time', moment().format('MMMM Do YYYY [|] HH:mm.ss [UTC]ZZ'), false)
			.addField('\u200b', oneLine`Use the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}help\` command to get the list of commands available to you in a DM. 
            The default prefix is \`!\`. You can change this with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}prefix\` command. 
            If you ever forget the command prefix, just use \`${this.client.user.tag} prefix\``)
		
		const statMessage = await msg.embed(embed);
    const statsEmbed = new MessageEmbed()
		speed.on('data', (data) => {
		statsEmbed.fields.pop();
		statsEmbed.fields.pop();
		statsEmbed
			.addField('Download Speed', `${roundNumber(data.speeds.download, 2)} Mbps`, true)
			.addField('Upload Speed', `${roundNumber(data.speeds.upload, 2)} Mbps`, true)
			.addField('Current server time', moment().format('MMMM Do YYYY [|] HH:mm.ss [UTC]ZZ'), false)
			.addField('\u200b', oneLine`Use the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}help\` command to get the list of commands available to you in a DM. 
      The default prefix is \`!\`. You can change this with the \`${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}prefix\` command. 
      If you ever forget the command prefix, just use \`${this.client.user.tag} prefix\``);

      statMessage.edit('', {embed: statsEmbed});
    });
		
		// return msg.embed(embed);
	}
};
