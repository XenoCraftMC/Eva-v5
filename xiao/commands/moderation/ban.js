const {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {oneLine, stripIndents} = require('common-tags'),
  {deleteCommandMessages, stopTyping, startTyping} = require('../../components/util.js');

module.exports = class banCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ban',
      memberName: 'ban',
      group: 'moderation',
      aliases: ['b', 'banana'],
      description: 'Bans a member from the server',
      format: 'MemberID|MemberName(partial or full) [ReasonForBanning]',
      examples: ['ban JohnDoe annoying'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'member',
          prompt: 'Which member should I ban?',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'What is the reason for this banishment?',
          type: 'string',
          default: ''
        }
      ],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS']
    });
  }

  run (msg, {member, reason, keepmessages}) {
    startTyping(msg);
    if (member.id === msg.author.id) {
      stopTyping(msg);

      return msg.reply('I don\'t think you want to ban yourself.');
    }

    if (!member.bannable) {
      stopTyping(msg);

      return msg.reply('I cannot ban that member, their role is probably higher than my own!');
    }

    if ((/--nodelete/im).test(msg.argString)) {
      reason = reason.substring(0, reason.indexOf('--nodelete')) + reason.substring(reason.indexOf('--nodelete') + '--nodelete'.length + 1);
      keepmessages = true;
    }

    member.ban({
      days: keepmessages ? 0 : 1,
      reason: reason !== '' ? reason : 'No reason given by staff'
    });
  
    // const banEmbed = new MessageEmbed(),
}}