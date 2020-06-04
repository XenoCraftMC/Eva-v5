const connBank = new require('better-sqlite3')(require('path').join(__dirname, '../../data/databases/bank.sqlite3')),
        moment = require('moment')

class BankBal {
    static bankBal(msg) {
      try {
      const bankBal = connBank.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get('bank');
      if (bankBal.ledger < 0) {
         connBank.prepare(`INSERT INTO "${msg.guild.id}" VALUES ($userid, $balance, $ledger);`).run({
          userid: 'bank',
          balance: '5000',
          ledger: '5000'
          });
      }
        console.log(bankBal)
      return bankBal.ledger
      } catch (err) {
        this.errorHandle(msg, err)
      }
    }
  
    static createBank(msg) {
        try {
          connBank.prepare(`INSERT INTO "${msg.guild.id}" VALUES ($userid, $balance, $ledger, $bankupdate);`).run({
          userid: 'bank',
          balance: '5000',
          ledger: '5000',
          bankupdate: Date.now()
          });
        } catch (err) {
          console.log(err)
          if ((/(?:no such table)/i).test(err.toString())) {
            connBank.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER, ledger INTEGER, bankupdate TEXT);`).run();
            connBank.prepare(`INSERT INTO "${msg.guild.id}" VALUES ($userid, $balance,$ledger, $bankupdate);`).run({
              userid: 'bank',
              balance: '5000',
              ledger: '5000',
              bankupdate: Date.now()
            });
          }
        }
    }
  
  static errorHandle(msg,err){
    if ((/(?:no such table)/i).test(err.toString())) {
            connBank.prepare(`CREATE TABLE IF NOT EXISTS "${msg.guild.id}" (userID TEXT PRIMARY KEY, balance INTEGER, ledger INTEGER, bankupdate TEXT);`).run();
            connBank.prepare(`INSERT INTO "${msg.guild.id}" VALUES ($userid, $balance,$ledger, $bankupdate);`).run({
              userid: 'bank',
              balance: '5000',
              ledger: 0,
              bankupdate:Date.now()
            });
   }
 }
}

module.exports = BankBal