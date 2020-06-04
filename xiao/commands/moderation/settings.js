const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['set', 'setting'],
      group: 'moderation',
      memberName: 'settings',
      description: 'Sets or shows server settings.',
      details: oneLine`
				This command allows you to set server settings.
        This is required for many commands to work.
        Permission is locked to users with the server administrator permission.
			`,
      examples: ['settings add mod @Moderators'],
      userPermissions: ['ADMINISTRATOR'],
      args: [{
        key: 'action',
        label: 'action',
        type: 'string',
        prompt: 'What would you like to do? (View / Add / Remove / List)',
        infinite: false
      },
      {
        key: 'setting',
        label: 'setting',
        type: 'string',
        prompt: 'What setting would you like?',
        infinite: false
      },
      {
        'key': 'value',
        'label': 'value',
        'type': 'string',
        'prompt': '',
        'default': '',
        'infinite': false
      }],
      guildOnly: true,
      guarded: true
    });
  }

  run(message, args) {
    switch (args.action.toLowerCase()) {
        
    case 'add':
    {
      switch (args.setting.toLowerCase()) {
      case 'modrole':
      {
        const rawRole = message.guild.roles.cache.find('name', args.value);
        if (rawRole === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
        const roleToLog = rawRole.id;
        message.guild.settings.set('modrole', roleToLog);
        const role = message.guild.roles.cache.get(message.guild.settings.get('modrole'));
        message.reply(`Set the mod role to "${role.name}"`);
        break;
      }
      case 'adminrole':
      {
        const rawRole = message.guild.roles.cache.find('name', args.value);
        if (rawRole === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
        const roleToLog = rawRole.id;
        message.guild.settings.set('adminrole', roleToLog);
        const role = message.guild.roles.cache.get(message.guild.settings.get('adminrole'));
        message.reply(`Set the admin role to "${role.name}"`);
        break;
      }
          case 'muterole':
      {
        const rawRole = message.guild.roles.cache.find('name', args.value);
        if (rawRole === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
        const roleToLog = rawRole.id;
        message.guild.settings.set('muterole', roleToLog);
        const role = message.guild.roles.cache.get(message.guild.settings.get('muterole'));
        message.reply(`Set the mute role to "${role.name}"`);
        break;
      }
      case 'modlogchannel':
      {
        const rawChan = message.mentions.channels.first();
        if (!rawChan) return message.reply('Please specify a channel to use for the mod logs!');
        const chanToLog = rawChan.id;
        message.guild.settings.set('modlogchannel', chanToLog);
        message.reply(`Set the mod log channel to "<#${message.guild.settings.get('modlogchannel')}>"`);
        break;
      }
      case 'modlogs':
      {
        const state = args.value;
        if (state.toLowerCase() === 'on') {
          message.guild.settings.set('modlogs', state);
          message.reply(`Set the modlogs state to "${message.guild.settings.get('modlogs')}"`);
        } else if (state.toLowerCase() === 'off') {
          message.guild.settings.set('modlogs', state);
          message.reply(`Set the modlogs state to "${message.guild.settings.get('modlogs')}"`);
        } else { return message.reply('Invaid state! Use `on` or  `off`.'); }
        break;
      }
          case 'automod':
      {
        const state = args.value;
        if (state.toLowerCase() === 'on') {
          message.guild.settings.set('automod', state);
          message.reply(`Set the automod state to "${message.guild.settings.get('automod')}"`);
        } else if (state.toLowerCase() === 'off') {
          message.guild.settings.set('automod', state);
          message.reply(`Set the automod state to "${message.guild.settings.get('automod')}"`);
        } else { return message.reply('Invaid state! Use `on` or  `off`.'); }
        break;
      }
      case 'announcements':
      {
        const state = args.value;
        if (state.toLowerCase() === 'on') {
          message.guild.settings.set('announcements', state);
          message.reply(`Set the announcement state to "${message.guild.settings.get('announcements')}" \nDo \`${message.guild.commandPrefix}settings add announcements off\` to re-disable announcements.`);
        } else if (state.toLowerCase() === 'off') {
          message.guild.settings.set('announcements', state);
          message.reply(`Set the announcement state to "${message.guild.settings.get('announcements')}" \nDo \`${message.guild.commandPrefix}settings add announcements on\` to re-enable announcements.`);
        } else { return message.reply('Invaid state! Use `on` or  `off`.'); }
        break;
      }
      case 'leveling':
      {
        const state = args.value;
        if (state.toLowerCase() === 'on') {
          message.guild.settings.set('leveling', state);
          message.reply(`Set the leveling state to "${message.guild.settings.get('leveling')}"`);
        } else if (state.toLowerCase() === 'off') {
          message.guild.settings.set('leveling', state);
          message.reply(`Set the leveling state to "${message.guild.settings.get('leveling')}"`);
        } else { return message.reply('Invaid state! Use `on` or  `off`.'); }
        break;
      }
      case 'announcechannel':
      {
        const rawAnnChan = message.mentions.channels.first();
        if (!rawAnnChan) return message.reply('Please specify a channel to use for the announcements!');
        const AnnchanToLog = rawAnnChan.id;
        message.guild.settings.set('announcechannel', AnnchanToLog);
        message.reply(`Set the announcemnets channel to "<#${message.guild.settings.get('announcechannel')}>"`);
        break;    
      }
           case 'suggestionschannel':
      {
        const rawAnnChan = message.mentions.channels.first();
        if (!rawAnnChan) return message.reply('Please specify a channel to use for suggestions!');
        const AnnchanToLog = rawAnnChan.id;
        message.guild.settings.set('suggestionChannel', AnnchanToLog);
        message.reply(`Set the suggestions channel to "<#${message.guild.settings.get('suggestionChannel')}>"`);
      }
      /*case 'autorole':
      {
        const rawRole = message.guild.roles.cache.find('name', args.value);
        if (rawRole === null) return message.reply('That is not a role! Was your capatalization and spelling correct?');
        const roleToLog = rawRole.id;
        message.guild.settings.set('autorole', roleToLog);
        const role = message.guild.roles.cache.get(message.guild.settings.get('autorole'));
        message.reply(`Set the autorole to "${role.name}"`);
        break;
      }*/
      case 'starboardtoggle':
      {
        const state = args.value;
        if (state.toLowerCase() === 'on') {
          message.guild.settings.set('starboardtoggle', state);
          message.reply(`Set the StarboardToggle state to "${message.guild.settings.get('starboardtoggle')}" \nDo \`${message.guild.commandPrefix}settings add starboardtoggle off\` to disable starboardtoggle.`);
        } else if (state.toLowerCase() === 'off') {
          message.guild.settings.set('announcements', state);
          message.reply(`Set the starboardtoggle state to "${message.guild.settings.get('starboardtoggle')}" \nDo \`${message.guild.commandPrefix}settings add starboardtoggle on\` to re-enable starboardtoggle.`);
        } else { return message.reply('Invaid state! Use `on` or  `off`.'); }
        break;
      }          
      case 'starboardchannel':
      {
        const rawChan = message.mentions.channels.first();
        if (!rawChan) return message.reply('Please specify a channel to use for the starboard!');
        const chanToLog = rawChan.id;
        message.guild.settings.set('starboard', chanToLog);
        message.reply(`Set the starboard channel to "<#${message.guild.settings.get('starboard')}>"`);
        break;
      }
      default:
      {
        message.reply(`That's not a setting. Please try again. Do \`${message.guild.commandPrefix}settings list all\` to see all settings.`);
      }
      }
      break;
    }
    case 'remove' || 'unset':
    {
      switch (args.setting.toLowerCase()) {
      case 'mod':
      {
        message.guild.settings.remove('modrole');
        message.reply(`Mod role has been unset. Do \`${message.guild.commandPrefix}settings add mod\` to set a new role.`);
        break;
      }
      case 'admin':
      {
        message.guild.settings.remove('adminrole');
        message.reply(`Admin role has been unset. Do \`${message.guild.commandPrefix}settings add admin\` to set a new role.`);
        break;
      }
      case 'modlog':
      {
        message.guild.settings.remove('modlogchannel');
        message.reply(`Mod log channel has been unset. Do \`${message.guild.commandPrefix}settings add modlog\` to set a new channel.`);
        break;
      }
      case 'announcements':
      {
        message.reply(`The announcements setting can not be removed. Do \`${message.guild.commandPrefix}settings add announcements\` to change it.`);
        break;
      }
      case 'autorole':
      {
        message.guild.settings.remove('autorole');
        message.reply(`Auto role has been unset. Do ${message.guild.commandPrefix}settings add autorole\` to set a new role.`);
        break;
      }
      case 'starboardchannel':
      {
        message.guild.settings.remove('starboard');
        message.reply(`Starboard has been unset. Do ${message.guild.commandPrefix}settings add starboard\` to set a new starboard channel.`);
        break;
      }
      default:
      {
        message.reply(`That's not a setting. Please try again. Do \`${message.guild.commandPrefix}settings list all\` to see all settings.`);
      }
      }
      break;
    }
    case 'view':
    {
      switch (args.setting.toLowerCase()) {
      case 'modrole':
      {
        const role = message.guild.roles.cache.get(message.guild.settings.get('modrole'));
        if (!role.name || !role) return message.reply('There is currently no mod role set.');
        message.reply(`The mod role is "${role.name}"`);
        break;
      }
      case 'adminrole':
      {
        const role = message.guild.roles.cache.get(message.guild.settings.get('adminrole'));
        if (!role || !role.name) return message.reply('There is currently no admin role set.');
        message.reply(`The admin role is "${role.name}"`);
        break;
      }
      case 'modlogchannel':
      {
        const chan = message.guild.channels.cache.get(message.guild.settings.get('modlogchannel'));
        if (!chan || !chan.id) return message.reply('There is currently no modlog channel set.');
        message.reply(`The mod log channel is "<#${chan.id}>"`);
        break;
      }
      case 'announcements':
      {
        const state = message.guild.settings.get('announcements');
        if (!state) return message.reply('There is currently no announcements state set.');
        message.reply(`The announcements state is "${state}"`);
        break;
      }
      case 'autorole':
      {
        const role = message.guild.roles.cache.get(message.guild.settings.get('autorole'));
        if (!role.name || !role) return message.reply('There is currently no auto role set.');
        message.reply(`The auto role is "${role.name}"`);
        break;
      }
      case 'starboardtoggle':
      {
        const state = message.guild.settings.get('starboardtoggle');
        if (!state) return message.reply('There is currently no starboard state set.');
        message.reply(`The starboard state is "${state}"`);
        break;
      }
      case 'starboardchannel':
      {
        const chan = message.guild.channels.cache.get(message.guild.settings.get('starboard'));
        if (!chan || !chan.name) return message.reply('There is currently no starboard channel set.');
        message.reply(`The starboard channel is "<#${message.guild.settings.get('starboard')}>"`);
        break;
      }
      default:
      {
        message.reply(`That's not a setting. Please try again. Do \`${message.guild.commandPrefix}settings list all\` to see all settings.`);
      }
      }
      break;
    }
    case 'list':
    {
      switch (args.setting.toLowerCase()) {
      case 'all':
      {
        let modRole = message.guild.roles.cache.get(message.guild.settings.get('modrole'));
        let adminRole = message.guild.roles.cache.get(message.guild.settings.get('adminrole'));
        let muteRole = message.guild.roles.cache.get(message.guild.settings.get('muterole'));
       let defaultrole = message.guild.roles.cache.get(message.guild.settings.get('defaultRole'));

        
        let modlog = message.guild.channels.cache.get(message.guild.settings.get('modlogchannel'));
        let announcechannel = message.guild.channels.cache.get(message.guild.settings.get('announcechannel'));
        let suggestchannel = message.guild.channels.cache.get(message.guild.settings.get('suggestionChannel'));
        let joinMsgChannel = message.guild.channels.cache.get(message.guild.settings.get('joinmsgchannel'));
        let leaveMsgChannel = message.guild.channels.cache.get(message.guild.settings.get('leavemsgchannel'));
        let memberLogsChannel = message.guild.channels.cache.get(message.guild.settings.get('memberlogchannel'));

        
        let announcements = message.guild.settings.get('announcements');
        let leveling = message.guild.settings.get('leveling');
        let eco = message.guild.settings.get('economy');
        let automod = message.guild.settings.get('automod');
        let dcm = message.guild.settings.get('deletecommandmessages')
        let memberlogsToggle = message.guild.settings.get('memberlogs')
        let modlogsToggle = message.guild.settings.get('modlogs')
        
        let autoRole = message.guild.roles.cache.get(message.guild.settings.get('autorole'));
        let starboard = this.client.channels.cache.get(message.guild.settings.get('starboard')) 
        let StarboardToggle = message.guild.settings.get('starboardtoggle')
        let joinmsgToggle = message.guild.settings.get('joinmsgs')
        let leavemsgToggle = message.guild.settings.get('leavemsgs')
        let regexmatchesToggle = message.guild.settings.get('regexmatches')


        if (!modRole || !modRole.name) modRole = '`' + 'not set' + '`';
        else modRole = modRole.name;
        
        if (!muteRole || !muteRole.name) muteRole = '`' + 'not set' + '`';
        else muteRole = muteRole.name;
        
        if (!adminRole || !adminRole.name) adminRole = '`' + 'not set' + '`';
        else adminRole = adminRole.name;
        
         if (!defaultrole || !defaultrole.name) defaultrole = '`' + 'not set' + '`';
        else defaultrole = defaultrole.name;
        
        if (!modlog || !modlog.name) modlog = '`' + 'not set' + '`';
        else modlog = `<#${modlog.id}>`;
        
        if (!suggestchannel || !suggestchannel.name) suggestchannel = '`' + 'not set' + '`';
        else suggestchannel = `<#${suggestchannel.id}>`;
        
         if (!joinMsgChannel || !joinMsgChannel.name) joinMsgChannel = '`' + 'not set' + '`';
        else joinMsgChannel = `<#${joinMsgChannel.id}>`;
        
         if (!leaveMsgChannel || !leaveMsgChannel.name) leaveMsgChannel = '`' + 'not set' + '`';
        else  leaveMsgChannel = `<#${leaveMsgChannel.id}>`;
        
         if (!memberLogsChannel || !memberLogsChannel.name) memberLogsChannel = '`' + 'not set' + '`';
        else  memberLogsChannel = `<#${memberLogsChannel.id}>`;
        
        
        if (!modlogsToggle ) modlogsToggle = '`' + 'not set' + '`';
        if (!memberlogsToggle ) memberlogsToggle = '`' + 'not set' + '`';
        if (!announcements ) announcements = '`' + 'not set' + '`';
        if (!regexmatchesToggle ) regexmatchesToggle = '`' + 'not set' + '`';
        if (!StarboardToggle ) StarboardToggle = '`' + 'not set' + '`';
        if (!leveling) leveling = '`' + 'not set' + '`';
        if (!eco) eco = '`' + 'not set' + '`';
        if (!dcm) dcm = '`' + 'not set' + '`';
        if (!automod) automod = '`' + 'not set' + '`';
        if (!joinmsgToggle) joinmsgToggle = '`' + 'not set' + '`';
        if (!leavemsgToggle) leavemsgToggle = '`' + 'not set' + '`';

        if (!autoRole || !autoRole.name) autoRole = '`' + 'not set' + '`';
        else autoRole = autoRole.name;
        
        if (!starboard || !starboard.name) starboard = '`' + 'not set' + '`';
        else starboard = `<#${starboard.id}>`;
        
        if (!announcechannel || !announcechannel.name) announcechannel = '`' + 'not set' + '`';
        else announcechannel = `<#${announcechannel.id}>`;
        
        message.reply(`The settings for this server are:
=== Roles ===
**Moderator role (modrole) **: ${modRole}
**Administrator role (adminrole) **: ${adminRole}
**Mute Role (muterole)**: ${muteRole}
**Default Role (Granted on Server Join)**: ${defaultrole}

=== Channels ===
**Modlog Channel (modlogchannel)**: ${modlog}
**Starboard Channel (starboardchannel):** ${starboard}
**Server Announcements Channel**: ${announcechannel}
**Suggestions Channel (suggestchannel)**: ${suggestchannel}
**Join Messages Channel (${message.guild.commandPrefix}joinmessages)**: ${joinMsgChannel}
**Leave Messages Channel (${message.guild.commandPrefix}leavemessages)**: ${leaveMsgChannel}
**Member Logs Channel (${message.guild.commandPrefix}setmemberlogs)**: ${memberLogsChannel}

=== Systems ===
**Auto-Moderation (${message.guild.commandPrefix}automod)**: ${automod}
**Leveling System**: ${leveling}
**Economy System**: ${eco}

=== Misc ===
**Regex Match**: ${regexmatchesToggle}

=== Alerts ===
**Delete Command Message**: ${dcm}
**Leveling Messages**: ${leveling}
**Global announcements (announcements) **: ${announcements}
**Join Messages (${message.guild.commandPrefix}joinmessages)**: ${joinmsgToggle}
**Leave Messages (${message.guild.commandPrefix}leavemessages)**: ${leavemsgToggle}
**Member Logs (${message.guild.commandPrefix}memberlogs)**: ${memberlogsToggle}
**Moderation Logs **: ${modlogsToggle}
**Starboard Toggle (starboardtoggle) **: ${StarboardToggle}
`);
        break;
      }
      default:
      {
        return message.reply(`Invalid command usage! Please do \`${message.guild.commandPrefix}settings list all\` to see all settings.`);
      }
      }
      break;
    }
    default:
    {
      message.reply('Invalid command usage. Please try again. *(Action should be `add`, `remove`, `view`, or `list`.)*');
    }
    }
  }
};