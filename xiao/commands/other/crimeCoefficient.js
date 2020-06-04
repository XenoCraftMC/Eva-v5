 const Command = require('../../structures/Command');

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'crimecoeffcient',
			aliases: [ 'ccof', 'ccoef' ],
			group: 'other',
			memberName: 'crimecoeffcient',
			description: 'Find the crime coefficient of a user.',
      args:
      [
        {
          key: 'member1',
          prompt: 'Whom do you to find the Crime Coffefficient of?',
          type: 'member',
          default: (msg) => msg.author          
        }
        ]
		});
	}

async run(message, {member1}) {

  let usertag = member1.displayName;
    console.log(usertag)

  let userlength = usertag.length
  let userHash = 0;
  for (let i = 0; i < userlength; i++) {
    userHash += parseInt(usertag[i].charCodeAt(0));
  }
  let crimeCoefficient = Math.round(parseFloat(`0.${String(userHash)}`) * 500) + 1;
  let crimeStat;
  if (crimeCoefficient < 100) {
    crimeStat = 'Suspect is not a target for enforcement action. The trigger of Dominator will be locked.';
  }
  else if (crimeCoefficient < 300) {
    crimeStat = 'Suspect is classified as a latent criminal and is a target for enforcement action. Dominator is set to Non-Lethal Paralyzer mode. Suspect can then be knocked out using the Dominator.';
  }
  else {
    crimeStat = 'Suspect poses a serious threat to the society. Lethal force is authorized. Dominator will automatically switch to Lethal Eliminator. Suspect that is hit by Lethal Eliminator will bloat and explode.';
  }

  message.channel.send({
    embed: {
      color: 0x3498DB,
      title: `Crime Coefficient of ${member1.user.tag} is ${crimeCoefficient}`,
      description: crimeStat
    }
  }).catch(e => {
    console.error(e);
  });
};
}