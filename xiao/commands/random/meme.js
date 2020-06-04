const Command = require('../../structures/Command');
const { MessageEmbed} = require('discord.js')


module.exports = class MemeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'givememe',
			group: 'random',
			memberName: 'givememe',
			description: 'Responds with a random meme.'
		});
	}

  async run(msg) {
    this.indexes = {
			'meme': {},
			'joke': {},
			'shitpost': {},
			'thonks':{}
		}
    
  const res = await require('snekfetch').get('https://www.reddit.com/u/kerdaloo/m/dankmemer/top/.json?sort=top&t=day&limit=500')
	const posts = res.body.data.children.filter(post => post.data.preview)
  console.log(posts)
  
  
  const embed = new MessageEmbed()
  .setTitle(posts.title)
  .setColor("RANDOM")
  .setURL(posts.url)
  .setImage(posts.url)
  .setDescription(posts.url)
  .setFooter(`posted by ${posts.author}`)
return msg.embed(embed)
  }}
