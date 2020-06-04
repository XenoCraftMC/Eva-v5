/**
 * @file Casino LeaderboardCommand - Shows the top 5 ranking players for your server  
 * **Aliases**: `lb`, `casinolb`, `leaderboards`
 * @module
 * @category casino
 * @name leaderboard
 * @returns {MessageEmbed} List of top ranking players
 */

const Database = require('better-sqlite3'),
  moment = require('moment'),
  path = require('path'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {oneLine, stripIndents} = require('common-tags'),
  {deleteCommandMessages, stopTyping, startTyping} = require('../../components/util.js');

module.exports = class LeaderboardCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'leaderboard',
      memberName: 'leaderboard',
      group: 'casino',
      aliases: ['lb', 'casinolb', 'leaderboards'],
      description: 'Shows the top 5 ranking players for your server',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run (msg) {
    const conn = new Database(path.join(__dirname, '../../data/databases/casino.sqlite3')),
      lbEmbed = new MessageEmbed();

    lbEmbed
      .setTitle('Top 5 players')
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setThumbnail('https://favna.xyz/images/ribbonhost/casinologo.png');

    try {
      startTyping(msg);
      const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" ORDER BY balance DESC LIMIT 5;`).all()
      if (query) {  
        for (const userID in query) {
          const ids = conn.prepare(`SELECT * FROM "${msg.guild.id}"`).all().map(e => function(e) { 
            return e.userID
          })
          for (const ida of Object.entries(ids)) {
            console.log(ida)
            if (ida == 'bank') return;
            else {
              lbEmbed.addField(`#${parseInt(userID, 10) + 1} ${msg.guild.members.get(query[userID].userID).displayName}`, `Chips: ${query[userID].balance}`);
            }  
          }
        }
        
        deleteCommandMessages(msg, this.client);
        stopTyping(msg);

        return msg.embed(lbEmbed);
      }
      stopTyping(msg);

      return msg.reply(`looks like there aren't any casino players in this server yet, use the \`${msg.guild.commandPrefix}chips\` command to get your first 500`);
    } catch (err) {
      stopTyping(msg);
      if ((/(?:no such table)/i).test(err.toString())) {
        conn.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER, lasttopup TEXT, ledger INTEGER);`).run();

        return msg.reply(`looks like there aren't any casino players in this server yet, use the \`${msg.guild.commandPrefix}chips\` command to get your first 500`);
      }
      this.client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
      <@${this.client.owners[0].id}> Error occurred in \`leaderboard\` command!
      **Server:** ${msg.guild.name} (${msg.guild.id})
      **Author:** ${msg.author.tag} (${msg.author.id})
      **Time:** ${moment(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
      **Error Message:** ${err}
      `);

      return msg.reply(oneLine`An error occurred but I notified ${this.client.owners[0].username}
      Want to know more about the error? Join the support server by getting an invite by using the \`${msg.guild.commandPrefix}invite\` command `);
    }
  }
};