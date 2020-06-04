const Sequelize = require('sequelize')

const guildDatabase = new Sequelize('guildDB', null, null, {
  dialect: "sqlite",
  storage: '/app/xiao/data/databases/autoRoles.sqlite',
  operatorsAliases: false,
  logging: false
});


guildDatabase.authenticate().then(() => {
  require('/app/xiao/utils/autoRoleModel')(Sequelize, guildDatabase);
})


module.exports = guildDatabase