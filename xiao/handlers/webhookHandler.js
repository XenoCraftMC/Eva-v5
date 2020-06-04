const Discord = require('discord.js');

module.exports = class WebhookHandler {
  /**
   * Handles the webhooks sent by Bastion.
   * @constructor
   * @param {Object} webhooks The webhooks object in the `credentials.yaml` file.
   */
  constructor(webhooks) {
    if (!webhooks) return null;
    this.webhooks = [];
    for (let hook of Object.values(webhooks)) {
      this.webhooks.push(hook);
      let webhookCredentials = webhooks;
      this[hook] = {
        id: webhookCredentials.id,
        token: webhookCredentials.token
      };
      this.webHook = new Discord.WebhookClient(this[hook].id, this[hook].token);
    }
  }

  /**
   * Sends the specified message as a webhook to the specified webhook channel.
   * @function send
   * @param {String} webhook The name of the webhook where the message is to be sent.
   * @param {String|Number|Object} content The message content to send with the webhook. A string, number or Discord.js embed object.
   * @returns {void}
   */
  send(webhook, content) {
    if (this.webhooks) {
      if (typeof content === 'object' && !(content instanceof Array)) {
        content = {
          embeds: [ content ]
        };
      }
      if (content) {
        this.webHook.send(content).catch(() => {});
      }
    }
  }
};