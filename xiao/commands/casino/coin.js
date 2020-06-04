/**
 * @file Casino CoinCommand - Gamble your chips in a coin flip  
 * Payout is 1:2  
 * **Aliases**: `flip`, `cflip`
 * @module
 * @category casino
 * @name coin
 * @example coin 10 heads
 * @param {Number} AmountOfChips Amount of chips you want to gamble
 * @param {StringResolvable} CoinSide The side of the coin you want to bet on
 * @returns {MessageEmbed} Outcome of the coin flip
 */

const Database = require('better-sqlite3'),
  moment = require('moment'),
  path = require('path'),
  { Command } = require('discord.js-commando'),
  { MessageEmbed } = require('discord.js'),
  { oneLine, stripIndents } = require('common-tags'),
  { deleteCommandMessages, roundNumber, stopTyping, startTyping } = require('../../components/util.js');

module.exports = class CoinCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coinflip',
      memberName: 'coinflip',
      group: 'casino',
      aliases: ['cf'],
      description: 'Gamble your chips in a coin flip',
      format: 'AmountOfChips CoinSide',
      examples: ['coinflip 50 heads'],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'chips',
          prompt: 'How many chips do you want to gamble?',
          type: 'integer',
          validate: (chips) => {
            if ((/^[+]?\d+$/).test(chips) && chips >= 1 && chips <= 10000) {
              return true;
            }

            return 'Reply with a chips amount has to be a full number (no decimals) between 1 and 10000. Example: `10`';
          }
        },
        {
          key: 'side',
          prompt: 'What side will the coin land on?',
          type: 'string',
          validate: (side) => {
            const validSides = ['heads', 'head', 'tails', 'tail'];

            if (validSides.includes(side.toLowerCase())) {
              return true;
            }

            return `Has to be either \`${validSides[0]}\` or \`${validSides[2]}\``;
          }
        }
      ]
    });
  }

  run(msg, { chips, side }) {
    const coinEmbed = new MessageEmbed(),
      conn = new Database(path.join(__dirname, '../../data/databases/casino.sqlite3'));

    coinEmbed
      .setAuthor(msg.member.displayName, msg.author.displayAvatarURL({ format: 'png' }))
      .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
      .setThumbnail('https://favna.xyz/images/ribbonhost/casinologo.png');

    try {
      let { balance } = conn.prepare(`SELECT balance FROM "${msg.guild.id}" WHERE userID = ?;`).get(msg.author.id);

      if (balance >= 0) {
        if (chips > balance) {
          return msg.reply(oneLine`You don't have enough chips to make that bet.
                    Use \`${msg.guild.commandPrefix}chips\` to check your current balance.
                    or withdraw some chips from your vault with \`${msg.guild.commandPrefix}withdraw\``);
        }

        const flip = Math.random() >= 0.5;
        const prevBal = balance;
        const res = side === 'heads';

        balance -= chips;

        if (flip === res) balance += chips * 2;

        balance = roundNumber(balance);

        conn.prepare(`UPDATE "${msg.guild.id}" SET balance=$balance WHERE userID="${msg.author.id}";`)
          .run({ balance });

        coinEmbed
          .setTitle(`${msg.author.tag} ${flip === res ? 'won' : 'lost'} ${chips} chips`)
          .addField('Previous Balance', prevBal, true)
          .addField('New Balance', balance, true)
          .setImage(flip === res
            ? `https://storage.googleapis.com/data-sunlight-146313.appspot.com/ribbon/coin${side}.png`
            : `https://storage.googleapis.com/data-sunlight-146313.appspot.com/ribbon/coin${side === 'heads' ? 'tails' : 'heads'}.png`
          );

        deleteCommandMessages(msg, this.client);

        return msg.embed(coinEmbed);
      }

      return msg.reply(oneLine`looks like you either don't have any chips yet or you used them all
                Run \`${msg.guild.commandPrefix}chips\` to get your first 500
                or run \`${msg.guild.commandPrefix}withdraw\` to withdraw some chips from your vault.`);
                
    } catch (err) {
      if (/(?:no such table|Cannot destructure property)/i.test(err.toString())) {
        conn.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER , lastdaily TEXT , lastweekly TEXT , vault INTEGER);`)
          .run();

        return msg.reply(`looks like you don't have any chips yet, please use the \`${msg.guild.commandPrefix}chips\` command to get your first 500`);
      }
      const channel = this.client.channels.resolve(process.env.ribbonlogchannel);

      channel.send(stripIndents`
                <@${this.client.owners[0].id}> Error occurred in \`coin\` command!
                **Server:** ${msg.guild.name} (${msg.guild.id})
                **Author:** ${msg.author.tag} (${msg.author.id})
                **Time:** ${moment(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
                **Error Message:** ${err}
            `);

      return msg.reply(oneLine`An unknown and unhandled error occurred but I notified ${this.client.owners[0].username}.
                Want to know more about the error? Join the support server by getting an invite by using the \`${msg.guild.commandPrefix}invite\` command `);
    }
  }
}
