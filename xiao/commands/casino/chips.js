/**
 * @file Casino ChipsCommand - Retrieves your current amount of chips for the casino
 * **Aliases**: `bal`, `cash`, `balance`
 * @module
 * @category casino
 * @name chips
 * @example chips
 * @returns {MessageEmbed} Information about your current balance
 */
const Database = require('better-sqlite3'),
  duration = require('moment-duration-format'), // eslint-disable-line no-unused-vars
  moment = require('moment'),
  path = require('path'),
  { Command } = require('discord.js-commando'),
  { MessageEmbed } = require('discord.js'),
  { oneLine, stripIndents } = require('common-tags'),
  { deleteCommandMessages, stopTyping, startTyping } = require('../../components/util.js');

module.exports = class ChipsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'chips',
      memberName: 'chips',
      group: 'casino',
      aliases: ['bal', 'cash', 'balance'],
      description: 'Retrieves your current balance for the casino',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    const balEmbed = new MessageEmbed(),
      conn = new Database(path.join(__dirname, '../../data/databases/casino.sqlite3'));

    balEmbed
      .setAuthor(msg.member.displayName, msg.author.displayAvatarURL({ format: 'png' }))
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setThumbnail('https://favna.xyz/images/ribbonhost/casinologo.png');

    try {
      const { balance, lastdaily, lastweekly, vault } = conn.prepare(`SELECT balance, lastdaily, lastweekly, vault FROM "${msg.guild.id}" WHERE userID = ?;`).get(msg.author.id);
      
      conn.prepare(`INSERT OR IGNORE INTO "${msg.guild.id}" VALUES ($userid, $balance, $dailydate, $weeklydate, $vault);`)
      .run({
        balance: 500,
        dailydate: moment().format('YYYY-MM-DD HH:mm'),
        userid: msg.author.id,
        vault: 0,
        weeklydate: moment().format('YYYY-MM-DD HH:mm'),
      });

      if (balance >= 0) {
        const dailyDura = moment.duration(moment(lastdaily).add(24, 'hours').diff(moment()));
        const weeklyDura = moment.duration(moment(lastweekly).add(7, 'days').diff(moment()));

        balEmbed.setDescription(stripIndents`
                    **Balance**
                    ${balance}
                    **Bank Balance**
                    ${vault}
                    **Daily Reset**
                    ${!(dailyDura.asHours() <= 0) ? dailyDura.format('[in] HH[ hour(s) and ]mm[ minute(s)]') : 'Right now!'}
                    **Weekly Reset**
                    ${!(weeklyDura.asDays() <= 0) ? weeklyDura.format('[in] d[ day and] HH[ hour]') : 'Right now!'}
                `);

        deleteCommandMessages(msg, this.client);

        return msg.embed(balEmbed);
      }

    } catch (err) {
      stopTyping(msg);

      if ((/(?:no such table)/i).test(err.toString())) {
        conn.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER , lastdaily TEXT , lastweekly TEXT , vault INTEGER);`)
          .run();

        conn.prepare(`INSERT INTO "${msg.guild.id}" VALUES ($userid, $balance, $dailydate, $weeklydate, $vault);`)
          .run({
            balance: 500,
            dailydate: moment().format('YYYY-MM-DD HH:mm'),
            userid: msg.author.id,
            vault: 0,
            weeklydate: moment().format('YYYY-MM-DD HH:mm'),
          });
      } else {
        console.log(err)
        const channel = this.client.channels.resolve(process.env.ribbonlogchannel);

        channel.send(stripIndents`
                    <@${this.client.owners[0].id}> Error occurred in \`chips\` command!
                    **Server:** ${msg.guild.name} (${msg.guild.id})
                    **Author:** ${msg.author.tag} (${msg.author.id})
                    **Time:** ${moment(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
                    **Error Message:** ${err}
                `);

        return msg.reply(oneLine`An unknown and unhandled error occurred but I notified ${this.client.owners[0].username}.
                    Want to know more about the error? Join the support server by getting an invite by using the \`${msg.guild.commandPrefix}invite\` command `);
      }
    }

    balEmbed.setDescription(stripIndents`
            **Balance**
            500
            **Daily Reset**
            in 24 hours
            **Weekly Reset**
            in 7 days
        `);

    deleteCommandMessages(msg, this.client);

    return msg.embed(balEmbed);
  }
}