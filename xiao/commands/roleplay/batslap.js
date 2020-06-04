const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

module.exports = class CommandBatslap extends Command {
  constructor(client) {
    super(client, {
      name: "batslap",
      memberName: "batslap",
      description: "Slap another user as Batman.",
      group: "roleplay",
      example: "batslap <@mention | userid>",
      details: "Mention another user to slap them as batman.",
      args: [
        {
          key: 'slappee',
          prompt: 'Whom do you want to slap',
          type: 'member',
					default: message => message.author
        }
        ],
      clientPermissions: ["ATTACH_FILES"]
    });
  }

  async run(message, {slappee} ) { 
    const slapped = slappee
    const slapper = message.author;
    console.log(slapped, slapper)
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.batSlap(slapper.displayAvatarURL({format:"png", size:128}), slapped.user.displayAvatarURL({format:"png", size:256})), "batslap.png"));
  }
}