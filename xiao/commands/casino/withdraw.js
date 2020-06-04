const { Command } = require('discord.js-commando'),
      {MessageEmbed} = require('discord.js'),
      {deleteCommandMessages} = require('../../components/util.js');


const { stripIndents, oneLine } = require('common-tags');
const moment = require('moment')

const Bank = require('../../structures/currency/Bank');
const bankBal = require('../../structures/currency/BankBal');


module.exports = class WidthdrawCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'withdraw',
      aliases: ['with'],
			group: 'casino',
			memberName: 'withdraw',
			description: `Withdraw chips from the bank.`,
			details: `Withdraw chips from the bank.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'donuts',
					label: 'amount of chips to withdraw',
					prompt: `how many chips do you want to withdraw?\n`,
					validate: donuts => /^(?:\d+|all|-all|-a)$/g.test(donuts),
					parse: async (donuts, msg) => {
						const balance = await Bank.getBalance(msg.author.id, msg);

						if (['all', '-all', '-a'].includes(donuts)) return parseInt(balance);

						return parseInt(donuts);
					}
				}
			]
		});
	}

	async run(msg, { chips }) {
    const conn = new require('better-sqlite3')(require('path').join(__dirname, '../../data/databases/casino.sqlite3'));
          const withdrawEmbed = new MessageEmbed();
        withdrawEmbed
            .setAuthor(msg.member.displayName, msg.author.displayAvatarURL())
            .setColor(msg.guild ? msg.guild.me.displayHexColor : '#3498DB')
            .setThumbnail(`https://storage.googleapis.com/data-sunlight-146313.appspot.com/ribbon/bank.png`);
    /*
		if (donuts <= 0) return msg.reply(`you can't widthdraw 0 or less chips.`);

    try {
      const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(msg.author.id);
      const bankBalance = bankBal.bankBal(msg)
		  const userBalance = await query.balance;
      
      if (query.ledger <= 0) {
        return msg.reply('You have insufficient funds in your bank.')
      }
      if (query.ledger < donuts) {
        return msg.reply('You have insufficient funds in your bank.')
      }*/

     /* if (userBalance < donuts) {
			  return msg.reply(stripIndents`
				  you do not have that many chips in your bank!
			  `);
		  }*/
    /*
try{
		  Bank.withdraw(msg.author.id, donuts, msg);
} catch (err)  {console.log(err) }

		  return msg.reply(`successfully withdrew ${(donuts)} chips from the bank!`);
    }  catch (err) {
      if ((/(?:no such table)/i).test(err.toString())) {
        conn.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER, lastdaily TEXT, lastweekly TEXT , vault INTEGER);`).run();
        
      return msg.reply(`looks like you don\'t have any chips yet, please use the \`${msg.guild.commandPrefix}chips\` command to get your first 500`);

      } else {
        this.client.channels.resolve(process.env.ribbonlogchannel).send(stripIndents`
        <@${this.client.owners[0].id}> Error occurred in \`daily\` command!
        **Server:** ${msg.guild.name} (${msg.guild.id})
        **Author:** ${msg.author.tag} (${msg.author.id})
        **Time:** ${moment(msg.createdTimestamp).format('MMMM Do YYYY [at] HH:mm:ss [UTC]Z')}
        **Error Message:** ${err}
        `);

        return msg.reply(oneLine`An error occurred but I notified ${this.client.owners[0].username}
        Want to know more about the error? Join the support server by getting an invite by using the \`${msg.guild.commandPrefix}invite\` command `);
      }
    }
	}
};
*/
    try {
    
    let { balance, vault } = conn.prepare(`SELECT balance, vault FROM "${msg.guild.id}" WHERE userID = ?;`).get(msg.author.id);

            if (balance >= 0) {
                if (chips > vault) {
                    return msg.reply(oneLine`you don\'t have that many chips stored in your vault.
                    Use \`${msg.guild.commandPrefix}bank\` to check your vault content.`);
                }

                const prevBal = balance;
                const prevVault = vault;

                balance += chips;
                vault -= chips;

                conn.prepare(`UPDATE "${msg.guild.id}" SET balance=$balance, vault=$vault WHERE userID="${msg.author.id}"`)
                    .run({ balance, vault });

                withdrawEmbed
                    .setTitle('Vault withdrawal completed successfully')
                    .addField('Previous balance', prevBal, true)
                    .addField('New balance', balance, true)
                    .addField('Previous vault content', prevVault, true)
                    .addField('New vault content', vault, true);

                deleteCommandMessages(msg, this.client);

                return msg.embed(withdrawEmbed);
            }

            return msg.reply(oneLine`looks like you either didn't get any chips or didn't save any to your vault
                Run \`${msg.guild.commandPrefix}chips\` to get your first 500
                or run \`${msg.guild.commandPrefix}deposit\` to deposit some chips to your vault`);
        } catch (err) {
            if (/(?:no such table|Cannot destructure property)/i.test(err.toString())) {
                conn.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER , lastdaily TEXT , lastweekly TEXT , vault INTEGER);`)
                    .run();

                return msg.reply(`looks like you don't have any chips yet, please use the \`${msg.guild.commandPrefix}chips\` command to get your first 500`);
            }

            const channel = this.client.channels.resolve(process.env.ribbonlogchannel) ;

            channel.send(stripIndents`
                <@${this.client.owners[0].id}> Error occurred in \`withdraw\` command!
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
