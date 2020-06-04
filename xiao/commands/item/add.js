const { Command } = require('discord.js-commando');

const Item = require('../../models/Item');
const Store = require('../../structures/currency/Store');
const StoreItem = require('../../structures/currency/StoreItem');

module.exports = class ItemAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'item-add',
			aliases: ['add-item'],
			group: 'item',
			memberName: 'add',
			description: 'Adds an item to the store.',
			details: 'Adds an item to the store.',
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'name',
					prompt: 'What should the new item be called?\n',
					type: 'string',
					parse: str => str.toLowerCase()
				},
				{
					key: 'price',
					prompt: 'What should the new item cost?\n',
					type: 'integer',
					min: 1
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, { name, price }) {
    const itemx = 'init',
          pricex = 10
    console.log(itemx,pricex)
    console.log(name, price)
    
		const item = Store.getItem(name);
		if (item) return msg.reply('An item with that name already exists.');

		const newItem = await Item.create({
			name,
			price
		});
		const newItemName = newItem.name.replace(/(\b\w)/gi, lc => lc.toUpperCase());
		Store.registerItem(new StoreItem(newItem.name, newItem.price));

		return msg.reply(`The item ${newItemName} has been successfully created!`);
	}
};
