module.exports = (Sequelize, database) => {
const Guild = database.define('guild', {
  guildID: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    autoAssignableRoles: {
      type: Sequelize.JSON,
      unique: true
    }
  });
  
    database.sync();

    return database.models;
}