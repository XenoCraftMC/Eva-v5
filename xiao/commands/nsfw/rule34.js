const booru = require('booru'),
  {Command} = require('discord.js-commando'),
  {MessageEmbed} = require('discord.js'),
  {stripIndents} = require('common-tags'),
  {deleteCommandMessages, stopTyping, startTyping} = require('../../components/util.js');
const https = require("https");
const xml2js = require('xml2js');


module.exports = class Rule34Command extends Command {
  constructor (client) {
    super(client, {
      name: 'rule34',
      memberName: 'rule34',
      group: 'nsfw',
      aliases: ['r34'],
      description: 'Find NSFW Content on Rule34',
      format: 'NSFWToLookUp',
      examples: ['rule34 Pyrrha Nikos'],
      guildOnly: false,
      nsfw: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'tags',
          prompt: 'What do you want to find NSFW for?',
          type: 'string',
          parse: p => p.split(' ')
        }
      ]
    });
  }

  async run (message, {tags}) {
    const search = await booru.search('r34', tags, {
          limit: 1,
          random: true
        }),
        common = await booru.commonfy(search),
        embed = new MessageEmbed(),
        imageTags = [];
        
      for (const tag in common[0].common.tags) {
        imageTags.push(`[#${common[0].common.tags[tag]}](${common[0].common.file_url})`);
      }
    embed
    .setTitle(`Rule34 image for ${tags.join(', ')}`)
        .setURL(common[0].common.file_url)
        .setColor('#FFB6C1')
        .setDescription(stripIndents`${imageTags.slice(0, 5).join(' ')}
          
          **Score**: ${common[0].common.score}`)

var url = 'https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + tags;

                https.get(url, function(res){
                    var body = '';
            
                    res.on('data', function(chunk){
                        body += chunk;
                    });
            
                    res.on('end', function(){
                        var parser = new xml2js.Parser();
                        parser.parseString(body, function (err, result) {
                            var postCount = result.posts.$.count - 1;
                            if(postCount > 100) {
                                postCount = 100;
                            }
                            if(postCount > 0) {
                                var picNum = Math.floor(Math.random() * postCount) + 0;
                                var r34Pic = result.posts.post[picNum].$.file_url;
                                // console.log(result.posts.post[picNum].$.file_url);
                              embed
                              .setImage(r34Pic)
                                message.channel.send({
                                  embed                                
                                });
                            
                            } else {
                                console.log("Nothing found:", tags);
                                message.channel.send("Nobody here but us chickens!");
                            }

                            });
                        });
                    }).on('error', function(e){
                        console.log("Got an error: ", e);
                });
};
}