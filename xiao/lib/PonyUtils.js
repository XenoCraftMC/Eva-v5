const {MessageEmbed} = require('discord.js');
const {stripIndents} = require('common-tags');
const moment = require('moment');

class PonyUtils {
    static randomInt(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    static generateSuccessEmbed(message, title, description,lvl) {
        return this.generateEmbed(message, title, description, lvl).setColor(0x8ed938);
    }

    static generateFailEmbed(message, title, description) {
        return this.generateEmbed(message, title, description).setColor(0xec3c42);
    }

    static generateInfoEmbed(message, title, description) {
        return this.generateEmbed(message, title, description).setColor(0x389ed9);
    }

    static generateEmbed(message, title, description, lvl) {
        return new MessageEmbed({
            title: title,
            description: description || '',
            timestamp: moment().format('LLL'),
            fields: [{
        name: "New Level",
        value: lvl
           }
           ],
          
 "thumbnail": {
      "url": message.author.displayAvatarURL()
    },
    "image": {
      "url": "https://cdn.discordapp.com/attachments/383668928921993218/485383654869172234/Level.png"
    },
            footer: {
                icon_url: message.author.displayAvatarURL(),
                text: message.author.tag
            },
        });
    }

    static async getHelpText(guild) {
        const prefix = guild.commandPrefix || guild.client.commandPrefix;

        const info = await guild.client.getInfo();

        return stripIndents`**LEVEL SYSTEM**
        __Get current level__: \`${prefix}rank\`
        __View leaderboard__: \`${prefix}leaderboard\`
        
        **REWARDS**
        __List all rewards__: \`${prefix}rewards\`
        __Add new reward__: \`${prefix}reward add [role] [level]\`
        __Remove existing reward__: \`${prefix}reward remove [role]\`
                
        **OTHER**
        __Help__: \`${prefix}help\`
        
        **INFORMATION**
        __GitHub Repository__: [DerAtrox/LevelPony](https://github.com/DerAtrox/LevelPony)
        __Version running__: [${info.version}](https://github.com/DerAtrox/LevelPony/commit/${info.version})`;
    }
}

module.exports = PonyUtils;