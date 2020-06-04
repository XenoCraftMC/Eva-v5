const Canvas = require('canvas');
const { Command } = require('discord.js-commando');
const { loadImage } = require('canvas');

const path = require('path');
const request = require('request-promise');

const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));

const UserProfile = require('/app/xiao/models/UserProfile');
const Experience = require('/app/xiao/structures/Experience')
const bank = require('/app/xiao/structures/currency/Bank')

module.exports = class ProfileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			group: 'profile',
			memberName: 'profile',
			description: 'Display your profile.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 60
			},

			args: [
				{
					key: 'member',
					prompt: 'whose profile would you like to view?\n',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {

		/*const exp = `${currentLevelExp}/${levelExp} (tot. ${currentExp})`
		const rank =`${currentRank}/${leaderboard.length}`*/

		const user = args.member || msg.member;
		const { Image } = Canvas;
		const profile = await UserProfile.findOne({ where: { userID: user.id } });
		const personalMessage = profile ? profile.personalMessage : '';
		const birthday = profile ? profile.dob : '';

		const conn = require('better-sqlite3')('/app/xiao/data/databases/casino.sqlite3');

		let query;

		async function DbExists() {
			try {
				const query = conn.prepare(`SELECT * FROM "${msg.guild.id}" WHERE userID = ?;`).get(user.id);
				return query
			} catch (err) {
				return msg.say('Use `chips` to start up the basic databases on this server.')
			}
		}

		query = await DbExists()

		let money;
		try {
			money = await query.balance
      if (typeof money === 'undefined') money = 0;
		} catch (err) {
			console.error(err)
			money = 0
		}

		const leaderboard = await msg.client.levels.getLeaderboard(msg.guild);

    let currentExp1, currentLevel, levelExp, currentLevelExp 
      
    if (leaderboard === undefined || leaderboard.length == 0) {
			currentExp1 = 0
			currentLevel = 0
			levelExp = 0
			currentLevelExp = 0
		} else {
			currentExp1 = leaderboard.find(cmpFunction).exp;
			currentRank = leaderboard.findIndex(cmpFunction) + 1;
			levelExp = msg.client.levels.getLevelExp(currentLevel);
			currentLevelExp = msg.client.levels.getLevelProgress(currentExp1);
		}
    
		function cmpFunction(item) {
			return item.user == user.id;
		}

		// const currentExp1 = leaderboard.find(cmpFunction).exp;
		const currentRank = leaderboard.findIndex(cmpFunction) + 1;
		//const currentLevel = msg.client.levels.getLevelFromExp(currentExp1);
		//const levelExp = msg.client.levels.getLevelExp(currentLevel);
		//const currentLevelExp = msg.client.levels.getLevelProgress(currentExp1);

		let bankbalance;
		try {
      
			bankbalance = await bank.getBalance(user.id, msg);
		} catch (err) {
			console.error(err)
			bankbalance = 0
		}

		const networth = money + bankbalance;
		const currentExp = currentLevelExp;
		const level = currentLevel;
		const levelBounds = Experience.getLevelBounds(level);
		const totalExp = currentExp1;
		const fillValue = Math.min(Math.max(currentExp / (levelBounds.upperBound - levelBounds.lowerBound), 0), 1);
		const fillbeta = (currentLevelExp / levelExp) * 100

		Canvas.registerFont('/app/xiao/assets/profile/fonts/Roboto.tff', { family: 'Roboto' }); // eslint-disable-line max-len
		Canvas.registerFont('/app/xiao/assets/profile/fonts/NotoEmoji-Regular.ttf', { family: 'Roboto' }); // eslint-disable-line max-len

		const canvas = Canvas.createCanvas(300, 300);
		const ctx = canvas.getContext('2d');
		const lines = await this._wrapText(ctx, personalMessage, 110);
		const base = new Image();
		const cond = new Image();
		const generate = async () => {
			// Environment Variables
			ctx.drawImage(base, 0, 0);
			ctx.scale(1, 1);
			ctx.patternQuality = 'billinear';
			ctx.filter = 'bilinear';
			ctx.antialias = 'subpixel';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
			ctx.shadowOffsetY = 2;
			ctx.shadowBlur = 2;

			// Username
			ctx.font = '20px Roboto';
			ctx.fillStyle = '#FFFFFF';
			ctx.fillText(user.displayName, 50, 173);

			ctx.font = '6px Roboto';
			ctx.fillStyle = '#FFFFFF';
			ctx.fillText(birthday, 215, 173);

			// EXP
			ctx.font = '10px Roboto';
			ctx.textAlign = 'center';
			ctx.fillStyle = '#3498DB';
			ctx.shadowColor = 'rgba(0, 0, 0, 0)';
			ctx.fillRect(10, 191, fillbeta / 100 * 136, 17);

			// EXP
			ctx.font = '10px Roboto';
			ctx.textAlign = 'center';
			ctx.fillStyle = '#333333';
			ctx.shadowColor = 'rgba(0, 0, 0, 0)';
      
      let expDraw;
      if (levelExp == 0) { 
        expDraw = 0; 
      } else {
        expDraw = currentExp/levelExp
      }
      
			ctx.fillText(`EXP: ${expDraw}`, 78, 203);

			// LVL
			ctx.font = '30px Roboto';
			ctx.textAlign = 'left';
			ctx.fillStyle = '#E5E5E5';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
			ctx.fillText('LVL.', 12, 235);

			// LVL Number
			ctx.font = '26px Roboto';
			ctx.fillStyle = '#E5E5E5';
			ctx.fillText(level, 86, 235);

			// Total EXP
			ctx.font = '14px Roboto';
			ctx.fillStyle = '#E5E5E5';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
			ctx.fillText('Total EXP', 12, 254);

			// Total EXP Number
			ctx.font = '14px Roboto';
			ctx.fillStyle = '#E5E5E5';
			ctx.fillText(totalExp, 86, 254);

			/* // Global Rank
			ctx.font = '14px Roboto';
			ctx.fillStyle = '#E5E5E5';
			ctx.fillText('Rank', 12, 270);

			// Global Rank Number
			ctx.font = '14px Roboto';
			ctx.fillStyle = '#E5E5E5';
			ctx.fillText('#1', 86, 270); */

			// Currency
			ctx.font = '14px Roboto';
			ctx.fillStyle = '#E5E5E5';
			ctx.fillText('Net Worth', 12, 287);

			// Currency Number
			ctx.font = '14px Roboto';
			ctx.fillStyle = '#E5E5E5';
			ctx.fillText(networth, 86, 287);

			// Info title
			ctx.font = '12px Roboto';
			ctx.fillStyle = '#333333';
			ctx.shadowColor = 'rgba(0, 0, 0, 0)';
			ctx.fillText('Info Box', 182, 207);

			// Info
			ctx.font = '12px Roboto';
			ctx.fillStyle = '#333333';
			lines.forEach((line, i) => {
				ctx.fillText(line, 162, (i + 18.6) * parseInt(12, 0));
			});

			// Image
			ctx.beginPath();
			ctx.arc(79, 76, 55, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();
			ctx.shadowBlur = 5;
			ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
			ctx.drawImage(cond, 24, 21, 110, 110);


		};

		function check(message) {
			if (message.mentions.users.first()) {
				if (message.mentions.users.first().id == 475644633825804301) {
					return 475644633825804301
				}
				if (message.mentions.users.first().id == 478727595719131146) {
					return 478727595719131146
				}
				if (message.mentions.users.first().id == 374934156620201988) {
					return 374934156620201988
				}
			}
			else if (msg.author.id == 478727595719131146) {
				return 478727595719131146;
			}
			else if (msg.author.id == 475644633825804301) {
				return 475644633825804301
			}
			else if (msg.author.id == 374934156620201988) {
				return 374934156620201988
			}
		}
		//msg.mentions.users.first().id == 475644633825804301 || msg.mentions.users.first().id == 478727595719131146||msg.author.id == 478727595719131146 || msg.author.id == 475644633825804301
		//base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'assets', 'profile', 'backgrounds', `${profile ? profile.background : 'default'}.png`)); // eslint-disable-line max-len
		if (check(msg) == 475644633825804301 || check(msg) == 478727595719131146) {
			base.src = await fs.readFileAsync('/app/xiao/assets/profile/backgrounds/tester.png')
		}
		else if (check(msg) == 374934156620201988) {
			base.src = await fs.readFileAsync('/app/xiao/assets/profile/backgrounds/dev+owner.png')
		}
		else {
			base.src = await fs.readFileAsync('/app/xiao/assets/profile/backgrounds/default.png')
		}
		cond.src = await request({
			uri: user.user.displayAvatarURL({ format: 'png' }),
			encoding: null
		});
		var scale2FitCurrentFont = function (ctx, text, width, height) {
			var points, fontWidth;
			points = Number(ctx.font.split("px")[0]); // get current point size
			points += points * 0.2; // As point size does not include hanging tails and
			// other top and bottom extras add 20% to the height
			// to accommodate the extra bits  
			var fontWidth = ctx.measureText(text).width;
			// get the max scale that will allow the text to fi the current font
			return Math.min(width / fontWidth, height / points);
		}

		generate();

		return msg.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'profile.png' }] });
	}

	_wrapText(ctx, text, maxWidth) {
		return new Promise(resolve => {
			const words = text.split(' ');
			let lines = [];
			let line = '';

			if (ctx.measureText(text).width < maxWidth) {
				return resolve([text]);
			}

			while (words.length > 0) {
				let split = false;
				while (ctx.measureText(words[0]).width >= maxWidth) {
					const tmp = words[0];
					words[0] = tmp.slice(0, -1);

					if (!split) {
						split = true;
						words.splice(1, 0, tmp.slice(-1));
					} else {
						words[1] = tmp.slice(-1) + words[1];
					}
				}

				if (ctx.measureText(line + words[0]).width < maxWidth) {
					line += `${words.shift()} `;
				} else {
					lines.push(line);
					line = '';
				}

				if (words.length === 0) {
					lines.push(line);
				}
			}

			return resolve(lines);
		});
	}
};
