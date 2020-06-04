const { CommandoClient, CommandoClientOptions } = require('discord.js-commando');
const exec = require('child_process').exec;
const PonyDatabase = require('./PonyDatabase');

const PonyLevels = require('./PonyLevels');
const PonyRewards = require('./PonyRewards');
const idioticApi = require("./IdioticAPI.js");
const Database = require('/app/xiao/structures/Sequelize');
const StringHandler = require('/app/xiao/handlers/stringHandler');
const WebhookHandler = require('/app/xiao/handlers/webhookHandler.js');

class PonyCommandoClient extends CommandoClient {
    constructor(options) {
        super(options || new CommandoClientOptions());

        this.logger = require('simple-node-logger').createSimpleLogger();

        this.database = new PonyDatabase(this);
        this.levels = new PonyLevels(this);
        this.rewards = new PonyRewards(this);
        this.idiotAPI = new idioticApi(process.env.IDIOTAPI, { dev: true });
        this.i18n = new StringHandler();
        this.package = require('/app/package.json')
        this.methods = require('/app/xiao/handlers/methodHandler');
        this.webhook = new WebhookHandler({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN });
        this.colors = {
            DEFAULT: 0x000000,
            WHITE: 0xFFFFFF,
            AQUA: 0x1ABC9C,
            GREEN: 0x2ECC71,
            BLUE: 0x3498DB,
            PURPLE: 0x9B59B6,
            LUMINOUS_VIVID_PINK: 0xE91E63,
            GOLD: 0xF1C40F,
            ORANGE: 0xE67E22,
            RED: 0xE74C3C,
            GREY: 0x95A5A6,
            NAVY: 0x34495E,
            DARK_AQUA: 0x11806A,
            DARK_GREEN: 0x1F8B4C,
            DARK_BLUE: 0x206694,
            DARK_PURPLE: 0x71368A,
            DARK_VIVID_PINK: 0xAD1457,
            DARK_GOLD: 0xC27C0E,
            DARK_ORANGE: 0xA84300,
            DARK_RED: 0x992D22,
            DARK_GREY: 0x979C9F,
            DARKER_GREY: 0x7F8C8D,
            LIGHT_GREY: 0xBCC0C0,
            DARK_NAVY: 0x2C3E50,
            BLURPLE: 0x7289DA,
            GREYPLE: 0x99AAB5,
            DARK_BUT_NOT_BLACK: 0x2C2F33,
            NOT_QUITE_BLACK: 0x23272A,
        };
        Database.start();


    }

    async getInfo() {
        let client = this;

        let info = {};

        return new Promise((fulfill, reject) => {
            function getVersion() {
                exec('git rev-parse --short=4 HEAD', function (error, version) {
                    if (error) {
                        client.logger.error(`Error getting version ${error}`);
                        info.version = 'unknown';
                    } else {
                        info.version = version.trim();
                    }

                    getMessage();
                });
            }

            function getMessage() {
                exec('git log -1 --pretty=%B', function (error, message) {
                    if (error) {
                        client.logger.error(`Error getting commit message ${error}`);
                        info.message = "Could not get last commit message.";
                    } else {
                        info.message = message.trim();
                    }

                    getTimestamp();
                });
            }

            function getTimestamp() {
                exec('git log -1 --date=short --pretty=format:%ci', function (error, timestamp) {
                    if (error) {
                        client.logger.error(`Error getting creation time ${error}`);
                        info.timestamp = "Not available";
                    } else {
                        info.timestamp = timestamp;
                    }

                    fulfill(info);
                });
            }

            getVersion();
        });
    }
}

module.exports = PonyCommandoClient;