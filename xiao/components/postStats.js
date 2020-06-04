const dbotsPS = (client, dbots) => {
dbots.postStats(client.guilds.size)
      setInterval(() => {
        console.log('DBotsList guild count updated.');
        }, 1800000);
}

const postDiscordStats = (client) => {
 async function postDiscordStats () {
  const botlistSpace = require('axios')({
    method: 'post',
    url: `https://botlist.space/api/bots/${client.user.id}`,
    headers: {
      Authorization: process.env.BLSkey
    },
    data: {
      server_count: client.guilds.size
    }
  }).then(function (response) {
    console.log(response)
  })
  
  const discordbotlist = require('axios')({
    method: 'post',
    url: `https://discordbotlist.com/api/bots/${client.user.id}/stats`,
    headers: {
      Authorization: process.env.DBLkey
    },
    data: {
      guilds: client.guilds.size,
      user: client.users.size,
      voice_Connection: client.voiceConnections.size,
    }
  }).then(function (response) {
    console.log(response)
  })
  
  //const [bspaceres] = await Promise.all([botlistSpace])// eslint-disable-line no-unused-vars
 // console.log(bspaceres.res)
  }
}

module.exports = {
  dbotsPS,
  postDiscordStats
}