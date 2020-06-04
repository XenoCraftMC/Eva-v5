const {Command} = require('discord.js-commando'), 
  {MessageEmbed} = require('discord.js'), 
  {oneLine, stripIndents} = require('common-tags'), 
  {deleteCommandMessages, stopTyping, startTyping} = require('../../components/util.js');

module.exports = class SetAnnounceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setsuggestionschannel',
      memberName: 'setsuggestionschannel',
      group: 'moderation',
      aliases: ['ssc'],
      description: 'Set the channel for the suggest command',
      format: 'ChannelID|ChannelName(partial or full)',
      examples: ['setsuggestionschannel #improvements'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'channel',
          prompt: 'To what channel should I change the suggestions?',
          type: 'channel'
        }
      ],
     
    });
  }

  run (msg, {channel}) {
    startTyping(msg);

    const modlogChannel = msg.guild.settings.get('modlogchannel',
        msg.guild.channels.cache.find(c => c.name === 'mod-logs') ? msg.guild.channels.cache.find(c => c.name === 'mod-logs').id : null),
      setAnnouncementEmbed = new MessageEmbed();

    msg.guild.settings.set('suggestionChannel', channel.id);

    setAnnouncementEmbed
      .setColor('#3DFFE5')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(stripIndents`
            **Action:** Suggestions Channel channel changed
            **Channel:** <#${channel.id}>`)
      .setTimestamp();

    if (msg.guild.settings.get('modlogs', true)) {
      if (!msg.guild.settings.get('hasSentModLogMessage', false)) {
        msg.reply(oneLine`📃 I can keep a log of moderator actions if you create a channel named \'mod-logs\'
                (or some other name configured by the ${msg.guild.commandPrefix}setmodlogs command) and give me access to it.
                This message will only show up this one time and never again after this so if you desire to set up mod logs make sure to do so now.`);
        msg.guild.settings.set('hasSentModLogMessage', true);
      }
      modlogChannel && msg.guild.settings.get('modlogs', false) ? msg.guild.channels.cache.get(modlogChannel).send('', {embed: setAnnouncementEmbed}) : null;
    }

    deleteCommandMessages(msg, this.client);
    stopTyping(msg);

    return msg.embed(setAnnouncementEmbed);

  }
};