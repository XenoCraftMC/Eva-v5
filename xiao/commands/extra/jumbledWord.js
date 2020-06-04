/*let activeChannels = [];

const {Command} = require('discord.js-commando'), 
  {MessageEmbed} = require('discord.js')

module.exports = class defaultroleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'unscrambleword',
      memberName: 'unscrambleword',
      group: 'extra',
      aliases: ['usw'],
      description: 'Unscramble the given jumbled word and increase your vocabulary skills while having fun with your friends.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }
async run(message) {
  try {
    if (activeChannels.includes(message.channel.id))  {
      /**
       * Error condition is encountered.
       * @fires error
       
      return message.say(this.client.i18n.error(message.guild.language, 'isGameInUse', 'jumbled word'));
    }

    let words = require('/app/xiao/assets/json/words.json');

    let word = words[Math.floor(Math.random() * words.length)];

    let jumbledWord = scramble(word);
    console.log(word)

    let question = await message.channel.send({
      embed: {
        color: this.client.colors.BLUE,
        description: `Here's your jumbled word: **${jumbledWord}**\nFirst person to unscramble it within 5 minutes wins the game.`
      }
    });

    activeChannels.push(message.channel.id);

    const wordsCollector = message.channel.createMessageCollector(
      msg => !msg.author.bot && msg.content.trim().toLowerCase() === word.toLowerCase(),
      { maxMatches: 1, time: 5 * 60 * 1000 }
    );ers, reason) => {
      if (reason === 'time') {
        message.channel.send({
          embed: {
            color: this.client.colors.RED,
            title: 'Jumbled Word',
            description: 'The game was ended as no one was able to answer within the given 5 minutes.'
          }
        }).then(() => {
          question.delete().catch(() => {});
        }).catch(e => {
          console.error(e);
        });
      }
      else if (reason === 'matchesLimit') {
        let answer = answers.first();

        message.channel.send({
          embed: {
            color: this.client.colors.BLUE,
            title: 'Jumbled Word',
            description: `Congratulations ${answer.author}! You solved the jumbled word.`
          }
        }).then(() => {
          question.delete().catch(() => {});
        }).catch(e => {
          console.error(e);
        });
      }

      activeChannels.splice(activeChannels.indexOf(message.channel.id), 1);
    });
  }
  catch (e) {
    console.error(e);
  }
};
}

function scramble(word) {
  word = word.split('');

  let i = word.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    let t = word[--i];
    word[i] = word[j];
    word[j] = t;
  }

  return word.join('');
}
      trivia.on('collect', ans => {
*/