const { Command } = require('discord.js-commando');

class XiaoCommand extends Command {
	constructor(client, info, options = {}) {
		super(client, info);

		this.argsSingleQuotes = info.argsSingleQuotes || false;
		this.throttling = info.throttling || { usages: 1, duration: 2 };
	}
  
  cmdVerify() {
    return Promise.resolve();
  }
  
}

module.exports = XiaoCommand;
