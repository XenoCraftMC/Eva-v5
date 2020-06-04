const Command = require('../../structures/Command');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'fonts', 'HollywoodStar.otf'), { family: 'Hollywood Star' });

module.exports = class HollywoodStarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hollywood-star',
			aliases: ['hollywood', 'walk-of-fame', 'walk-of-fame-star'],
			group: 'edit-image',
			memberName: 'hollywood-star',
			description: 'Sends a Hollywood Walk of Fame star with the name of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'RedKid.Net',
					url: 'http://www.redkid.net/',
					reason: 'Image',
					reasonURL: 'http://www.redkid.net/generator/star/'
				},
				{
					name: 'Alexey Star',
					url: 'https://alexeystar.com/',
					reason: 'Hollywood Star Font',
					reasonURL: 'https://alexeystar.com/hollywood-star-font/'
				},
				{
					name: 'Hollywood Walk of Fame',
					url: 'https://walkoffame.com/',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'name',
					prompt: 'What name should be on the star?',
					type: 'string',
					max: 30
				}
			]
		});
	}

	async run(msg, { name }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'hollywood-star.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.font = '28px Hollywood Star';
		ctx.fillStyle = '#fadfd4';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillText(name.toLowerCase(), 288, 140);
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'hollywood-star.png' }] });
	}
};
