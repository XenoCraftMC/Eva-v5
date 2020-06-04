const {Command} = require('discord.js-commando')
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['commands', 'command-list'],
			group: 'util',
			memberName: 'help',
			description: 'Displays a list of available commands, or detailed information for a specific command.',
			guarded: true,
			throttling: { usages: 1, duration: 2 },
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'command',
					default: ''
				},
			]
		});
	}

	async run(msg, { command }) {
    try {
		  let count = 0;
		  if (!command) {
			  const embed = new MessageEmbed()
				  .setTitle('Command List')
				  .setDescription(`Use ${msg.usage('<command>')} to view detailed information about a command.`)
				  .setColor(0x00AE86)
				  .setFooter(`${this.client.registry.commands.size} Commands`);
			  const embed2 = new MessageEmbed()
				  .setTitle('Command List')
          .setDescription(`Use ${msg.usage('<command>')} to view detailed information about a command.`)
				  .setColor(0x00AE86)
          .setFooter(`${this.client.registry.commands.size} Commands`);

			  for (const group of this.client.registry.groups.values()) {
			  	if (count >= 25) {
				    embed2.addField(`❯ ${group.name}`, group.commands.map(cmd => cmd.name).join(', ') || 'None');
				  }
				
				  else if (count < 25) {
				    embed.addField(`❯ ${group.name}`, group.commands.map(cmd => cmd.name).join(', ') || 'None');
				  }
				  count += 1
			  }
        console.log(count)
      
			try {
        
				const msgs = [];
				msgs.push(await msg.direct({ embed }));
        msgs.push(await msg.direct(embed2))
				if (msg.channel.type !== 'dm') msgs.push(await msg.say('📬 Sent you a DM with information.'));
				//return [await msg.direct({ embed }), await msg.direct(embed2)]
        return msgs
			} catch (err) {
        console.log(err)
          /*function jsUcfirst(string) 
          {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }*/
				  msg.reply('Failed to send DM. You probably have DMs disabled. Sending help message here.');
        msg.say(embed)
        msg.say(embed2)

        
        
         /* if (type) type = type.toLowerCase();
          if (pagex) pagex = parseInt(pagex);
  
  /*let pages = [`${funhelp}`, `${msghelp}`, `${rphelp}`, `${imghelp}`, 'All you need to do is add another item in the array', '**Supports markdown and regular chat description properties**']; 
  let page = 1; */
        
   /* const helpee = new MessageEmbed()
      .setTimestamp()
      .setColor(6192321)
      .setFooter(`Requested by ${msg.author.tag} | `, msg.author.avatarURL()()); 

    let currentCategory = "";
    let array = []
    let array2 = []
    let array3 =[]
    let countx = 0;
    let output1;
    const sorted = this.client.registry.groups/*.sort((p, c) => p.category > c.category ? 1 :  p.name > c.name && p.category === c.category ? 1 : -1 );*/
    
  /*  if (!type) {
      const description = `Command category list\n\nUse \`${msg.guild.commandPrefix}help <category>\` to find commands for a specific category`;
      const output = sorted.filter(c => !(c.id === "owner") || !(c.id === "nsfw" && !msg.channel.nsfw)).map(c => {
        const cat = jsUcfirst(c.id);
        if (currentCategory !== cat && !type) {
          currentCategory = cat;
          if (countx >= 11 && countx < 21) {
            array2.push(`\`${msg.guild.commandPrefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands`)
          } else if (countx  >= 22) {
            array3.push(`\`${msg.guild.commandPrefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands`)
          } else {
          array.push(`\`${msg.guild.commandPrefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands`)
          }
          countx++
        }
      }).join("");
      
      helpee.setDescription(description)
      async function function2() {
       await array.forEach(function(i) {
       output1 = output + i
      })
    }
      function function1() {
        helpee.addField('Categories', output1)
      }
        
      function2()
      console.log(output1)
      setTimeout(function1, 3000);
      }
      return msg.channel.send(helpee);
      
   } /*else {
      if (this.client.commands.has(type)) {
        const cm = this.client.commands.get(type) || this.client.commands.get(this.client.aliases.get(type));
        helpee.setTitle(cm.name.toProperCase())
          .addField("Command description", cm.description)
          .addField("Command usage", `\`${cm.usage}\``)
          .addField("Command aliases", cm.aliases.length === 0 ? "None" : cm.aliases.join(", ") )
          .addField("Extended description", cm.extended);

      } else {
        let n = 0;
        sorted.forEach(c => {
          c.category.toLowerCase() === type ? n++ : n;
        });
    
        let output = "";
        let num = 0;
        const pg = page && page <= Math.ceil(n / perpage) ? page : 1;
        for (const c of sorted.values()) {
          if (c.category.toLowerCase() === type) {
            if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
              if (c.category === "NSFW" && !msg.channel.nsfw) continue;
              output += `\n\`${msg.guild.commandPrefix + c.name}\` | ${c.description.length > 50 ? c.description.slice(0,50) +"...": c.description}`;
            }
            num++;
          }
        }
    
        if (!num) return;
        helpee.setTitle("Command category help")
          .setDescription(`A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${msg.guild.commandPrefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${msg.guild.commandPrefix}help <category> 2\`` : "" }`)
          .addField("Commands", output);
      
      }
    }*/
     /*msg.channel.send(helpee).then(msg => { 
      msg.react('⏪').then( r => { 
      msg.react('⏩')    
      const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id;
      const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏩' && user.id === msg.author.id; 
     
      const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 }); 
      const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 }); 
          
      backwards.on('collect', r => { 
        if (page === 1) return; 
        page--; 
        embed.setDescription(pages[page-1]); 
        embed.setFooter(`Page ${page} of ${pages.length}`); 
        msg.edit(embed) 
      })
     
      forwards.on('collect', r => { 
        if (page === pages.length) return; 
        page++; 
        embed.setDescription(pages[page-1]); 
        embed.setFooter(`Page ${page} of ${pages.length}`); 
        msg.edit(embed) 
      })  
    }) 
  }) */
}
}
      //${command.argsCollector.args.forEach(arg => console.log(arg.key, arg.type))}
		return msg.say(stripIndents`
			__Command **${command.name}**__${command.guildOnly ? ' (Usable only in servers)' : ''}
			${command.description}${command.details ? `\n_${command.details}_` : ''}

			**Format**: ${msg.anyUsage(`${command.name} ${command.format || ''}`)}
			**Aliases**: ${command.aliases.join(', ') || 'None'}
			**Group**: ${command.group.name} (\`${command.groupID}:${command.memberName}\`)
		`);
	} catch (e) { console.log(e) }
};
}