/**
 * @file Casino DailyCommand - Receive your daily 500 chips top up  
 * **Aliases**: `topup`, `bonus`
 * @module
 * @category casino
 * @name daily
 * @returns {MessageEmbed} Your new balance
 */

const Database = require('better-sqlite3'),
    moment = require('moment'),
    path = require('path'),
    { Command } = require('discord.js-commando'),
    { MessageEmbed } = require('discord.js'),
    { oneLine, stripIndents } = require('common-tags'),
    { deleteCommandMessages, stopTyping, startTyping } = require('../../components/util.js');

module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'daily',
            memberName: 'daily',
            group: 'casino',
            aliases: ['topup', 'bonus'],
            description: 'Receive your daily cash top up of 500 chips',
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

        let returnMsg = '';

        balEmbed
            .setAuthor(msg.member.displayName, msg.author.displayAvatarURL({ format: 'png' }))
            .setColor(msg.guild ? msg.guild.me.displayHexColor : '#7CFC00')
            .setThumbnail('https://favna.xyz/images/ribbonhost/casinologo.png');

        try {
            let { balance, lastdaily } = conn.prepare(`SELECT balance, lastdaily FROM "${msg.guild.id}" WHERE userID = ?;`).get(msg.author.id);

            if (balance >= 0) {
                const dailyDura = moment.duration(moment(lastdaily).add(24, 'hours').diff(moment()));
                const prevBal = balance;

                let chipStr = '';
                let resetStr = '';
                balance += 300;

                if (dailyDura.asHours() <= 0) {
                    conn.prepare(`UPDATE "${msg.guild.id}" SET balance=$balance, lastdaily=$date WHERE userID="${msg.author.id}";`)
                        .run({ balance, date: moment().format('YYYY-MM-DD HH:mm') });

                    chipStr = `${prevBal} ➡ ${balance}`;
                    resetStr = 'in 24 hours';
                    returnMsg = 'Topped up your balance with your daily 300 chips!';
                } else {
                    chipStr = prevBal;
                    resetStr = dailyDura.format('[in] HH[ hour and] mm[ minute]');
                    returnMsg = 'Sorry but you are not due to get your daily chips yet, here is your current balance';
                }

                balEmbed.setDescription(stripIndents`
                    **Balance**
                    ${chipStr}
                    **Daily Reset**
                    ${resetStr}
                `);

                deleteCommandMessages(msg, this.client);
                return msg.embed(balEmbed, returnMsg);
            }
            conn.prepare(`INSERT INTO "${msg.guild.id}" VALUES ($userid, $balance, $dailydate, $weeklydate, $vault);`)
                .run({
                    balance: 500,
                    dailydate: moment().format('YYYY-MM-DD HH:mm'),
                    userid: msg.author.id,
                    vault: 0,
                    weeklydate: moment().format('YYYY-MM-DD HH:mm'),
                });
        } catch (err) {
            if (/(?:no such table|Cannot destructure property)/i.test(err.toString())) {
                conn.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER, lasttopup TEXT, ledger INTEGER);`).run();

                return msg.reply(`looks like you don\'t have any chips yet, please use the \`${msg.guild.commandPrefix}chips\` command to get your first 500`);
            } else {
                const channel = this.client.channels.resolve(process.env.ribbonlogchannel);

                channel.send(stripIndents`
                    <@${this.client.owners[0].id}> Error occurred in \`daily\` command!
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
        `);

        deleteCommandMessages(msg, this.client);

        return msg.embed(balEmbed, 'You didn\'t have any chips yet so here\'s your first 500. Spend them wisely!'
        );
    }
}