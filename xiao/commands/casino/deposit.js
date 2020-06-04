const { Command } = require('discord.js-commando'),
  { MessageEmbed } = require('discord.js'),
  { deleteCommandMessages, stopTyping, startTyping } = require('../../components/util.js');

const { stripIndents, oneLine } = require('common-tags');
const moment = require('moment')

const Bank = require('/app/xiao/structures/currency/Bank');
const bankBal = require('/app/xiao/structures/currency/BankBal');

const Database = require('better-sqlite3')
//const Currency = require('../../structures/currency/Currency');

module.exports = class DepositCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'deposit',
      group: 'casino',
      memberName: 'deposit',
      aliases: ['dep'],
      description: `Deposit chips into the bank.`,
      details: `Deposit chips into the bank.`,
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },

      args: [
        {
          key: 'chips',
          label: 'amount of donuts to deposit',
          prompt: `how many chips do you want to deposit?\n`,
          validate: donuts => /^(?:\d+|all|-all|-a)$/g.test(donuts),
          parse: async (donuts, msg) => {
            const conn = new Database('/app/xiao/data/databases/casino.sqlite3')
            const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(msg.author.id);

            const balance = query.balance;

            if (['all', '-all', '-a'].includes(donuts)) return parseInt(balance);

            return parseInt(donuts);
          }
        }
      ]
    });
  }

  async run(msg, { chips }) {
    const conn = new Database(require('path').join(__dirname, '../../data/databases/casino.sqlite3'));
    /*const bankBalance = bankBal.bankBal(msg)
        console.log(bankBalance)

    try {
		if (donuts <= 0) return msg.reply(`you can't deposit 0 or less chips.`);

    const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(msg.author.id);
		const userBalance = await query.balance;
		
    if (userBalance < donuts) {
			return msg.reply(stripIndents`
				you don't have that many chips to deposit!
			`);
		}

		Bank.deposit(msg.author.id, donuts, msg);
          console.log(bankBalance)

    Bank.doInterest(msg)

		return msg.reply(`successfully deposited ${donuts} chips to the bank!`);
	}  catch (err) {
    console.log(err)
      if ((/(?:no such table)/i).test(err.toString())) {
        conn.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER, lasttopup TEXT, ledger INTEGER);`).run();

        conn.prepare(`INSERT INTO "${msg.guild.id}" VALUES ($userid, $balance, $date, $ledger);`).run({
          userid: msg.author.id,
          balance: '500',
          date: moment().format('YYYY-MM-DD HH:mm'),
          ledger: 0		  
        });
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
  };
}*/
    try {
      const depositEmbed = new MessageEmbed();
      const conn = new Database(require('path').join(__dirname, '../../data/databases/casino.sqlite3'));

      let records = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(msg.author.id),
        balance = records.balance,
        vault = records.vault

      if (balance >= 0) {
        if (chips > balance) {
          return msg.reply(oneLine`you don\'t have enough chips to make that deposit.
                    Use \`${msg.guild.commandPrefix}chips\` to check your current balance.
                    or withdraw some chips from your vault with \`${msg.guild.commandPrefix}withdraw\``);
        }

        const prevBal = balance;
        const prevVault = vault;

        balance -= chips;
        vault += chips;
        console.log(prevBal, prevVault, balance, vault)
        conn.prepare(`UPDATE "${msg.guild.id}" SET balance=$balance, vault=$vault WHERE userID="${msg.author.id}"`)
          .run({
            balance: balance,
            vault: vault
          });

        depositEmbed
          .setTitle('Vault deposit completed successfully')
          .addField('Previous balance', prevBal, true)
          .addField('New balance', balance, true)
          .addField('Previous vault content', prevVault, true)
          .addField('New vault content', vault, true);

        deleteCommandMessages(msg, this.client);

        return msg.embed(depositEmbed);
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
