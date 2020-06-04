const {Command} = require('discord.js-commando'), 
  {MessageEmbed} = require('discord.js'), 
  {oneLine, stripIndents} = require('common-tags'), 
  {deleteCommandMessages, stopTyping, startTyping} = require('../../components/util.js');

module.exports = class MemberLogsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'suggestions',
      memberName: 'suggestions',
      group: 'moderation',
      aliases: ['ts', 'togglesuggestions'],
      description: 'Toggle suggestions.',
      format: 'BooleanResolvable',
      examples: ['suggestions on'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'option',
          prompt: 'Enable or disable suggestions?',
          type: 'boolean',
          validate: (bool) => {
            const validBools = ['on', 'off'];

            if (validBools.includes(bool.toLowerCase())) {
              return true;
            }

            return stripIndents`Has to be one of ${validBools.map(val => `\`${val}\``).join(', ')}
            Respond with your new selection or`;
          }
        }
      ],
      userPermissions: ['ADMINISTRATOR']
    });
  }

  run (msg, {option}) {
    startTyping(msg);

    const memberLogsEmbed = new MessageEmbed(),
      modlogChannel = msg.guild.settings.get('modlogchannel',
        msg.guild.channels.cache.find(c => c.name === 'mod-logs') ? msg.guild.channels.cache.find(c => c.name === 'mod-logs').id : null);

    msg.guild.settings.set('suggestions', option);

    memberLogsEmbed
      .setColor('#3DFFE5')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(stripIndents`
  **Action:** Suggestions are now ${option ? 'enabled' : 'disabled'}
  **Details:** Please ensure you configure suggestions with \`${msg.guild.commandPrefix}setsuggestionschannel\`
  `)
      .setTimestamp();

    if (msg.guild.settings.get('modlogs', true)) {
      if (!msg.guild.settings.get('hasSentModLogMessage', false)) {
        msg.reply(oneLine`📃 I can keep a log of moderator actions if you create a channel named \'mod-logs\'
              (or some other name configured by the ${msg.guild.commandPrefix}setmodlogs command) and give me access to it.
              This message will only show up this one time and never again after this so if you desire to set up mod logs make sure to do so now.`);
        msg.guild.settings.set('hasSentModLogMessage', true);
      }
      modlogChannel && msg.guild.settings.get('modlogs', false) ? msg.guild.channels.cache.get(modlogChannel).send('', {embed: memberLogsEmbed}) : null;
    }

    deleteCommandMessages(msg, this.client);
    stopTyping(msg);

    return msg.embed(memberLogsEmbed);
  }
};