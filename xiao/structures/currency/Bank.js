const conn = new require('better-sqlite3')('/app/xiao/data/databases/casino.sqlite3');
const connBank = new require('better-sqlite3')(require('path').join(__dirname, '../../data/databases/bank.sqlite3'));


// Rate * convert to decimal
const INTEREST_MATURE_RATE = 0.1;
const UPDATE_DURATION = 43200000;
const MIN_INTEREST_RATE = 0.001;


class Bank {
  static doInterest(msg) {
    const updates = conn.prepare(`SELECT * FROM "${msg.guild.id}"`)
    const updatess = updates.bankupdate
    setTimeout(() => Bank.applyInterest(msg), 10000);
  }

  static changeLedger(user, amount, msg) {
    const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(user);
    conn.prepare(`UPDATE "${msg.guild.id}" SET ledger=$ledger WHERE userID="${user.id}";`).run({
      ledger: amount
    })
  }

  static async getBalance(user, msg) {
    const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(user);
    if (user == 'bank') {
      return query.balance
    }
    const balance = query.vault || 0;

    return parseInt(balance);
  }

  static deposit(user, amount, msg) {
    const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(user),
      bal = query.balance - amount
    conn.prepare(`UPDATE "${msg.guild.id}" SET balance=$balance, ledger=$ledger WHERE userID="${user}";`).run({
      balance: bal,
      ledger: query.vault + amount
    })


    const bankBal = connBank.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get('bank')
    connBank.prepare(`UPDATE "${msg.guild.id}" SET balance=$balance,ledger=$ledger WHERE userID='bank';`).run({
      balance: '0',
      ledger: bankBal.ledger + amount
    })
  }

  static withdraw(user, amount, msg) {
    const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(user);
    const bal = parseInt(query.balance) || 0;
    conn.prepare(`UPDATE "${msg.guild.id}" SET balance=$balance, ledger=$ledger WHERE userID="${user}";`).run({
      balance: bal + amount,
      ledger: query.ledger - amount
    })

    const bankBal = connBank.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get('bank')
    connBank.prepare(`UPDATE "${msg.guild.id}" SET balance=$balance,ledger=$ledger WHERE userID='bank';`).run({
      balance: '0',
      ledger: bankBal.ledger - amount
    })
  }

  static async applyInterest(msg) {
    const interestRate = await this.getInterestRate(msg);

    const balances = conn.prepare(`SELECT * FROM "${msg.guild.id}"`).all().map(
      function (e) {
        return [e.userID, e.ledger]
      })

    if (!balances) return;
    for (const [user, balance] of Object.entries(balances)) {
      conn.prepare(`UPDATE "${msg.guild.id}" SET ledger=$ledger WHERE userID=$useri;`).run({
        useri: balance[0],
        ledger: Math.round(balance[1] * (2))
      })
    }
    const bnkUpdate = connBank.prepare(`UPDATE "${msg.guild.id}" SET bankupdate=$bankupdate`).run({
      bankupdate: Date.now()
    })

    setTimeout(() => Bank.applyInterest(msg), UPDATE_DURATION);

  }
	/*}/*

	static async applyInterest() {
		const interestRate = await this.getInterestRate();
		const bankBalance = await Bank.getBalance('bank');
		const previousBankBalance = await Redis.db.getAsync('lastbankbalance') || bankBalance;
		// const bankBalanceDelta = (bankBalance - previousBankBalance) / previousBankBalance;
		Redis.db.hgetallAsync('ledger').then(async balances => {
			if (!balances) return;

			/* eslint-disable no-await-in-loop */
  /*for (const [user, balance] of Object.entries(balances)) {
    await Redis.db.hsetAsync('ledger', user, Math.round(balance * (interestRate + 1)));
  }
  /* eslint-enable no-await-in-loop */
  /*});

  const newInterestRate = Math.max(MIN_INTEREST_RATE, interestRate + (bankBalanceDelta * -INTEREST_MATURE_RATE));
  await Redis.db.setAsync('interestrate', newInterestRate);
  await Redis.db.setAsync('lastbankbalance', bankBalance);
  await Redis.db.setAsync('bankupdate', Date.now());

  setTimeout(() => Bank.applyInterest(), UPDATE_DURATION);
}*/

  static async getInterestRate(msg) {
    const interestRate = await msg.guild.settings.get('interestrate') || 0.01;

    return parseFloat(interestRate);
  }
  /*
    static async nextUpdate() {
      const lastUpdate = await Redis.db.getAsync('bankupdate');
  
      return UPDATE_DURATION - (Date.now() - lastUpdate);
    }*/
}

module.exports = Bank;
