const {Command} = require('discord.js-commando')

const request = require('request-promise-native');
let activeChannels = [];

module.exports = class TriviaCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'trivia',
      memberName: 'trivia',
      group: 'extra',
      description: 'Asks a trivia question. Answer and see how much knowledge you\'ve on everything.',
      guildOnly: false,
      args:[
        {
          key: 'diff',
          prompt: 'What difficulty should the trivia be set on?',
          type: 'string',
          default: 'easy',
          validate: (bool) => {
            const validBools = [ 'easy', 'medium', 'hard' ];
            if (validBools.includes(bool.toLowerCase())) {
              return true;
            }

            return `Has to be one of ${validBools.map(val => `\`${val}\``).join(', ')}
            Respond with your new selection or`;
          }
        }
        ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run (message,{diff}) {
    const right = this.client.emojis.get("513607953962500097");
    const wrong = this.client.emojis.get("513607891609976832");
    try {
    if (activeChannels.includes(message.channel.id))  {
      return message.channel.send('Cannot start the trivia game now. It is already running in this channel. Please wait for it to end.');
    }
      
    let difficulties = [ 'easy', 'medium', 'hard' ];
    //args.difficulty = difficulties.includes(args.difficulty.toLowerCase()) ? args.difficulty.toLowerCase() : 'easy';

    let options = {
      method: 'GET',
      url: `https://opentdb.com/api.php?amount=1&type=boolean&difficulty=${diff}&encode=url3986`,
      json: true
    };
    let response = await request(options);
    if (!response) {
      return message.channel.send("Some error has occurred while receiving data from the server. Please try again later.")
    }

    response = response.results[0];
    let question = await message.channel.send({
      embed: {
      author: {
      name: 'Trivia - True/False',
      icon_url: message.author.displayAvatarURL()
    },
        color: 0x3498DB,
        //title: 'Trivia - True/False',
        description: decodeURIComponent(response.question),
        thumbnail: {
          url: "https://cdn4.iconfinder.com/data/icons/bulletin-board/95/trivia-512.png"
        },
        fields: [
          {
            name: 'Category',
            value: '`' + decodeURIComponent(response.category) + '`',
            inline: true
          },
          {
            name: 'Difficulty',
            value: '`' + response.difficulty.toTitleCase() + '`',
            inline: true
          }
        ],
        footer: {
          text: 'Reply with either True/False within 60 seconds. You have 2 attempts.'
        }
      }
    });

    activeChannels.push(message.channel.id);

    let validAnswers = [
      'true',
      'false'
    ];
      
    let correctBool = false;
      
    const trivia = message.channel.createMessageCollector(
      msg => !msg.author.bot && validAnswers.includes(msg.content.toLowerCase()),
      { maxMatches: 1, time: 60 * 1000 , max: 3}
    );
          let chances = []

    trivia.on('collect', ans => {
      // chances++
      
      function find(id){
        for(var i = 0; i < chances.length; i++) {
          if (chances[i].id == id) {
            return ['true', chances[i].id]
            break;
          }
        }
      }
      
      try {
        console.log('here', find(message.author.id)[0] == 'true', find(message.author.id)[0], find(message.author.id)[1])
      if (find(message.author.id)[0] == 'true') {  
         function changeDesc( value, desc ) {
           for (var i in chances) {
             if (chances[i].id == value) {
                chances[i].chances = desc;
                break; //Stop this loop, we found it!
              }
           }
          }    
        
        changeDesc(chances.findIndex(id => id.id == find(message.author.id)[1]), chances[chances.findIndex(id => id.id == find(message.author.id)[1])].chances++)
      }
      } catch(e) {
        console.log(e)
          var uid = {id: message.author.id, chances: 0}
          chances.push(uid)
    }
      /*var finalFind = find(message.author.id)
      var finalRef = chances.findIndex(id => id.id == finalFind[1]);*/
      //console.log(finalFind, finalRef, chances[finalRef].chances)
      
      if (chances[chances.findIndex(id => id.id == find(message.author.id)[1])].chances >= 3) { 
      return message.channel.send({
        embed: {
          color: this.client.colors.RED,
          description: `${wrong} You have exhausted your chances. Ending game. Correct answer is ${response.correct_answer}`
        }        
      })
      }
      
      let color, description;
      if (ans.content.toLowerCase() === response.correct_answer.toLowerCase() && chances[chances.findIndex(id => id.id == find(message.author.id)[1])].chances  <= 3 && correctBool == false) {
        color = 0x3498DB;
        description = `${right} ${ans.author.tag} you're absolutely right.`;
        correctBool = true
      }
      else {
        if (ans.content.toLowerCase() === response.correct_answer.toLowerCase()) {
                activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);

          return;
      }
        if ((correctBool == false || ans.content.toLowerCase() != response.correct_answer.toLowerCase()) || (correctBool == false && ans.content.toLowerCase() != response.correct_answer.toLowerCase())) {
        color = 0xE74C3C;
        description = `${wrong} Unfortunately, you're wrong ${ans.author.tag}`;
      }
      }

      return message.channel.send({
        embed: {
          color: color,
          description: description
        }
      }).catch(e => {
       console.error(e);
      });
    });

    trivia.on('end', (answers, reason) => {
      activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);

      if (reason === 'time') {
        message.channel.send({
          embed: {
            color: 0xE74C3C,
            title: 'Trivia Ended',
            description: `${wrong} Trivia was ended as 60 seconds had passed.`
          }
        }).then(() => {
          question.delete().catch(e => {
            console.error(e);
          });
        }).catch(e => {
          console.error(e);
        });
      }
    });
  }
  catch (e) {
    if (e.response) {
      return message.channel.send('An error occured: ' + e.response.statusCode + e.response.statusMessage)
    }
    console.error(e);
  }
  }
}